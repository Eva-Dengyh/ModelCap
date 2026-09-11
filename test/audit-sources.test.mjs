import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import test from 'node:test'
import { auditUrls, collectSources } from '../skill/scripts/audit-sources.mjs'

async function withServer(handler, run) {
  const server = createServer(handler)
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const { port } = server.address()
  try {
    await run(`http://127.0.0.1:${port}`)
  } finally {
    server.closeAllConnections()
    await new Promise((resolve) => server.close(resolve))
  }
}

test('collectSources deduplicates URLs and preserves model references', () => {
  const sources = collectSources([
    {
      model_id: 'model-a',
      source_url: 'https://example.com/docs',
      pricing: { source: 'https://example.com/pricing' },
    },
    {
      model_id: 'model-b',
      source_url: 'https://example.com/docs',
      pricing: { source: 'https://example.com/pricing' },
    },
  ])

  assert.deepEqual(sources, [
    {
      url: 'https://example.com/docs',
      model_ids: ['model-a', 'model-b'],
      kinds: ['model'],
    },
    {
      url: 'https://example.com/pricing',
      model_ids: ['model-a', 'model-b'],
      kinds: ['pricing'],
    },
  ])
})

test('auditUrls records hashes, redirects, and HTTP failures', async () => {
  await withServer((request, response) => {
    if (request.url === '/redirect') {
      response.writeHead(302, { location: '/ok' })
      response.end()
      return
    }
    if (request.url === '/missing') {
      response.writeHead(404)
      response.end('missing')
      return
    }
    response.writeHead(200, { etag: '"v1"', 'last-modified': 'Fri, 11 Sep 2026 00:00:00 GMT' })
    response.end('alpha')
  }, async (baseUrl) => {
    const results = await auditUrls([
      { url: `${baseUrl}/ok`, model_ids: ['a'], kinds: ['model'] },
      { url: `${baseUrl}/redirect`, model_ids: ['b'], kinds: ['model'] },
      { url: `${baseUrl}/missing`, model_ids: ['c'], kinds: ['pricing'] },
    ], { concurrency: 2, timeoutMs: 1000 })

    const ok = results.find((item) => item.url.endsWith('/ok'))
    const redirected = results.find((item) => item.url.endsWith('/redirect'))
    const missing = results.find((item) => item.url.endsWith('/missing'))
    assert.equal(ok.outcome, 'ok')
    assert.equal(ok.etag, '"v1"')
    assert.equal(ok.body_sha256, createHash('sha256').update('alpha').digest('hex'))
    assert.equal(redirected.outcome, 'redirected')
    assert.equal(redirected.final_url, `${baseUrl}/ok`)
    assert.equal(missing.outcome, 'client_error')
    assert.equal(missing.status, 404)
  })
})

test('auditUrls reports timeouts without throwing', async () => {
  await withServer((_request, response) => {
    setTimeout(() => response.end('late'), 100)
  }, async (baseUrl) => {
    const [result] = await auditUrls([
      { url: `${baseUrl}/slow`, model_ids: ['slow'], kinds: ['model'] },
    ], { concurrency: 1, timeoutMs: 20 })

    assert.equal(result.outcome, 'timeout')
    assert.match(result.error, /time|abort/i)
  })
})

test('auditUrls never exceeds configured concurrency', async () => {
  let active = 0
  let maximum = 0
  await withServer((_request, response) => {
    active += 1
    maximum = Math.max(maximum, active)
    setTimeout(() => {
      active -= 1
      response.end('ok')
    }, 30)
  }, async (baseUrl) => {
    const sources = Array.from({ length: 6 }, (_, index) => ({
      url: `${baseUrl}/wait/${index}`,
      model_ids: [`model-${index}`],
      kinds: ['model'],
    }))

    const results = await auditUrls(sources, { concurrency: 2, timeoutMs: 1000 })

    assert.equal(results.length, 6)
    assert.equal(maximum, 2)
  })
})

test('auditUrls rejects invalid worker configuration', async () => {
  await assert.rejects(
    auditUrls([], { concurrency: 0 }),
    /concurrency must be a positive integer/,
  )
  await assert.rejects(
    auditUrls([], { timeoutMs: 0 }),
    /timeoutMs must be a positive integer/,
  )
})

#!/usr/bin/env node
/**
 * send-feishu.mjs —— 把消息/文件内容推到飞书群机器人 webhook（支持签名校验）。
 *
 * 用法：
 *   node scripts/send-feishu.mjs "要发送的文本"
 *   node scripts/send-feishu.mjs --file models/seedance-2-5.md "标题或描述"
 *   node scripts/send-feishu.mjs --file models/seedance-2-5.json
 *
 * webhook 来源（优先级从高到低）：
 *   1. --webhook <url>
 *   2. 环境变量 FEISHU_WEBHOOK
 *   3. ~/.agents/skills/model-catalog/config.json 里的 feishu_webhook
 *
 * 签名 secret 来源（优先级从高到低）：
 *   1. --secret <值>
 *   2. 环境变量 FEISHU_SECRET
 *   3. ~/.agents/skills/model-catalog/config.json 里的 feishu_secret
 *   （机器人开启"签名校验"时必须提供；未开启时可省略）
 *
 * 注意：webhook 和 secret 等于群的发送权限，不要提交进仓库或公开分享。
 */

import { readFileSync } from 'node:fs'
import { createHmac } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = join(__dirname, '..')

const MAX_TEXT = 4000 // 飞书文本消息单条上限约 4000 字符

function parseArgs(argv) {
  const args = { text: '', file: null, webhook: null, secret: null }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--file') args.file = argv[++i]
    else if (a === '--webhook') args.webhook = argv[++i]
    else if (a === '--secret') args.secret = argv[++i]
    else if (a === '--help' || a === '-h') {
      console.log(
        '用法:\n' +
        '  发文本: node scripts/send-feishu.mjs "内容"\n' +
        '  发文件内容: node scripts/send-feishu.mjs --file <路径> [描述]',
      )
      process.exit(0)
    }
    else if (!a.startsWith('-')) args.text += (args.text ? ' ' : '') + a
  }
  return args
}

function loadConfig() {
  const cfgPath = join(homedir(), '.agents', 'skills', 'model-catalog', 'config.json')
  try {
    return JSON.parse(readFileSync(cfgPath, 'utf8'))
  } catch { return {} }
}

function resolveWebhook(cli) {
  if (cli) return cli
  if (process.env.FEISHU_WEBHOOK) return process.env.FEISHU_WEBHOOK
  return loadConfig().feishu_webhook || null
}

function resolveSecret(cli) {
  if (cli) return cli
  if (process.env.FEISHU_SECRET) return process.env.FEISHU_SECRET
  return loadConfig().feishu_secret || null
}

// 飞书签名算法（官方）：key = `${timestamp}\n${secret}`，对空串做 HMAC-SHA256，base64 输出。
// sign 与 timestamp 都放在请求体里（不是 header）。经实测确认。
function feishuSign(timestamp, secret) {
  const stringToSign = `${timestamp}\n${secret}`
  return createHmac('sha256', stringToSign).update('').digest('base64')
}

async function post(webhook, payload, secret) {
  if (secret) {
    const timestamp = Math.floor(Date.now() / 1000)
    payload.timestamp = timestamp
    payload.sign = feishuSign(timestamp, secret)
  }
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (body.code !== 0 && !(body.StatusCode === 0)) {
    throw new Error(`飞书返回错误: code=${body.code} msg=${body.msg || ''}`)
  }
  return body
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const webhook = resolveWebhook(args.webhook)
  const secret = resolveSecret(args.secret)
  if (!webhook) {
    console.error('未找到 webhook。请用 --webhook 或设置环境变量 FEISHU_WEBHOOK。')
    process.exit(1)
  }
  if (secret) console.log('✓ 已启用签名校验')
  if (!args.text && !args.file) {
    console.error('没有内容可发送。用法: node scripts/send-feishu.mjs "文本" 或 --file <路径>')
    process.exit(2)
  }

  let text = args.text
  if (args.file) {
    try {
      const content = readFileSync(args.file, 'utf8')
      text = (args.text ? args.text + '\n\n' : '') + content
    } catch (err) {
      console.error(`读取文件失败: ${err.message}`)
      process.exit(3)
    }
  }

  if (text.length > MAX_TEXT) {
    text = text.slice(0, MAX_TEXT) + '\n…（内容过长已截断）'
  }

  post(webhook, { msg_type: 'text', content: { text } }, secret)
    .then(() => console.log('✓ 已发送到飞书'))
    .catch((err) => {
      console.error(`✗ 发送失败: ${err.message}`)
      process.exit(4)
    })
}

main()

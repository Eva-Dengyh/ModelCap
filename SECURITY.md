# Security Policy

ModelCap is a static catalog and zero-runtime-dependency SDK. It does not call provider APIs, store credentials, or process user media.

## Supported Versions

Security reports are accepted for the current `main` branch.

## Reporting a Vulnerability

Please open a private security advisory on GitHub if available, or contact the maintainer directly before public disclosure.

Useful reports include:

- Package contents accidentally exposing secrets or private files.
- SDK behavior that could leak local data.
- Tooling that writes outside the repository unexpectedly.
- Supply-chain risks in project dependencies or workflows.

## Not Security Vulnerabilities

- A provider changing public documentation.
- A stale model price or capability field.
- A validation warning where official documentation is incomplete.
- A missing model entry.

Please open a normal issue for data corrections and freshness problems.

## Secret Handling

Do not submit provider API keys, account identifiers, private URLs, internal logs, user prompts, user media, or proprietary benchmark output in issues or pull requests.

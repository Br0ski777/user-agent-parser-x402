# User Agent Parser API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://user-agent-parser.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Parse any user agent string into structured data: browser, OS, device type, engine, and bot detection in one call. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "user-agent-parser": {
      "url": "https://user-agent-parser.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://user-agent-parser.api.klymax402.com/api/parse" \
  -H "Content-Type: application/json" \
  -d '{"userAgent":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `utility_parse_user_agent` | POST | `/api/parse` | $0.001 | Parse a user agent string into structured data |

### `utility_parse_user_agent`

Use this when you need to parse a user agent string to identify the client's browser, OS, device type, and bot status. Returns fully structured data.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `userAgent` | string | yes | The user agent string to parse |

Example response:

```json
{"browser":{"name":"Chrome","version":"120.0"},"os":{"name":"Windows","version":"11"},"device":{"type":"desktop","vendor":null,"model":null},"engine":"Blink","isBot":false,"botName":null}
```

**When to use**: analytics pipelines that need to classify traffic by device or browser, detecting bot traffic in access logs, or adapting content based on client capabilities.

**Not for**: HTTP header analysis (use `utility_parse_http_headers`), web scraping (use `web_scrape_to_markdown`), SEO auditing (use `seo_audit_page`).

## Example agent prompts

- "Parse a user agent string to identify the client's browser, OS, device type, and bot status"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT

import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "user-agent-parser",
  slug: "user-agent-parser",
  description: "Parse any user agent string into structured data: browser, OS, device type, engine, and bot detection in one call.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/parse",
      price: "$0.001",
      description: "Parse a user agent string into structured data",
      toolName: "utility_parse_user_agent",
      toolDescription: `Use this when you need to parse a user agent string to identify the client's browser, OS, device type, and bot status. Returns fully structured data.

1. browser -- name and version (e.g. "Chrome 120.0")
2. os -- operating system name and version (e.g. "Windows 11")
3. device -- type (desktop, mobile, tablet), vendor, and model
4. engine -- rendering engine (Blink, Gecko, WebKit)
5. isBot -- boolean indicating if the UA belongs to a crawler/bot
6. botName -- name of the bot if detected (e.g. "Googlebot")

Example output: {"browser":{"name":"Chrome","version":"120.0"},"os":{"name":"Windows","version":"11"},"device":{"type":"desktop","vendor":null,"model":null},"engine":"Blink","isBot":false,"botName":null}

Use this FOR analytics pipelines that need to classify traffic by device or browser, detecting bot traffic in access logs, or adapting content based on client capabilities.

Do NOT use for HTTP header analysis -- use utility_parse_http_headers instead. Do NOT use for web scraping -- use web_scrape_to_markdown instead. Do NOT use for SEO auditing -- use seo_audit_page instead.`,
      inputSchema: {
        type: "object",
        properties: {
          userAgent: { type: "string", description: "The user agent string to parse" },
        },
        required: ["userAgent"],
      },
      outputSchema: {
          "type": "object",
          "properties": {
            "raw": {
              "type": "string",
              "description": "Raw user agent string"
            },
            "browser": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "version": {
                  "type": "string"
                }
              }
            },
            "os": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "version": {
                  "type": "string"
                }
              }
            },
            "device": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string"
                },
                "brand": {
                  "type": "string"
                },
                "model": {
                  "type": "string"
                }
              }
            },
            "isBot": {
              "type": "boolean",
              "description": "Whether UA is a bot/crawler"
            },
            "isMobile": {
              "type": "boolean"
            },
            "length": {
              "type": "number"
            }
          },
          "required": [
            "raw",
            "browser",
            "os"
          ]
        },
    },
  ],
};

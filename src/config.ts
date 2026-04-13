import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "user-agent-parser",
  slug: "user-agent-parser",
  description: "Parse user agent strings to detect browser, OS, device, and bot info.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/parse",
      price: "$0.001",
      description: "Parse a user agent string into structured data",
      toolName: "utility_parse_user_agent",
      toolDescription: "Use this when you need to parse a user agent string to identify browser name/version, operating system, device type (mobile/desktop/tablet), and whether it's a bot/crawler. Returns structured data about the client. Do NOT use for HTTP header analysis — use utility_parse_http_headers instead. Do NOT use for web scraping — use web_scrape_to_markdown instead.",
      inputSchema: {
        type: "object",
        properties: {
          userAgent: { type: "string", description: "The user agent string to parse" },
        },
        required: ["userAgent"],
      },
    },
  ],
};

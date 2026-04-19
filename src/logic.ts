import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  engine: { name: string; version: string };
  isBot: boolean;
  botName: string | null;
}

function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: { name: "Unknown", version: "" },
    os: { name: "Unknown", version: "" },
    device: { type: "desktop", vendor: "", model: "" },
    engine: { name: "Unknown", version: "" },
    isBot: false,
    botName: null,
  };

  // Bot detection
  const botPatterns: [RegExp, string][] = [
    [/googlebot/i, "Googlebot"], [/bingbot/i, "Bingbot"], [/slurp/i, "Yahoo Slurp"],
    [/duckduckbot/i, "DuckDuckBot"], [/baiduspider/i, "Baiduspider"], [/yandexbot/i, "YandexBot"],
    [/facebookexternalhit/i, "Facebook"], [/twitterbot/i, "Twitterbot"], [/linkedinbot/i, "LinkedInBot"],
    [/whatsapp/i, "WhatsApp"], [/telegrambot/i, "TelegramBot"], [/slackbot/i, "Slackbot"],
    [/claudebot/i, "ClaudeBot"], [/gptbot/i, "GPTBot"], [/anthropic/i, "Anthropic"],
    [/bot|crawler|spider|scraper/i, "Generic Bot"],
  ];
  for (const [re, name] of botPatterns) {
    if (re.test(ua)) { result.isBot = true; result.botName = name; break; }
  }

  // Browser detection
  const browsers: [RegExp, string][] = [
    [/edg(?:e|a|ios)?\/(\S+)/i, "Edge"], [/opr\/(\S+)/i, "Opera"], [/opera.*version\/(\S+)/i, "Opera"],
    [/vivaldi\/(\S+)/i, "Vivaldi"], [/brave\/(\S+)/i, "Brave"], [/chrome\/(\S+)/i, "Chrome"],
    [/firefox\/(\S+)/i, "Firefox"], [/safari\/(\S+)/i, "Safari"], [/msie\s(\S+)/i, "IE"],
    [/trident\/.*rv:(\S+)/i, "IE"],
  ];
  for (const [re, name] of browsers) {
    const m = ua.match(re);
    if (m) { result.browser = { name, version: m[1].replace(/;.*$/, "") }; break; }
  }

  // OS detection
  const osPatterns: [RegExp, string, number?][] = [
    [/windows nt (\d+\.\d+)/i, "Windows"], [/mac os x (\d+[._]\d+[._]?\d*)/i, "macOS"],
    [/android (\d+\.?\d*)/i, "Android"], [/iphone os (\d+_\d+)/i, "iOS"],
    [/ipad.*os (\d+_\d+)/i, "iPadOS"], [/linux/i, "Linux"], [/cros/i, "ChromeOS"],
  ];
  for (const [re, name] of osPatterns) {
    const m = ua.match(re);
    if (m) { result.os = { name, version: (m[1] || "").replace(/_/g, ".") }; break; }
  }

  // Device type
  if (/mobile|iphone|android.*mobile/i.test(ua)) result.device.type = "mobile";
  else if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) result.device.type = "tablet";
  else if (/smart-tv|smarttv|tv browser|nettv/i.test(ua)) result.device.type = "tv";
  else result.device.type = "desktop";

  // Vendor/model
  if (/iphone/i.test(ua)) { result.device.vendor = "Apple"; result.device.model = "iPhone"; }
  else if (/ipad/i.test(ua)) { result.device.vendor = "Apple"; result.device.model = "iPad"; }
  else if (/macintosh/i.test(ua)) { result.device.vendor = "Apple"; result.device.model = "Mac"; }
  else if (/samsung/i.test(ua)) { result.device.vendor = "Samsung"; }
  else if (/pixel/i.test(ua)) { result.device.vendor = "Google"; result.device.model = "Pixel"; }

  // Engine
  if (/applewebkit\/(\S+)/i.test(ua)) {
    const m = ua.match(/applewebkit\/(\S+)/i);
    result.engine = { name: "WebKit", version: m?.[1] || "" };
  } else if (/gecko\/(\S+)/i.test(ua)) {
    const m = ua.match(/gecko\/(\S+)/i);
    result.engine = { name: "Gecko", version: m?.[1] || "" };
  } else if (/trident\/(\S+)/i.test(ua)) {
    const m = ua.match(/trident\/(\S+)/i);
    result.engine = { name: "Trident", version: m?.[1] || "" };
  }

  return result;
}

export function registerRoutes(app: Hono) {
  app.post("/api/parse", async (c) => {
    await tryRequirePayment(0.001);
    const body = await c.req.json().catch(() => null);
    if (!body?.userAgent) {
      return c.json({ error: "Missing required field: userAgent" }, 400);
    }

    const parsed = parseUserAgent(body.userAgent);

    return c.json({
      ...parsed,
      raw: body.userAgent,
      length: body.userAgent.length,
    });
  });
}

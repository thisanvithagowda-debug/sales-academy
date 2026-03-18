import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const rateLimitMap = new Map();

function getRateLimit(ip) {
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;
  const maxFree = parseInt(process.env.FREE_CALLS_PER_DAY || "3");
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 0, resetAt: now + windowMs });
  }
  const entry = rateLimitMap.get(ip);
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  return { count: entry.count, max: maxFree, entry };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, system, isPro } = req.body;
  if (!messages || !system) return res.status(400).json({ error: "Missing fields" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const limit = getRateLimit(ip);

  if (!isPro && limit.count >= limit.max) {
    return res.status(429).json({
      error: "rate_limit",
      message: Free plan: ${limit.max} calls per day. Come back tomorrow!,
      used: limit.count,
      max: limit.max,
    });
  }
  if (!isPro) limit.entry.count += 1;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system,
      messages,
    });
    return res.status(200).json({
      content: response.content[0]?.text || "",
      callsUsed: limit.entry.count,
      callsMax: limit.max,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "AI error. Please try again." });
  }
}

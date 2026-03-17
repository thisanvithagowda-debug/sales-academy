import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { transcript, persona, product, difficulty, voiceTranscript, mission } = req.body;
  if (!transcript) return res.status(400).json({ error: "No transcript" });

  const missionNote = mission ? \nCheck if salesperson completed: "${mission.check}". Set missionCompleted true or false. : "";
  const voiceNote = voiceTranscript ? \nVoice recording transcript: "${voiceTranscript}". Add voiceAnalysis field with verbal communication feedback. : "";

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: `You are the world's best sales coach. You know SPIN Selling, Never Split the Difference, Way of the Wolf, The Challenger Sale, Fanatical Prospecting, How to Win Friends, Pitch Anything, Psychology of Selling and The Go-Giver.

Evaluate the sales call transcript honestly. Return ONLY valid JSON:
{
  "score": <0-100>,
  "grade": <"S"|"A"|"B"|"C"|"D">,
  "verdict": "<one punchy line>",
  "strengths": ["<specific strength>", "<another>"],
  "improvements": ["<specific fix>", "<another>", "<third>"],
  "bookTip": {
    "book": "<book title>",
    "technique": "<technique name>",
    "why": "<how it would have helped>"
  },
  "keyMoment": "<most important exchange and why>",
  "nextCallFocus": "<one thing to practice next call>",
  "missionCompleted": false,
  "voiceAnalysis": null
}${missionNote}${voiceNote}`,
      messages: [{
        role: "user",
        content: Product: ${product}\nPersona: ${persona}\nDifficulty: ${difficulty}\n\nTranscript:\n${transcript}
      }],
    });
    const text = response.content[0]?.text || "{}";
    const parsed = JSON.parse(text.replace(/json|/g, "").trim());
    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Analysis failed. Try again." });
  }
}

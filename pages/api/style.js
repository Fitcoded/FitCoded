export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { gender, bodyType, budget, lifestyle, goal } = req.body;
  const prompt = `You are a personal style advisor. Based on this profile:
Gender: ${gender}
Body Type: ${bodyType}
Budget: ${budget}
Lifestyle: ${lifestyle}
Goal: ${goal}

Return ONLY a raw JSON object with NO markdown, NO backticks, NO explanation. Just the JSON:
{"stylePersonality":"2-3 word archetype","colorPalette":["#hex1","#hex2","#hex3","#hex4"],"colorDescription":"one sentence","outfits":[{"occasion":"name","outfitName":"name","pieces":[{"item":"item name","tip":"short tip","search":"search term"}]}],"styleRules":["rule1","rule2","rule3"],"avoid":["thing1","thing2"],"quickWin":"one actionable tip"}

Include 3 outfits with 3 pieces each. Be specific and practical.`;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const raw = data.content?.[0]?.text || '';
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) return res.status(500).json({ error: 'Invalid response' });
    const parsed = JSON.parse(raw.substring(start, end + 1));
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

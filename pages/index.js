export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gender, bodyType, skinTone, budget, lifestyle, goal } = req.body;

  const skinToneGuidance = () => {
    const tone = (skinTone || '').toLowerCase();
    if (['ivory', 'porcelain'].includes(tone)) {
      return 'soft pastels, cool blues, lavender, blush rose, cream, navy, and light neutrals. Avoid overly warm or orange-based tones.';
    } else if (['sand', 'fair'].includes(tone)) {
      return 'warm whites, peach, coral, camel, light olive, sage green, and soft warm neutrals.';
    } else if (['honey', 'light medium'].includes(tone)) {
      return 'warm golden tones, terracotta, warm beige, dusty rose, olive, and soft warm browns.';
    } else if (['caramel', 'medium'].includes(tone)) {
      return 'warm earth tones, mustard yellow, burnt orange, olive green, warm browns, and rich neutrals.';
    } else if (['toffee', 'medium tan'].includes(tone)) {
      return 'rich warm tones, deep caramel, rust, forest green, warm burgundy, and golden hues.';
    } else if (['sienna', 'tan'].includes(tone)) {
      return 'jewel tones, deep burgundy, cobalt blue, emerald green, rust orange, and rich warm colors.';
    } else if (['mahogany', 'deep brown'].includes(tone)) {
      return 'bold jewel tones, royal blue, deep emerald, gold, rich purple, and deep reds.';
    } else if (['coffee', 'very deep'].includes(tone)) {
      return 'vibrant jewel tones, gold, royal blue, fuchsia, deep emerald, and bold rich colors.';
    } else if (['ebony', 'richest deep'].includes(tone)) {
      return 'the boldest and most vibrant colors — gold, cobalt, fuchsia, white, deep red, and rich jewel tones that create maximum contrast and impact.';
    }
    return 'colors that complement their overall complexion and style goal.';
  };

  const prompt = `You are a world-class personal style advisor. Based on this profile, create a deeply personalized style guide.

User Profile:
- Gender: ${gender}
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Budget: ${budget}
- Lifestyle: ${lifestyle}
- Style Goal: ${goal}

CRITICAL COLOR RULE: The color palette MUST be specifically chosen to complement the user's skin tone of "${skinTone}". 
For this skin tone, recommend: ${skinToneGuidance()}
Choose 4 specific hex color codes that genuinely flatter this skin tone.

Return ONLY a raw JSON object with NO markdown, NO backticks, NO explanation. Just the JSON:
{"stylePersonality":"2-3 word archetype","colorPalette":["#hex1","#hex2","#hex3","#hex4"],"colorDescription":"one sentence explaining why these colors work for this specific skin tone","outfits":[{"occasion":"name","outfitName":"name","pieces":[{"item":"item name","tip":"short tip","search":"amazon search term"}]}],"styleRules":["rule1","rule2","rule3"],"avoid":["thing1","thing2"],"quickWin":"one actionable tip"}

Include 3 outfits with 3 pieces each. Be specific, practical, and tailor everything to their skin tone, body type and lifestyle.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const raw = data.content?.[0]?.text || '';
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');

    if (start === -1 || end === -1) {
      return res.status(500).json({ error: 'Invalid response from AI' });
    }

    const parsed = JSON.parse(raw.substring(start, end + 1));
    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

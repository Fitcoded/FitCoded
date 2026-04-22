export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gender, bodyType, skinTone, season, budget, lifestyle, goal } = req.body;

  const getLifestyleVibe = (lifestyle, goal) => {
    const l = (lifestyle || '').toLowerCase();
    const g = (goal || '').toLowerCase();
    if (l.includes('office') || l.includes('corporate') || g.includes('respect')) return 'cool';
    if (l.includes('nightlife') || l.includes('social') || g.includes('romantic') || g.includes('attract')) return 'bold';
    if (l.includes('outdoor') || l.includes('active')) return 'warm';
    if (l.includes('creative') || l.includes('freelance') || g.includes('signature')) return 'creative';
    if (l.includes('student') || l.includes('campus') || g.includes('put-together') || g.includes('basics')) return 'neutral';
    return 'neutral';
  };

  // Season palettes — based on classic color theory
  const getSeasonPalettes = (season) => {
    const s = (season || '').toLowerCase();

    if (s === 'spring') {
      return {
        cool:     ['#1A5276', '#5DADE2', '#F9E4C8', '#C0392B'],
        bold:     ['#F39C12', '#E67E22', '#F9E4C8', '#2E86C1'],
        warm:     ['#D4A017', '#E8956D', '#F9E4C8', '#2E8B57'],
        creative: ['#C17A3C', '#E8956D', '#F9E4C8', '#2E8B57'],
        neutral:  ['#7D6608', '#D4AC0D', '#F9E4C8', '#C0392B'],
      };
    }

    if (s === 'summer') {
      return {
        cool:     ['#1F618D', '#7FB3D3', '#F0EAF8', '#8E44AD'],
        bold:     ['#6C3483', '#A569BD', '#F0EAF8', '#1A5276'],
        warm:     ['#4A235A', '#7D3C98', '#F0EAF8', '#1F618D'],
        creative: ['#5B2C6F', '#9B59B6', '#F0EAF8', '#2471A3'],
        neutral:  ['#5D6D7E', '#A9CCE3', '#F0EAF8', '#7B241C'],
      };
    }

    if (s === 'autumn') {
      return {
        cool:     ['#2C3E50', '#5D4037', '#C4A882', '#2E5E4E'],
        bold:     ['#6D4C41', '#BF360C', '#D4A574', '#1B5E20'],
        warm:     ['#4E342E', '#8D6E63', '#D7CCC8', '#2E7D32'],
        creative: ['#3E2723', '#795548', '#D4A574', '#2E5E4E'],
        neutral:  ['#4A3728', '#8B6344', '#C19A6B', '#3B5E42'],
      };
    }

    if (s === 'winter') {
      return {
        cool:     ['#0D1B2A', '#1A3A5C', '#F0F4F8', '#8B0000'],
        bold:     ['#1A0A2E', '#4B0082', '#F5F5F5', '#B8860B'],
        warm:     ['#1C1C1C', '#2C3E50', '#FFFFFF', '#C0392B'],
        creative: ['#0A0A1A', '#2E1A47', '#F5F5F5', '#B8860B'],
        neutral:  ['#1A1A2E', '#2C3E50', '#ECF0F1', '#6B0F2A'],
      };
    }

    // Fallback if no season selected — lifestyle only
    return {
      cool:     ['#1A3A5C', '#4A6FA5', '#D4E4F0', '#8B2246'],
      bold:     ['#1C1C2E', '#4B0082', '#C9A84C', '#8B0000'],
      warm:     ['#4A3728', '#8B6344', '#C4A882', '#2E5E4E'],
      creative: ['#3D2B1F', '#6B4C3B', '#C4A882', '#2E5E4E'],
      neutral:  ['#2C3E50', '#6B7A8D', '#BDC3C7', '#8B4557'],
    };
  };

  const getSkinToneGuidance = (skinTone, season) => {
    const t = (skinTone || '').toLowerCase();
    const s = (season || '').toLowerCase();

    const seasonNote = s
      ? `This person is a ${season} season, meaning their natural coloring has ${
          s === 'spring' ? 'warm, clear, light undertones — peach, coral and warm ivory are their naturals'
          : s === 'summer' ? 'cool, soft, muted undertones — dusty rose, lavender and soft grey are their naturals'
          : s === 'autumn' ? 'warm, deep, muted undertones — rust, cognac and olive are their naturals'
          : 'cool, deep, clear undertones — true black, crisp white and jewel tones are their naturals'
        }.`
      : '';

    if (t === 'ivory' || t === 'porcelain') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Deep anchor colors create essential definition and prevent a washed-out look
- Warm accents add depth and complement the skin's undertones
- Avoid colors so pale they blend with the skin — contrast is key
- Describe how each color creates definition against ${skinTone} skin`;
    }

    if (t === 'sand' || t === 'fair') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Warm earth tones harmonize with the golden undertones of ${skinTone} skin
- Deep tones create striking contrast without washing out the complexion
- Describe how each color enhances the warmth and glow of ${skinTone} skin`;
    }

    if (t === 'honey' || t === 'light medium') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Rich warm tones like terracotta, camel and mustard amplify the golden glow of ${skinTone} skin
- Deep cool tones like navy and forest green create elegant contrast
- Describe how each color interacts with the warm golden undertones of ${skinTone} skin`;
    }

    if (t === 'caramel' || t === 'medium') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Earth tones like cognac, warm brown, olive and camel are natural complements
- Deep jewel tones create rich sophisticated contrast
- Warm neutrals like cream harmonize without competing
- Describe how each color enhances the warm richness of ${skinTone} skin`;
    }

    if (t === 'toffee' || t === 'medium tan') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Rich earthy tones — cognac, rust, warm brown, olive — feel natural and elevated
- Deep tones like burgundy, forest green and navy create depth without harshness
- Warm neutrals like cream create soft luminous contrast
- Describe how each color brings out the depth and warmth of ${skinTone} skin`;
    }

    if (t === 'sienna' || t === 'tan') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Earthy warm tones — terracotta, rust, cognac, olive — feel deeply harmonious
- Rich deep tones like forest green and burgundy create sophisticated contrast
- Cream and warm white create luminous contrast without harshness
- Describe how each color honors the natural richness of ${skinTone} skin`;
    }

    if (t === 'mahogany' || t === 'deep brown') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Earth tones — cognac, warm brown, olive, terracotta, camel — are deeply harmonious with ${skinTone} skin
- Deep jewel tones create elegant depth-on-depth contrast
- Cream, ivory and warm white create striking luminous contrast
- Describe how each color either harmonizes with or elegantly contrasts ${skinTone} skin`;
    }

    if (t === 'coffee' || t === 'very deep') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Rich earth tones — cognac, warm brown, camel, olive — feel natural and sophisticated
- Deep tones create a luxurious depth-on-depth effect
- Cream, ivory and warm white create maximum luminous contrast
- Describe how each color creates harmony or striking contrast with ${skinTone} skin`;
    }

    if (t === 'ebony' || t === 'richest deep') {
      return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Earth tones — cognac, camel, warm brown, olive, terracotta — create natural harmony
- Deep tones create a powerful depth-on-depth effect that feels luxurious
- Cream, ivory and warm white create the most striking luminous contrast
- Gold and warm metallics create a radiant glow against ${skinTone} skin
- Describe how each color harmonizes with or dramatically contrasts ${skinTone} skin`;
    }

    return `${seasonNote}
SKIN TONE STYLING (${skinTone}):
- Choose colors that either harmonize with or create intentional contrast against ${skinTone} skin
- Describe specifically how each color interacts with ${skinTone} skin tone`;
  };

  const vibe = getLifestyleVibe(lifestyle, goal);
  const seasonPalettes = getSeasonPalettes(season);
  const selectedColors = seasonPalettes[vibe] || seasonPalettes.neutral;
  const skinToneGuidance = getSkinToneGuidance(skinTone, season);

  const colorDescriptions = {
    cool: `a polished mix of deep anchor tones and refined neutrals — chosen to project authority and complement ${skinTone} skin's ${season || 'natural'} undertones in professional settings`,
    bold: `deep moody tones with a luminous accent — chosen to create presence and drama that flatters ${skinTone} skin's ${season || 'natural'} coloring`,
    warm: `natural earth tones with organic depth — colors that feel grounded outdoors and harmonize with ${skinTone} skin's ${season || 'natural'} warmth`,
    creative: `rich earthy tones with warmth and depth — a grounded palette that feels intentional and complements ${skinTone} skin's ${season || 'natural'} richness`,
    neutral: `a versatile mix of refined neutrals with a grounding anchor — balanced to flatter ${skinTone} skin's ${season || 'natural'} undertones across every occasion`,
  };

  const colorDescription = colorDescriptions[vibe] || colorDescriptions.neutral;

  const prompt = `You are a world-class personal style advisor who uses both seasonal color theory and skin-tone-aware styling. Give highly personalized advice based on the user's season type, skin tone, lifestyle and goals.

User Profile:
- Gender: ${gender}
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Color Season: ${season || 'Not specified'}
- Budget: ${budget}
- Lifestyle: ${lifestyle}
- Style Goal: ${goal}

The following color palette has been selected based on the user's SEASON TYPE and LIFESTYLE. It is LOCKED — do not change or substitute colors:
${JSON.stringify(selectedColors)}

PALETTE RULES:
- The palette is driven by season type and lifestyle, not skin tone alone
- Use 1 statement color per outfit maximum
- The lightest color is the base/neutral
- The deepest color is the anchor piece
- Never combine more than 2 palette colors in one outfit

${skinToneGuidance}

MANDATORY RULES:
1. Every outfit piece tip MUST reference ${skinTone} skin specifically and explain how the color works with it
2. Reference the ${season || 'natural'} season coloring when describing why colors work
3. The avoid list must explain why each item clashes with ${skinTone} skin's undertones or season type
4. The quick win must be the single highest-impact change for someone with ${skinTone} skin and ${season || 'their'} coloring
5. Outfit names must feel editorial — specific to the lifestyle and ${skinTone} skin's energy
6. stylePersonality must reflect the lifestyle and season type energy
7. NEVER include hex codes in item names — use plain descriptive color words only
8. DO NOT default to bright colors for deeper skin tones — let season and lifestyle drive the palette

Return ONLY a raw JSON object with NO markdown, NO backticks, NO explanation:
{"stylePersonality":"2-3 word archetype","colorPalette":${JSON.stringify(selectedColors)},"colorDescription":"${colorDescription}","outfits":[{"occasion":"name","outfitName":"editorial name","pieces":[{"item":"clothing item with plain color description","tip":"explains how this works with ${skinTone} skin and ${season || 'their'} season coloring","search":"specific amazon search term"}]}],"styleRules":["rule specific to ${skinTone} skin and ${season || 'their'} season 1","rule 2","rule 3"],"avoid":["item — why it clashes with ${skinTone} skin or ${season || 'their'} season type","second item"],"quickWin":"highest-impact tip for ${skinTone} skin with ${season || 'their'} season coloring"}

Include 3 outfits with 3 pieces each.`;

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2500,
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    let fullText = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullText += parsed.delta.text;
              res.write(`data: ${JSON.stringify({ type: 'chunk', text: parsed.delta.text })}\n\n`);
            }
          } catch (e) {
            // Skip malformed chunks
          }
        }
      }
    }

    const start = fullText.indexOf('{');
    const end = fullText.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      const parsed = JSON.parse(fullText.substring(start, end + 1));
      parsed.colorPalette = selectedColors;
      parsed.colorDescription = colorDescription;
      res.write(`data: ${JSON.stringify({ type: 'complete', result: parsed })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Invalid response from AI' })}\n\n`);
    }

    res.end();
  } catch (e) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: e.message })}\n\n`);
    res.end();
  }
}

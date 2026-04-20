export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gender, bodyType, skinTone, budget, lifestyle, goal } = req.body;

  const getSkinToneBase = (tone) => {
    const t = (tone || '').toLowerCase();

    if (t === 'ivory' || t === 'porcelain') {
      return {
        warm: ['#C4A0B0', '#E8C5D0', '#F5F0E8', '#8B6B77'],
        cool: ['#1A3A5C', '#B8D4E8', '#F5F0E8', '#8B2246'],
        bold: ['#7B2D8B', '#1A5276', '#C0392B', '#F5F0E8'],
        neutral: ['#6B7A8D', '#BDC3C7', '#F5F0E8', '#8B4557'],
      };
    } else if (t === 'sand' || t === 'fair') {
      return {
        warm: ['#CD853F', '#F4A460', '#F5DEB3', '#8B5E3C'],
        cool: ['#4682B4', '#87CEEB', '#F0F8FF', '#8B2252'],
        bold: ['#C0392B', '#FF6B35', '#8E44AD', '#F5DEB3'],
        neutral: ['#A0836B', '#D2B48C', '#F5F5DC', '#6B4C3B'],
      };
    } else if (t === 'honey' || t === 'light medium') {
      return {
        warm: ['#C17A3C', '#E8956D', '#F0C080', '#8B5A2B'],
        cool: ['#2E6DA4', '#5D8AA8', '#E8EEF4', '#8B3A3A'],
        bold: ['#8E44AD', '#C0392B', '#D35400', '#F0C080'],
        neutral: ['#8B6344', '#C19A6B', '#F5DEB3', '#5C4033'],
      };
    } else if (t === 'caramel' || t === 'medium') {
      return {
        warm: ['#8B4513', '#C17A3C', '#DAA520', '#5C2E00'],
        cool: ['#145A74', '#2980B9', '#D4EAF7', '#8B2500'],
        bold: ['#8E44AD', '#E74C3C', '#D4A017', '#1A5276'],
        neutral: ['#6B4C3B', '#A0785A', '#D4B896', '#3D2B1F'],
      };
    } else if (t === 'toffee' || t === 'medium tan') {
      return {
        warm: ['#8B2500', '#CD6600', '#D2691E', '#5C1A00'],
        cool: ['#154360', '#C0392B', '#1A5276', '#8B0000'],
        bold: ['#C0392B', '#FF5733', '#1A5276', '#8B2500'],
        neutral: ['#6B4C3B', '#7B5E57', '#A08070', '#4A3728'],
      };
    } else if (t === 'sienna' || t === 'tan') {
      return {
        warm: ['#8B0000', '#DAA520', '#CD5C5C', '#5C0000'],
        cool: ['#1C3A6E', '#4B0082', '#006400', '#8B0000'],
        bold: ['#8B0000', '#4B0082', '#DAA520', '#006400'],
        neutral: ['#4A3728', '#5C4033', '#8B6B57', '#2C1A0E'],
      };
    } else if (t === 'mahogany' || t === 'deep brown') {
      return {
        warm: ['#8B0000', '#2E5E4E', '#C9A84C', '#4A1A08'],
        cool: ['#1C3A6E', '#2E5E4E', '#C9A84C', '#8B0000'],
        bold: ['#C9A84C', '#8B0000', '#1C3A6E', '#2E5E4E'],
        neutral: ['#4A3728', '#8B0000', '#C9A84C', '#1C3A6E'],
      };
    } else if (t === 'coffee' || t === 'very deep') {
      return {
        warm: ['#B8860B', '#8B0000', '#2E5E4E', '#C19A6B'],
        cool: ['#1C3A6E', '#4B0082', '#C9A84C', '#2E5E4E'],
        bold: ['#C9A84C', '#4B0082', '#8B0000', '#2E5E4E'],
        neutral: ['#4A3728', '#8B6344', '#C9A84C', '#1C3A6E'],
      };
    } else if (t === 'ebony' || t === 'richest deep') {
      return {
        warm: ['#B8860B', '#8B0000', '#F5F5F5', '#2E5E4E'],
        cool: ['#F5F5F5', '#4B0082', '#B8860B', '#1C3A6E'],
        bold: ['#F5F5F5', '#B8860B', '#6B0F8B', '#8B0000'],
        neutral: ['#F5F5F5', '#B8860B', '#C0C0C0', '#4A3728'],
      };
    }

    return {
      warm: ['#E74C3C', '#F39C12', '#27AE60', '#2980B9'],
      cool: ['#2980B9', '#8E44AD', '#27AE60', '#F39C12'],
      bold: ['#E74C3C', '#8E44AD', '#27AE60', '#F39C12'],
      neutral: ['#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1'],
    };
  };

  const getLifestyleVibe = (lifestyle, goal) => {
    const l = (lifestyle || '').toLowerCase();
    const g = (goal || '').toLowerCase();
    if (l.includes('office') || l.includes('corporate') || g.includes('respect')) return 'cool';
    if (l.includes('nightlife') || l.includes('social') || g.includes('romantic') || g.includes('attract')) return 'bold';
    if (l.includes('outdoor') || l.includes('active')) return 'warm';
    if (l.includes('creative') || l.includes('freelance') || g.includes('signature')) return 'bold';
    if (l.includes('student') || l.includes('campus') || g.includes('put-together') || g.includes('basics')) return 'neutral';
    return 'neutral';
  };

  const toneBase = getSkinToneBase(skinTone);
  const vibe = getLifestyleVibe(lifestyle, goal);
  const selectedColors = toneBase[vibe] || toneBase.neutral;

  const isDeepTone = ['mahogany', 'deep brown', 'coffee', 'very deep', 'ebony', 'richest deep'].some(t =>
    (skinTone || '').toLowerCase().includes(t)
  );
  const isLightTone = ['ivory', 'porcelain', 'sand', 'fair', 'honey', 'light medium'].some(t =>
    (skinTone || '').toLowerCase().includes(t)
  );

  const colorDescriptions = {
    cool: `a polished mix of deep anchor tones, refined mid-tones, and a striking accent — engineered to complement ${skinTone} skin with authority in professional settings`,
    bold: isDeepTone
      ? `rich jewel tones with depth and luminosity — these specific shades create stunning contrast and make ${skinTone} skin glow with commanding presence`
      : `high-impact statement colors carefully chosen to make ${skinTone} skin radiate confidence and command attention`,
    warm: `rich warm earth tones with depth and contrast that harmonize beautifully with ${skinTone} skin for an effortlessly elevated look`,
    neutral: `a versatile palette with depth, softness and a precise accent tone — carefully balanced to flatter ${skinTone} skin across every occasion`,
  };

  const colorDescription = colorDescriptions[vibe] || colorDescriptions.neutral;

  const deepToneGuidance = isDeepTone
    ? `DEEP SKIN TONE RULES (${skinTone}):
- Prioritize contrast — deep, rich skin creates a stunning canvas for both bold and light colors
- Avoid recommending colors that are too close to the skin tone (muddy browns, ashy greys)
- White, cream, and off-white create striking luminous contrast — always a power move
- Gold, burgundy, deep purple, and forest green are signature colors for deep skin
- Never default to "earth tones only" — deep skin tones can own the full spectrum
- Describe how each color specifically pops, glows, or contrasts against ${skinTone} skin`
    : '';

  const lightToneGuidance = isLightTone
    ? `LIGHT SKIN TONE RULES (${skinTone}):
- Always include at least one deep anchor color (navy, forest green, burgundy, charcoal)
- Never generate a monochromatic or single-family palette — variety is essential
- Warm accents (rust, camel, terracotta) add depth and prevent a washed-out look
- Avoid recommending colors so pale they blend with the skin tone
- Describe how each color creates definition and contrast against ${skinTone} skin`
    : '';

  const prompt = `You are a world-class personal style advisor specializing in skin-tone-aware fashion. Every single piece of advice must be specifically tailored to ${skinTone} skin tone. Never give generic advice that could apply to anyone.

User Profile:
- Gender: ${gender}
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Budget: ${budget}
- Lifestyle: ${lifestyle}
- Style Goal: ${goal}
- Color Vibe: ${vibe}

The following color palette has been pre-selected and is LOCKED. Do not suggest or substitute different colors:
${JSON.stringify(selectedColors)}

PALETTE USAGE RULES — follow exactly:
- Treat these 4 colors as a capsule wardrobe
- Use 1 statement color per outfit maximum
- The lightest color is the base/neutral
- The deepest color is the anchor piece
- Never combine more than 2 palette colors in a single outfit

${deepToneGuidance}
${lightToneGuidance}

MANDATORY RULES FOR EVERY RESPONSE:
1. Every outfit piece tip MUST name ${skinTone} skin specifically and explain the contrast or harmony it creates
2. Avoid generic advice — if it could apply to any skin tone, rewrite it until it cannot
3. The avoid list must explain exactly why each item clashes with ${skinTone} skin undertones
4. The quick win must be the single highest-impact styling change for ${skinTone} skin specifically
5. Outfit names must feel editorial and be specific to this skin tone's energy
6. stylePersonality must reflect both their lifestyle AND the visual energy of ${skinTone} skin

Return ONLY a raw JSON object with NO markdown, NO backticks, NO explanation:
{"stylePersonality":"2-3 word archetype","colorPalette":${JSON.stringify(selectedColors)},"colorDescription":"${colorDescription}","outfits":[{"occasion":"name","outfitName":"editorial name specific to ${skinTone} energy","pieces":[{"item":"specific clothing item with color","tip":"explains exactly why this works with ${skinTone} skin and what it does visually","search":"specific amazon search term"}]}],"styleRules":["rule specific to ${skinTone} skin 1","rule 2","rule 3"],"avoid":["item — why it does not work for ${skinTone} skin undertones","second item"],"quickWin":"highest-impact single tip for ${skinTone} skin tone specifically"}

Include 3 outfits with 3 pieces each.`;

  try {
    // Set headers for streaming
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
              // Send progress updates to frontend
              res.write(`data: ${JSON.stringify({ type: 'chunk', text: parsed.delta.text })}\n\n`);
            }
          } catch (e) {
            // Skip malformed chunks
          }
        }
      }
    }

    // Parse full response and enforce locked colors
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

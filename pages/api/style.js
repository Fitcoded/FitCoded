export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gender, bodyType, skinTone, budget, lifestyle, goal } = req.body;

  const getSkinToneBase = (tone) => {
    const t = (tone || '').toLowerCase();
    if (t === 'ivory' || t === 'porcelain') {
      return {
        warm: ['#E8C5D0', '#F5B8C4', '#F5F0E8', '#C4A0B0'],
        cool: ['#B8D4E8', '#8BA7C7', '#E8EFF5', '#6B8FB5'],
        bold: ['#7B2D8B', '#1A5276', '#C0392B', '#F5F0E8'],
        neutral: ['#BDC3C7', '#95A5A6', '#F5F0E8', '#7F8C8D'],
        undertone: 'cool',
      };
    } else if (t === 'sand' || t === 'fair') {
      return {
        warm: ['#F4A460', '#DEB887', '#F5DEB3', '#CD853F'],
        cool: ['#87CEEB', '#B0C4DE', '#F0F8FF', '#6495ED'],
        bold: ['#FF6B35', '#E74C3C', '#8E44AD', '#F5DEB3'],
        neutral: ['#D2B48C', '#C4A882', '#F5F5DC', '#A0836B'],
        undertone: 'warm',
      };
    } else if (t === 'honey' || t === 'light medium') {
      return {
        warm: ['#E8956D', '#D4845A', '#F0C080', '#C17A3C'],
        cool: ['#5D8AA8', '#4682B4', '#B0C4DE', '#E8956D'],
        bold: ['#C0392B', '#8E44AD', '#D35400', '#F0C080'],
        neutral: ['#C19A6B', '#A0785A', '#F5DEB3', '#8B6344'],
        undertone: 'warm',
      };
    } else if (t === 'caramel' || t === 'medium') {
      return {
        warm: ['#D4A017', '#C17A3C', '#DAA520', '#8B4513'],
        cool: ['#1F618D', '#2980B9', '#D4A017', '#145A74'],
        bold: ['#E74C3C', '#8E44AD', '#D4A017', '#145A74'],
        neutral: ['#A0785A', '#8B6344', '#C19A6B', '#6B4C3B'],
        undertone: 'warm',
      };
    } else if (t === 'toffee' || t === 'medium tan') {
      return {
        warm: ['#8B2500', '#A0522D', '#D2691E', '#CD6600'],
        cool: ['#1A5276', '#154360', '#8B2500', '#C0392B'],
        bold: ['#FF5733', '#C0392B', '#8B2500', '#1A5276'],
        neutral: ['#7B5E57', '#6B4C3B', '#A0785A', '#8B6344'],
        undertone: 'warm',
      };
    } else if (t === 'sienna' || t === 'tan') {
      return {
        warm: ['#8B0000', '#A52A2A', '#CD5C5C', '#DAA520'],
        cool: ['#4B0082', '#1C3A6E', '#006400', '#8B0000'],
        bold: ['#4B0082', '#8B0000', '#006400', '#DAA520'],
        neutral: ['#5C4033', '#4A3728', '#7B5E57', '#6B4C3B'],
        undertone: 'neutral',
      };
    } else if (t === 'mahogany' || t === 'deep brown') {
      return {
        warm: ['#FFD700', '#DAA520', '#8B0000', '#006400'],
        cool: ['#4169E1', '#50C878', '#8B0000', '#FFD700'],
        bold: ['#FFD700', '#FF1493', '#4169E1', '#50C878'],
        neutral: ['#8B0000', '#006400', '#FFD700', '#4169E1'],
        undertone: 'neutral',
      };
    } else if (t === 'coffee' || t === 'very deep') {
      return {
        warm: ['#FF6B35', '#FFD700', '#FF1493', '#00CED1'],
        cool: ['#00CED1', '#4169E1', '#FFD700', '#FF1493'],
        bold: ['#FF0000', '#FFD700', '#00FF7F', '#FF1493'],
        neutral: ['#FFD700', '#FF6B35', '#00CED1', '#FF1493'],
        undertone: 'neutral',
      };
    } else if (t === 'ebony' || t === 'richest deep') {
      return {
        warm: ['#FFD700', '#FF4500', '#FF1493', '#FFFFFF'],
        cool: ['#FFFFFF', '#FFD700', '#7B2FBE', '#00CED1'],
        bold: ['#FFFFFF', '#FFD700', '#FF0000', '#7B2FBE'],
        neutral: ['#FFFFFF', '#FFD700', '#C0C0C0', '#FF4500'],
        undertone: 'neutral',
      };
    }
    return {
      warm: ['#E74C3C', '#F39C12', '#27AE60', '#2980B9'],
      cool: ['#2980B9', '#8E44AD', '#27AE60', '#F39C12'],
      bold: ['#E74C3C', '#8E44AD', '#27AE60', '#F39C12'],
      neutral: ['#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1'],
      undertone: 'neutral',
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

  const colorDescriptions = {
    cool: `sophisticated tones chosen to complement ${skinTone} skin in professional and polished settings`,
    bold: `vibrant jewel tones and striking colors that make ${skinTone} skin radiate and command attention`,
    warm: `rich warm earth tones that harmonize beautifully with ${skinTone} skin for an effortlessly natural look`,
    neutral: `versatile balanced tones carefully selected to flatter ${skinTone} skin across any occasion`,
  };

  const colorDescription = colorDescriptions[vibe] || colorDescriptions.neutral;

  const prompt = `You are a world-class personal style advisor. Create a deeply personalized style guide.

User Profile:
- Gender: ${gender}
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Budget: ${budget}
- Lifestyle: ${lifestyle}
- Style Goal: ${goal}
- Color Vibe: ${vibe}

The color palette has already been selected for this person based on their skin tone and lifestyle.
Colors: ${JSON.stringify(selectedColors)}

Your job is to:
1. Create a style personality name that fits their lifestyle and goal
2. Suggest 3 outfits (3 pieces each) that incorporate these colors naturally
3. Give style rules specific to their body type and lifestyle
4. Give an avoid list relevant to their specific situation
5. Give one powerful quick win they can do today

Return ONLY a raw JSON object with NO markdown, NO backticks, NO explanation:
{"stylePersonality":"2-3 word archetype","colorPalette":${JSON.stringify(selectedColors)},"colorDescription":"${colorDescription}","outfits":[{"occasion":"name","outfitName":"name","pieces":[{"item":"specific clothing item incorporating the color palette","tip":"practical styling tip","search":"specific amazon search term"}]}],"styleRules":["specific rule 1","specific rule 2","specific rule 3"],"avoid":["specific thing 1","specific thing 2"],"quickWin":"one powerful actionable tip they can do today"}`;

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

    // Always enforce the correct skin tone + lifestyle colors
    parsed.colorPalette = selectedColors;
    parsed.colorDescription = colorDescription;

    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

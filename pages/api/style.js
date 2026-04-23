export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gender, bodyType, skinTone, season, budget, lifestyle, goal, useStream } = req.body;

  // ─── SKIN TONE GROUP ───────────────────────────────────────────────────────
  const getSkinToneGroup = (tone) => {
    const t = (tone || '').toLowerCase();
    if (['ivory', 'porcelain', 'sand'].some(x => t.includes(x))) return 'light';
    if (['honey', 'caramel', 'toffee'].some(x => t.includes(x))) return 'medium';
    return 'deep';
  };

  // ─── OCCASION VIBE ─────────────────────────────────────────────────────────
  const getOccasion = (lifestyle, goal) => {
    const l = (lifestyle || '').toLowerCase();
    const g = (goal || '').toLowerCase();
    if (l.includes('office') || l.includes('corporate') || g.includes('respect')) return 'corporate';
    if (l.includes('nightlife') || l.includes('social') || g.includes('romantic') || g.includes('attract')) return 'nightlife';
    if (l.includes('creative') || l.includes('freelance') || g.includes('signature')) return 'creative';
    if (l.includes('outdoor') || l.includes('active')) return 'active';
    return 'casual';
  };

  // ─── 60 PALETTES: Season × Skin Tone Group × Occasion ─────────────────────
  const getPalette = (season, skinGroup, occasion) => {
    const s = (season || '').toLowerCase();
    const palettes = {
      spring: {
        light: {
          corporate: ['#2E5E4E', '#7FB5A0', '#F5EEE6', '#C0392B'],
          nightlife: ['#E8622A', '#F0C040', '#F5EEE6', '#2E5E4E'],
          creative:  ['#7B2D8B', '#E8622A', '#F5EEE6', '#2E5E4E'],
          active:    ['#2E8B57', '#7EC8A0', '#F5EEE6', '#E8622A'],
          casual:    ['#8B5E3C', '#C4956A', '#F5EEE6', '#2E5E4E'],
        },
        medium: {
          corporate: ['#1A3A5C', '#5D8AA8', '#F0EAD6', '#8B2246'],
          nightlife: ['#C0392B', '#E8956D', '#F0EAD6', '#1A3A5C'],
          creative:  ['#6B4226', '#C17A3C', '#F0EAD6', '#2E5E4E'],
          active:    ['#2E8B57', '#8FBC8F', '#F0EAD6', '#C17A3C'],
          casual:    ['#5C4033', '#A0785A', '#F0EAD6', '#2E5E4E'],
        },
        deep: {
          corporate: ['#F5F0E8', '#E8622A', '#1A3A5C', '#C9A84C'],
          nightlife: ['#F5F0E8', '#C9A84C', '#E8622A', '#1A3A5C'],
          creative:  ['#F5F0E8', '#2E5E4E', '#E8622A', '#C9A84C'],
          active:    ['#F5F0E8', '#2E8B57', '#E8622A', '#C9A84C'],
          casual:    ['#F5F0E8', '#C9A84C', '#2E5E4E', '#E8622A'],
        },
      },
      summer: {
        light: {
          corporate: ['#1A5276', '#5DADE2', '#F0F8FF', '#E8622A'],
          nightlife: ['#E8622A', '#F0A500', '#FFFFFF', '#1A5276'],
          creative:  ['#E8622A', '#F7DC6F', '#FFFFFF', '#1A5276'],
          active:    ['#1A7A4A', '#5DADE2', '#F0F8FF', '#E8622A'],
          casual:    ['#E8622A', '#5DADE2', '#F0F8FF', '#1A5276'],
        },
        medium: {
          corporate: ['#1A5276', '#E8956D', '#FDF2E9', '#2E5E4E'],
          nightlife: ['#C0392B', '#F0A500', '#FDF2E9', '#1A5276'],
          creative:  ['#D35400', '#F0A500', '#FDF2E9', '#1A5276'],
          active:    ['#1A7A4A', '#E8956D', '#FDF2E9', '#1A5276'],
          casual:    ['#D35400', '#5DADE2', '#FDF2E9', '#1A7A4A'],
        },
        deep: {
          corporate: ['#FFFFFF', '#F0A500', '#1A5276', '#C9A84C'],
          nightlife: ['#FFFFFF', '#C9A84C', '#C0392B', '#1A5276'],
          creative:  ['#FFFFFF', '#E8622A', '#1A7A4A', '#C9A84C'],
          active:    ['#FFFFFF', '#1A7A4A', '#E8622A', '#C9A84C'],
          casual:    ['#FFFFFF', '#C9A84C', '#E8622A', '#1A5276'],
        },
      },
      autumn: {
        light: {
          corporate: ['#2C3E50', '#8B5E3C', '#D4C4A8', '#8B2246'],
          nightlife: ['#8B0000', '#C17A3C', '#D4C4A8', '#2C3E50'],
          creative:  ['#4A3728', '#C17A3C', '#D4C4A8', '#2E5E4E'],
          active:    ['#4A6741', '#8B6344', '#D4C4A8', '#8B2500'],
          casual:    ['#5C4033', '#C19A6B', '#D4C4A8', '#4A6741'],
        },
        medium: {
          corporate: ['#1C2833', '#5D4037', '#D4B896', '#8B2246'],
          nightlife: ['#4A1A08', '#C17A3C', '#D4B896', '#2E5E4E'],
          creative:  ['#3E2723', '#7B4A2C', '#D4B896', '#4A6741'],
          active:    ['#2E5E4E', '#8B6344', '#D4B896', '#8B2500'],
          casual:    ['#4A3728', '#8B6344', '#C19A6B', '#4A6741'],
        },
        deep: {
          corporate: ['#D4B896', '#C9A84C', '#2E5E4E', '#8B2246'],
          nightlife: ['#C9A84C', '#8B0000', '#D4B896', '#2E5E4E'],
          creative:  ['#C9A84C', '#2E5E4E', '#D4B896', '#8B2500'],
          active:    ['#D4B896', '#2E5E4E', '#8B2500', '#C9A84C'],
          casual:    ['#C9A84C', '#D4B896', '#2E5E4E', '#8B2246'],
        },
      },
      winter: {
        light: {
          corporate: ['#0D1B2A', '#1A3A5C', '#F0F4F8', '#8B0000'],
          nightlife: ['#1A0A2E', '#6B0082', '#F5F5F5', '#C9A84C'],
          creative:  ['#0A1628', '#1A5C3A', '#F5F5F5', '#8B0000'],
          active:    ['#0D1B2A', '#006B6B', '#F0F4F8', '#8B0000'],
          casual:    ['#1A1A2E', '#2C3E50', '#ECF0F1', '#6B0F2A'],
        },
        medium: {
          corporate: ['#0D1B2A', '#2C3E50', '#D4C4A8', '#8B0000'],
          nightlife: ['#1A0A2E', '#8B0000', '#D4C4A8', '#C9A84C'],
          creative:  ['#0A1628', '#1A5C3A', '#D4C4A8', '#C9A84C'],
          active:    ['#0D1B2A', '#1A5C3A', '#D4C4A8', '#8B0000'],
          casual:    ['#1A1A2E', '#5D4037', '#D4C4A8', '#8B0000'],
        },
        deep: {
          corporate: ['#F5F5F5', '#C9A84C', '#0D1B2A', '#8B0000'],
          nightlife: ['#F5F5F5', '#C9A84C', '#1A0A2E', '#006B6B'],
          creative:  ['#F5F5F5', '#1A5C3A', '#C9A84C', '#8B0000'],
          active:    ['#F5F5F5', '#006B6B', '#C9A84C', '#0D1B2A'],
          casual:    ['#F5F5F5', '#C9A84C', '#0D1B2A', '#1A5C3A'],
        },
      },
    };

    const seasonData = palettes[s] || palettes.autumn;
    const groupData = seasonData[skinGroup] || seasonData.deep;
    return groupData[occasion] || groupData.casual;
  };

  // ─── BODY TYPE GUIDANCE ────────────────────────────────────────────────────
  const getBodyTypeGuidance = (bodyType, gender) => {
    const b = (bodyType || '').toLowerCase();
    const g = (gender || '').toLowerCase();
    const isMasc = g.includes('man') || g.includes('male');
    const isFem = g.includes('woman') || g.includes('female');

    if (b.includes('slim') || b.includes('lean')) {
      if (isMasc) return `BODY TYPE (Slim/Lean — Man): Recommend layering to add dimension — structured blazers, overshirts, chunky knitwear. Straight or slightly tapered trousers.`;
      if (isFem) return `BODY TYPE (Slim/Lean — Woman): A-line silhouettes, wrap styles and fitted pieces all work beautifully. Can carry both oversized and fitted looks.`;
      return `BODY TYPE (Slim/Lean): Layering adds dimension. Structured pieces and intentional volume work well.`;
    }
    if (b.includes('athletic') || b.includes('toned')) {
      if (isMasc) return `BODY TYPE (Athletic/Toned — Man): Showcase the build with well-fitted pieces. Structured shoulders, tapered trousers, fitted crewnecks. Oversized pieces work as intentional contrast.`;
      if (isFem) return `BODY TYPE (Athletic/Toned — Woman): Fitted pieces that skim the body work beautifully. Wrap dresses, fitted blazers, straight-leg trousers.`;
      return `BODY TYPE (Athletic/Toned): Well-fitted pieces that complement the build. Intentional oversized pieces work as creative contrast.`;
    }
    if (b.includes('average') || b.includes('medium')) {
      if (isMasc) return `BODY TYPE (Average/Medium — Man): Versatile frame that carries most silhouettes. Well-fitted basics are the foundation.`;
      if (isFem) return `BODY TYPE (Average/Medium — Woman): Versatile frame. Balance fitted top with relaxed bottom or vice versa.`;
      return `BODY TYPE (Average/Medium): Versatile frame. Focus on balanced proportions and well-fitted pieces.`;
    }
    if (b.includes('broad') || b.includes('muscular')) {
      if (isMasc) return `BODY TYPE (Broad/Muscular — Man): Structured pieces that fit the shoulders. Regular or athletic fit. Straight or relaxed trousers balance the upper body.`;
      if (isFem) return `BODY TYPE (Broad/Muscular — Woman): V-necks and scoop necks soften the shoulder line. A-line and wrap silhouettes balance proportions.`;
      return `BODY TYPE (Broad/Muscular): Pieces that fit the shoulders properly. V-necks and open collars create elongation.`;
    }
    if (b.includes('curvy') || b.includes('full')) {
      if (isMasc) return `BODY TYPE (Full-figured — Man): Well-structured pieces with clean lines. Structured blazers add definition. Straight or relaxed trousers.`;
      if (isFem) return `BODY TYPE (Curvy/Full-figured — Woman): Wrap dresses, defined waist pieces, stretchy fitted fabrics. V-necks and wrap necklines are your best friend.`;
      return `BODY TYPE (Curvy/Full-figured): Pieces with defined waist and clean lines. Celebrate the natural shape.`;
    }
    return `BODY TYPE: Recommend well-fitted pieces appropriate for the occasion and lifestyle.`;
  };

  // ─── BUDGET GUIDANCE ───────────────────────────────────────────────────────
  const getBudgetGuidance = (budget) => {
    const b = (budget || '').toLowerCase();
    if (b.includes('under') || b.includes('50')) return `BUDGET (Under $50): H&M, ASOS, Zara, Target. Focus on versatile basics.`;
    if (b.includes('150') && b.includes('300')) return `BUDGET ($150-$300): Reiss, Ted Baker, AllSaints, Theory, A.P.C. Fewer, better pieces.`;
    if (b.includes('300')) return `BUDGET ($300+): Acne Studios, Toteme, Sandro, Isabel Marant. Investment pieces.`;
    return `BUDGET ($50-$150): Uniqlo, Banana Republic, Club Monaco, Madewell, Everlane. Quality basics.`;
  };

  // ─── GOAL GUIDANCE ─────────────────────────────────────────────────────────
  const getGoalGuidance = (goal) => {
    const g = (goal || '').toLowerCase();
    if (g.includes('put-together')) return `STYLE GOAL: Polished and cohesive — every piece should feel intentional.`;
    if (g.includes('romantic') || g.includes('attract')) return `STYLE GOAL: Confident, intentional pieces that draw attention without trying too hard.`;
    if (g.includes('respect')) return `STYLE GOAL: Authoritative, sharp and elevated. Project competence and confidence.`;
    if (g.includes('signature')) return `STYLE GOAL: Distinctive, editorial and memorable. Push toward pieces that feel uniquely theirs.`;
    if (g.includes('basics')) return `STYLE GOAL: Modern versatile essentials that form the foundation of a strong wardrobe.`;
    return `STYLE GOAL: Develop a cohesive personal style that feels authentic and intentional.`;
  };

  // ─── SKIN TONE GUIDANCE ────────────────────────────────────────────────────
  const getSkinToneGuidance = (skinTone, season, skinGroup) => {
    const s = (season || '').toLowerCase();
    const seasonContext = {
      spring: 'Spring — lighter fabrics, fresh energy',
      summer: 'Summer — vibrant colors, breathable fabrics',
      autumn: 'Autumn — rich layering, warm textures',
      winter: 'Winter — deep tones, heavy fabrics',
    }[s] || 'This season calls for intentional dressing';

    const groupContext = {
      light: `${skinTone} skin has light undertones — colors need contrast to create definition`,
      medium: `${skinTone} skin has warm golden undertones — harmonize or create elegant contrast`,
      deep: `${skinTone} skin has rich deep undertones — create luminous contrast or harmonize with natural depth`,
    }[skinGroup] || `${skinTone} skin deserves carefully considered color choices`;

    return `SKIN TONE (${skinTone}): ${groupContext}. ${seasonContext}. Every outfit tip MUST name ${skinTone} skin specifically.`;
  };

  // ─── ARTICLE HELPER ────────────────────────────────────────────────────────
  const getArticle = (word) => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.includes((word || '').charAt(0).toLowerCase()) ? 'an' : 'a';
  };

  // ─── ASSEMBLE ──────────────────────────────────────────────────────────────
  const skinGroup = getSkinToneGroup(skinTone);
  const occasion = getOccasion(lifestyle, goal);
  const selectedColors = getPalette(season, skinGroup, occasion);
  const bodyTypeGuidance = getBodyTypeGuidance(bodyType, gender);
  const budgetGuidance = getBudgetGuidance(budget);
  const goalGuidance = getGoalGuidance(goal);
  const skinToneGuidance = getSkinToneGuidance(skinTone, season, skinGroup);

  const seasonVibes = {
    spring: 'fresh, light fabrics, warm optimism',
    summer: 'vibrant, breathable fabrics, bold warm energy',
    autumn: 'rich textures, layering, warm depth',
    winter: 'heavy fabrics, deep dramatic tones, high contrast',
  };
  const seasonVibe = seasonVibes[(season || '').toLowerCase()] || 'intentional styling';

  const lifestyleLower = lifestyle?.toLowerCase() || 'your';
  const article = getArticle(lifestyleLower);
  const colorDescription = `a palette drawn from ${season || 'your'} season's energy — chosen specifically for ${skinTone} skin and ${article} ${lifestyleLower} lifestyle`;
  const currentYear = new Date().getFullYear();
  const currentSeason = season || 'current season';

  const prompt = `You are a world-class personal stylist. Every recommendation must feel made specifically for this one person.

USER PROFILE:
- Gender: ${gender}
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Season: ${season}
- Budget: ${budget}
- Lifestyle: ${lifestyle}
- Style Goal: ${goal}

LOCKED COLOR PALETTE (do not change):
${JSON.stringify(selectedColors)}

RULES:
- 1 statement color per outfit maximum
- Each of the 3 outfits must feature a DIFFERENT statement color
- ${currentSeason} ${currentYear} — ${seasonVibe}. Weave current trends naturally into recommendations.
- ${skinToneGuidance}
- ${bodyTypeGuidance}
- ${budgetGuidance}
- ${goalGuidance}

STRICT FORMAT — no exceptions:
- styleRules: EXACTLY 3 rules, max 2 sentences each
- avoid: EXACTLY 2 items, one sentence each
- NEVER include hex codes in item names

Return ONLY raw JSON, no markdown, no backticks:
{"stylePersonality":"2-3 word archetype","colorPalette":${JSON.stringify(selectedColors)},"colorDescription":"${colorDescription}","outfits":[{"occasion":"name","outfitName":"editorial name","pieces":[{"item":"item with plain color and fabric","tip":"skin tone + body type + season tip, max 2 sentences","search":"amazon search term"}]}],"styleRules":["rule 1 max 2 sentences","rule 2","rule 3"],"avoid":["item — why","item 2 — why"],"quickWin":"one sentence highest-impact tip"}

Include 3 outfits with 3 pieces each.`;

  // ─── DETECT IN-APP BROWSER ─────────────────────────────────────────────────
  // useStream is sent from the frontend — false for in-app browsers
  const shouldStream = useStream !== false;

  try {
    if (shouldStream) {
      // ── STREAMING MODE (Safari, Chrome, normal browsers) ──────────────────
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
          max_tokens: 4000,
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
            } catch (e) {}
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

    } else {
      // ── NON-STREAMING MODE (Instagram, TikTok, Facebook, in-app browsers) ─
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 4000,
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
      parsed.colorPalette = selectedColors;
      parsed.colorDescription = colorDescription;

      return res.status(200).json(parsed);
    }

  } catch (e) {
    if (shouldStream) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: e.message })}\n\n`);
      res.end();
    } else {
      return res.status(500).json({ error: e.message });
    }
  }
}

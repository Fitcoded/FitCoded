export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gender, bodyType, skinTone, season, budget, lifestyle, goal } = req.body;

  // ─── SKIN TONE GROUP ───────────────────────────────────────────────────────
  const getSkinToneGroup = (tone) => {
    const t = (tone || '').toLowerCase();
    if (['ivory', 'porcelain', 'sand'].some(x => t.includes(x))) return 'light';
    if (['honey', 'caramel', 'toffee'].some(x => t.includes(x))) return 'medium';
    return 'deep'; // sienna, mahogany, coffee, ebony
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
          corporate: ['#2E5E4E', '#7FB5A0', '#F5EEE6', '#C0392B'],      // forest teal, soft teal, warm ivory, coral red
          nightlife: ['#E8622A', '#F0C040', '#F5EEE6', '#2E5E4E'],      // coral, warm gold, ivory, forest teal
          creative:  ['#7B2D8B', '#E8622A', '#F5EEE6', '#2E5E4E'],      // purple, coral, ivory, teal
          active:    ['#2E8B57', '#7EC8A0', '#F5EEE6', '#E8622A'],      // forest green, mint, ivory, coral
          casual:    ['#8B5E3C', '#C4956A', '#F5EEE6', '#2E5E4E'],      // warm brown, camel, ivory, teal
        },
        medium: {
          corporate: ['#1A3A5C', '#5D8AA8', '#F0EAD6', '#8B2246'],      // deep navy, steel blue, warm cream, burgundy
          nightlife: ['#C0392B', '#E8956D', '#F0EAD6', '#1A3A5C'],      // deep red, terracotta, cream, navy
          creative:  ['#6B4226', '#C17A3C', '#F0EAD6', '#2E5E4E'],      // cognac brown, warm tan, cream, forest
          active:    ['#2E8B57', '#8FBC8F', '#F0EAD6', '#C17A3C'],      // forest green, sage, cream, cognac
          casual:    ['#5C4033', '#A0785A', '#F0EAD6', '#2E5E4E'],      // deep brown, warm tan, cream, forest
        },
        deep: {
          corporate: ['#F5F0E8', '#E8622A', '#1A3A5C', '#C9A84C'],      // crisp white, coral, deep navy, gold
          nightlife: ['#F5F0E8', '#C9A84C', '#E8622A', '#1A3A5C'],      // white, gold, coral, navy
          creative:  ['#F5F0E8', '#2E5E4E', '#E8622A', '#C9A84C'],      // white, forest, coral, gold
          active:    ['#F5F0E8', '#2E8B57', '#E8622A', '#C9A84C'],      // white, forest green, coral, gold
          casual:    ['#F5F0E8', '#C9A84C', '#2E5E4E', '#E8622A'],      // white, gold, forest, coral
        },
      },

      summer: {
        light: {
          corporate: ['#1A5276', '#5DADE2', '#F0F8FF', '#E8622A'],      // deep blue, sky blue, soft white, coral
          nightlife: ['#E8622A', '#F0A500', '#FFFFFF', '#1A5276'],      // coral, amber, white, deep blue
          creative:  ['#E8622A', '#F7DC6F', '#FFFFFF', '#1A5276'],      // coral, sunny yellow, white, deep blue
          active:    ['#1A7A4A', '#5DADE2', '#F0F8FF', '#E8622A'],      // deep green, sky blue, soft white, coral
          casual:    ['#E8622A', '#5DADE2', '#F0F8FF', '#1A5276'],      // coral, sky blue, soft white, deep blue
        },
        medium: {
          corporate: ['#1A5276', '#E8956D', '#FDF2E9', '#2E5E4E'],      // deep blue, terracotta, warm white, forest
          nightlife: ['#C0392B', '#F0A500', '#FDF2E9', '#1A5276'],      // deep red, amber, warm white, navy
          creative:  ['#D35400', '#F0A500', '#FDF2E9', '#1A5276'],      // burnt orange, amber, warm white, navy
          active:    ['#1A7A4A', '#E8956D', '#FDF2E9', '#1A5276'],      // deep green, terracotta, warm white, navy
          casual:    ['#D35400', '#5DADE2', '#FDF2E9', '#1A7A4A'],      // burnt orange, sky blue, warm white, green
        },
        deep: {
          corporate: ['#FFFFFF', '#F0A500', '#1A5276', '#C9A84C'],      // white, amber, deep blue, gold
          nightlife: ['#FFFFFF', '#C9A84C', '#C0392B', '#1A5276'],      // white, gold, deep red, navy
          creative:  ['#FFFFFF', '#E8622A', '#1A7A4A', '#C9A84C'],      // white, coral, deep green, gold
          active:    ['#FFFFFF', '#1A7A4A', '#E8622A', '#C9A84C'],      // white, deep green, coral, gold
          casual:    ['#FFFFFF', '#C9A84C', '#E8622A', '#1A5276'],      // white, gold, coral, deep blue
        },
      },

      autumn: {
        light: {
          corporate: ['#2C3E50', '#8B5E3C', '#D4C4A8', '#8B2246'],      // charcoal, warm brown, warm beige, burgundy
          nightlife: ['#8B0000', '#C17A3C', '#D4C4A8', '#2C3E50'],      // deep red, cognac, warm beige, charcoal
          creative:  ['#4A3728', '#C17A3C', '#D4C4A8', '#2E5E4E'],      // espresso, cognac, warm beige, forest
          active:    ['#4A6741', '#8B6344', '#D4C4A8', '#8B2500'],      // olive, warm brown, beige, rust
          casual:    ['#5C4033', '#C19A6B', '#D4C4A8', '#4A6741'],      // deep brown, camel, warm beige, olive
        },
        medium: {
          corporate: ['#1C2833', '#5D4037', '#D4B896', '#8B2246'],      // near black, deep brown, warm tan, burgundy
          nightlife: ['#4A1A08', '#C17A3C', '#D4B896', '#2E5E4E'],      // deep espresso, cognac, warm tan, forest
          creative:  ['#3E2723', '#7B4A2C', '#D4B896', '#4A6741'],      // dark espresso, cognac brown, tan, olive
          active:    ['#2E5E4E', '#8B6344', '#D4B896', '#8B2500'],      // forest, warm brown, tan, rust
          casual:    ['#4A3728', '#8B6344', '#C19A6B', '#4A6741'],      // deep brown, warm brown, camel, olive
        },
        deep: {
          corporate: ['#D4B896', '#C9A84C', '#2E5E4E', '#8B2246'],      // warm tan, gold, forest green, burgundy
          nightlife: ['#C9A84C', '#8B0000', '#D4B896', '#2E5E4E'],      // gold, deep red, warm tan, forest
          creative:  ['#C9A84C', '#2E5E4E', '#D4B896', '#8B2500'],      // gold, forest, warm tan, rust
          active:    ['#D4B896', '#2E5E4E', '#8B2500', '#C9A84C'],      // warm tan, forest, rust, gold
          casual:    ['#C9A84C', '#D4B896', '#2E5E4E', '#8B2246'],      // gold, warm tan, forest, burgundy
        },
      },

      winter: {
        light: {
          corporate: ['#0D1B2A', '#1A3A5C', '#F0F4F8', '#8B0000'],      // near black, deep navy, crisp white, deep red
          nightlife: ['#1A0A2E', '#6B0082', '#F5F5F5', '#C9A84C'],      // deep plum, rich purple, white, gold
          creative:  ['#0A1628', '#1A5C3A', '#F5F5F5', '#8B0000'],      // near black, deep emerald, white, deep red
          active:    ['#0D1B2A', '#006B6B', '#F0F4F8', '#8B0000'],      // near black, deep teal, crisp white, deep red
          casual:    ['#1A1A2E', '#2C3E50', '#ECF0F1', '#6B0F2A'],      // deep navy black, dark slate, white, burgundy
        },
        medium: {
          corporate: ['#0D1B2A', '#2C3E50', '#D4C4A8', '#8B0000'],      // near black, dark slate, warm tan, deep red
          nightlife: ['#1A0A2E', '#8B0000', '#D4C4A8', '#C9A84C'],      // deep plum, deep red, warm tan, gold
          creative:  ['#0A1628', '#1A5C3A', '#D4C4A8', '#C9A84C'],      // near black, deep emerald, warm tan, gold
          active:    ['#0D1B2A', '#1A5C3A', '#D4C4A8', '#8B0000'],      // near black, deep emerald, warm tan, red
          casual:    ['#1A1A2E', '#5D4037', '#D4C4A8', '#8B0000'],      // deep navy, warm brown, tan, deep red
        },
        deep: {
          corporate: ['#F5F5F5', '#C9A84C', '#0D1B2A', '#8B0000'],      // crisp white, gold, near black, deep red
          nightlife: ['#F5F5F5', '#C9A84C', '#1A0A2E', '#006B6B'],      // crisp white, gold, deep plum, deep teal
          creative:  ['#F5F5F5', '#1A5C3A', '#C9A84C', '#8B0000'],      // crisp white, deep emerald, gold, deep red
          active:    ['#F5F5F5', '#006B6B', '#C9A84C', '#0D1B2A'],      // crisp white, deep teal, gold, near black
          casual:    ['#F5F5F5', '#C9A84C', '#0D1B2A', '#1A5C3A'],      // crisp white, gold, near black, deep emerald
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
      if (isMasc) return `BODY TYPE (Slim/Lean — Man): Recommend layering to add dimension — structured blazers, overshirts, chunky knitwear. Straight or slightly tapered trousers. Avoid extremely baggy pieces that overwhelm the frame. Fitted but not tight.`;
      if (isFem) return `BODY TYPE (Slim/Lean — Woman): A-line silhouettes, wrap styles and fitted pieces all work beautifully. Can carry both oversized and fitted looks. Recommend pieces that add soft volume where desired.`;
      return `BODY TYPE (Slim/Lean): Layering adds dimension. Structured pieces and intentional volume work well. Avoid extremely oversized silhouettes that overwhelm the frame.`;
    }
    if (b.includes('athletic') || b.includes('toned')) {
      if (isMasc) return `BODY TYPE (Athletic/Toned — Man): Showcase the build with well-fitted pieces — not too tight. Structured shoulders, tapered trousers, fitted crewnecks. Oversized pieces work as intentional contrast (creative/streetwear). Avoid boxy cuts that hide the physique.`;
      if (isFem) return `BODY TYPE (Athletic/Toned — Woman): Fitted pieces that skim the body work beautifully. Wrap dresses, fitted blazers, straight-leg trousers. Can carry both oversized and fitted looks. Avoid overly structured pieces that hide natural shape.`;
      return `BODY TYPE (Athletic/Toned): Well-fitted pieces that complement the build. Intentional oversized pieces work as creative contrast. Avoid boxy cuts that hide the physique.`;
    }
    if (b.includes('average') || b.includes('medium')) {
      if (isMasc) return `BODY TYPE (Average/Medium — Man): Versatile frame that carries most silhouettes. Balanced proportions — avoid extremes. Well-fitted basics are the foundation. Tapered trousers, fitted but not tight tops.`;
      if (isFem) return `BODY TYPE (Average/Medium — Woman): Versatile frame that carries most silhouettes. Wrap styles, straight cuts and fitted pieces all work. Focus on proportions — balance fitted top with relaxed bottom or vice versa.`;
      return `BODY TYPE (Average/Medium): Versatile frame. Focus on balanced proportions and well-fitted pieces.`;
    }
    if (b.includes('broad') || b.includes('muscular')) {
      if (isMasc) return `BODY TYPE (Broad/Muscular — Man): Structured pieces that fit the shoulders are essential. Avoid slim-fit cuts in the shoulders — opt for regular or athletic fit. V-necks and open collars elongate. Straight or relaxed trousers balance the upper body.`;
      if (isFem) return `BODY TYPE (Broad/Muscular — Woman): V-necks and scoop necks soften the shoulder line. A-line and wrap silhouettes balance proportions. Fitted waist with flared or straight leg. Avoid stiff structured shoulders.`;
      return `BODY TYPE (Broad/Muscular): Pieces that fit the shoulders properly. Avoid overly slim cuts. V-necks and open collars create elongation.`;
    }
    if (b.includes('curvy') || b.includes('full')) {
      if (isMasc) return `BODY TYPE (Full-figured — Man): Well-structured pieces with clean lines. Avoid overly baggy or overly tight. Darker tones as anchor pieces. Structured blazers add definition. Straight or relaxed trousers.`;
      if (isFem) return `BODY TYPE (Curvy/Full-figured — Woman): Celebrate the curves — wrap dresses, defined waist pieces, stretchy fitted fabrics. Empire waist and A-line silhouettes are flattering. Avoid boxy, shapeless pieces. V-necks and wrap necklines are your best friend.`;
      return `BODY TYPE (Curvy/Full-figured): Pieces with defined waist and clean lines. Celebrate the natural shape. Avoid boxy or shapeless silhouettes.`;
    }
    return `BODY TYPE: Recommend well-fitted pieces appropriate for the occasion and lifestyle.`;
  };

  // ─── BUDGET GUIDANCE ───────────────────────────────────────────────────────
  const getBudgetGuidance = (budget) => {
    const b = (budget || '').toLowerCase();
    if (b.includes('under') || b.includes('50')) {
      return `BUDGET (Under $50): Recommend accessible high-street brands — H&M, ASOS, Zara, Target. Focus on versatile basics that work across multiple outfits. Prioritize quality over quantity at this price point.`;
    }
    if (b.includes('50') || b.includes('150')) {
      return `BUDGET ($50-$150): Mid-range brands — Uniqlo, Banana Republic, Club Monaco, Madewell, Everlane. Quality basics and investment-worthy statement pieces. Recommend pieces that elevate the wardrobe without breaking the bank.`;
    }
    if (b.includes('150') || b.includes('300')) {
      return `BUDGET ($150-$300): Premium brands — Reiss, Ted Baker, AllSaints, Theory, A.P.C. Quality fabrics, elevated basics and investment pieces. Recommend fewer, better pieces.`;
    }
    return `BUDGET ($300+): Luxury adjacent brands — Acne Studios, Toteme, Sandro, Isabel Marant, COS premium line. Investment pieces, premium fabrics, designer basics. Recommend signature pieces that anchor the wardrobe for years.`;
  };

  // ─── GOAL GUIDANCE ─────────────────────────────────────────────────────────
  const getGoalGuidance = (goal) => {
    const g = (goal || '').toLowerCase();
    if (g.includes('put-together')) return `STYLE GOAL: The user wants to look polished and cohesive — every piece should feel intentional, clean and well-considered. No accident looks.`;
    if (g.includes('romantic') || g.includes('attract')) return `STYLE GOAL: The user wants to attract romantic interest — recommend confident, intentional pieces that draw attention without trying too hard. Fit is everything here.`;
    if (g.includes('respect')) return `STYLE GOAL: The user wants to command respect — authoritative, sharp and elevated. Every piece should project competence and confidence.`;
    if (g.includes('signature')) return `STYLE GOAL: The user wants a signature look — distinctive, editorial and memorable. Push toward pieces that feel uniquely theirs. Encourage bold choices within the palette.`;
    if (g.includes('basics')) return `STYLE GOAL: The user wants to upgrade their basics — recommend modern, versatile essentials that form the foundation of a strong wardrobe. Timeless over trendy.`;
    return `STYLE GOAL: Help the user develop a cohesive personal style that feels authentic and intentional.`;
  };

  // ─── SKIN TONE GUIDANCE ────────────────────────────────────────────────────
  const getSkinToneGuidance = (skinTone, season, skinGroup) => {
    const s = (season || '').toLowerCase();
    const seasonContext = {
      spring: 'Spring brings lighter fabrics, fresh energy and warmer temperatures',
      summer: 'Summer calls for vibrant colors, breathable fabrics and warm confident dressing',
      autumn: 'Autumn calls for rich layering, warm textures and deeper tones',
      winter: 'Winter calls for deep tones, heavy fabrics and dramatic contrast',
    }[s] || 'This season calls for intentional, considered dressing';

    const groupContext = {
      light: `${skinTone} skin has cool or neutral light undertones — colors need enough contrast to create definition without overwhelming`,
      medium: `${skinTone} skin has warm golden undertones — colors should either harmonize with that warmth or create elegant contrast against it`,
      deep: `${skinTone} skin has rich deep undertones — colors should either create luminous contrast or harmonize with the skin's natural depth and warmth`,
    }[skinGroup] || `${skinTone} skin deserves carefully considered color choices`;

    return `SKIN TONE (${skinTone} — ${skinGroup} group):
${groupContext}
${seasonContext}
- Every outfit tip MUST name ${skinTone} skin specifically
- Explain whether the color harmonizes with or contrasts ${skinTone} skin and why that works
- Reference the ${season} season context when describing fabric and layering choices`;
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
    spring: 'fresh, light fabrics, a sense of renewal and warm optimism',
    summer: 'vibrant, breathable fabrics, bold warm energy and confident ease',
    autumn: 'rich textures, layering, warm depth and intentional sophistication',
    winter: 'heavy fabrics, deep dramatic tones, cozy luxury and high contrast',
  };
  const seasonVibe = seasonVibes[(season || '').toLowerCase()] || 'intentional, considered styling';

  const colorDescription = `a palette drawn from ${season || 'your'} season's energy — chosen specifically for ${skinTone} skin and a ${lifestyle?.toLowerCase() || 'your'} lifestyle`;

  const currentYear = new Date().getFullYear();
  const currentSeason = season || 'current season';

  const prompt = `You are a world-class personal stylist with deep expertise in seasonal color theory, skin-tone-aware fashion, body type dressing and current trends. Every recommendation must feel like it was made specifically for this one person — not generic advice that could apply to anyone.

USER PROFILE:
- Gender: ${gender}
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Season: ${season}
- Budget: ${budget}
- Lifestyle: ${lifestyle}
- Style Goal: ${goal}

LOCKED COLOR PALETTE (do not change or substitute):
${JSON.stringify(selectedColors)}

PALETTE RULES:
- 1 statement color per outfit maximum
- Lightest color = base/neutral
- Deepest color = anchor piece
- Never combine more than 2 palette colors in one outfit
- Each of the 3 outfits must feature a DIFFERENT statement color

SEASON CONTEXT:
${currentSeason} ${currentYear} — ${seasonVibe}. Factor in what is currently trending in fashion for ${currentSeason} ${currentYear}. Weave current trends naturally into recommendations without announcing them as trends. An athletic creative might gravitate toward oversized silhouettes; a corporate professional might lean into current suiting trends. Let the trends feel like natural style choices, not a trend report.

${skinToneGuidance}

${bodyTypeGuidance}

${budgetGuidance}

${goalGuidance}

MANDATORY OUTPUT RULES:
1. Every outfit piece tip MUST name ${skinTone} skin specifically and explain color/contrast/harmony
2. Fit advice must reference the ${bodyType} body type specifically
3. Brand/price suggestions must align with the ${budget} budget
4. The overall tone and energy must serve the style goal: ${goal}
5. Outfit names must feel editorial — specific to this person's season, skin tone and lifestyle
6. stylePersonality must feel like a real archetype this person would identify with
7. NEVER include hex codes in item names — plain descriptive color words only
8. Fabric and layering advice must match the ${season} season
9. Trends should feel like natural style choices woven into the recommendations

Return ONLY a raw JSON object with NO markdown, NO backticks, NO explanation:
{"stylePersonality":"2-3 word archetype","colorPalette":${JSON.stringify(selectedColors)},"colorDescription":"${colorDescription}","outfits":[{"occasion":"name","outfitName":"editorial name","pieces":[{"item":"specific item with plain color and fabric description","tip":"skin tone + body type + season aware tip","search":"specific amazon search term that will return relevant results"}]}],"styleRules":["rule referencing ${skinTone} skin, ${bodyType} build and ${season} season","rule 2","rule 3"],"avoid":["specific item — why it does not work for this exact person","second item"],"quickWin":"single highest-impact styling change for this exact person right now"}

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
  } catch (e) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: e.message })}\n\n`);
    res.end();
  }
}

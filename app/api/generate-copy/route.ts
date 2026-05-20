import { NextRequest, NextResponse } from 'next/server';

const FOLLOZE_CONTEXT = `Folloze is a B2B buyer experience platform. Key capabilities:
- AI-powered content boards: personalized landing pages for ABM campaigns, events, and nurture flows
- Campaign Agent: AI assistant that builds, optimizes, and manages campaigns end-to-end
- Board Templates: pre-built, customizable layouts for different campaign types
- Content AI: generates and personalizes content for target accounts using AI
- Buyer Intelligence: tracks engagement signals across boards to identify intent
- Integrations: native connectors to Salesforce, Marketo, HubSpot, 6sense, and more
- Orchestration: multi-channel campaign workflows with automated personalization
Users are typically B2B marketers — demand gen, ABM, content marketing, and marketing ops.
Voice: confident, practical, helpful. Avoid hype. Focus on what the feature does and why it matters.`;

const COPY_RULES = `You are a world-class copywriter writing for Gainsight PX in-app engagement widgets inside Folloze.

CREATIVE GUIDELINES:
- Write like a top SaaS product marketer — punchy, clever, benefit-driven
- Headlines should spark curiosity or create urgency. Use power verbs, unexpected phrasing, or a twist
- Subtitles should paint a vivid before/after picture — what was painful, what's now effortless
- Avoid generic filler ("streamline", "leverage", "unlock potential"). Be specific about what changed
- Use active voice. Address the user directly ("you", "your")
- Match the energy of a product launch — exciting but credible, never breathless
- Good examples: "Your campaigns just learned to build themselves", "One click. Fully personalized. Zero guesswork."

STRUCTURE — always return:
- eyebrow: 1-3 punchy words. "Just shipped", "Game changer", "Finally". Skip if headline conveys novelty.
- headline: 5-9 words, bold and memorable, with one 2-3 word phrase that can be visually highlighted.
- headlineHighlight: the exact substring from headline to highlight, verbatim.
- subtitle: 15-25 words. Vivid, specific, benefit-focused. Make the reader feel the value instantly.

Archetype-specific extras:
If archetype is "feature-showcase":
  Also return featureHighlights: 3 items, each with:
    icon: a single emoji
    title: 1-2 words ("Generate", "Personalize", "Translate")
    subtitle: 3-6 words, punchy benefit ("Draft fast, on brand")
    style: "card"

If archetype is "split-picker":
  Also return pickerCards: 2 or 3 items, each with:
    eyebrow: 1-2 words ("AI-POWERED", "STRUCTURED")
    title: 2-4 words ("Let AI Decide")
    description: 8-15 words
    onClick: ""

If archetype is "bento-grid":
  Also return tiles: up to 5 items, each with:
    title: 1 word with optional emoji
    description: 4-8 words, vivid and specific

If archetype is "hero-promo":
  No CTA label needed.
  Optionally return pinnedTag: { eyebrow: "short callout", body: "8-12 word callout" }

Otherwise (announcement):
  Also return ctaLabel: 2-4 words, strong action verb, creates desire to click.

Return JSON only. No preamble. No markdown fences.`;

async function fetchArticleContent(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FollozeWidgetBuilder/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const stripped = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return stripped.slice(0, 4000);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { promoting, archetype, tone, helpLink, refine, currentCopy } = await request.json();

    if (!promoting) {
      return NextResponse.json({ error: 'promoting is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured. Fill in copy manually or add key to .env.local' },
        { status: 500 }
      );
    }

    let articleContext = '';
    if (helpLink) {
      const content = await fetchArticleContent(helpLink);
      if (content) {
        articleContext = `\n\nHelp article content (use this to write accurate, specific copy):\n---\n${content}\n---`;
      }
    }

    const systemPrompt = `${FOLLOZE_CONTEXT}\n\n${COPY_RULES}`;

    let userPrompt: string;
    if (refine && currentCopy) {
      userPrompt = `Topic: ${promoting}\nArchetype: ${archetype || 'announcement'}${articleContext}

Here is the current copy:
${JSON.stringify(currentCopy, null, 2)}

Rewrite it with this direction: ${refine}
Keep the same JSON structure. Return the full rewritten JSON.`;
    } else {
      userPrompt = `Topic: ${promoting}\nArchetype: ${archetype || 'announcement'}\nTone hint: ${tone || 'confident, practical, Folloze house voice'}${articleContext}`;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `API error: ${errText}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';

    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to generate copy' },
      { status: 500 }
    );
  }
}

'use client';

import { useState } from 'react';
import { WidgetSpec, EyebrowSpec } from '@/lib/types';
import { pickArchetype } from '@/lib/templates';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

const refinements = [
  { label: 'Shorter', prompt: 'Make the headline and subtitle significantly shorter and punchier. Cut every unnecessary word.' },
  { label: 'Longer', prompt: 'Expand the subtitle with more detail and context. Make the headline slightly more descriptive.' },
  { label: 'Bullet points', prompt: 'Rewrite the subtitle as 2-3 short bullet points separated by " | " (pipe). Keep it scannable.' },
  { label: 'More enthusiastic', prompt: 'Make it more exciting and energetic. Use power words, exclamation energy, and make the reader feel the excitement.' },
  { label: 'More technical', prompt: 'Use more precise, technical language. Speak to power users and technical marketers. Reference specific capabilities.' },
  { label: 'More official', prompt: 'Make the tone more formal and corporate. Professional, authoritative, enterprise-grade feel.' },
  { label: 'More playful', prompt: 'Make it fun, witty, and conversational. Add personality and a human touch. Light humor welcome.' },
  { label: 'Regenerate', prompt: 'Write a completely different version from scratch. New angle, new phrasing, surprise me.' },
];

export default function StepCopy({ spec, onChange }: Props) {
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const updateCopy = (updates: Partial<WidgetSpec['copy']>) => {
    onChange({ copy: { ...spec.copy, ...updates } });
  };

  const applyResult = (data: Record<string, unknown>) => {
    const copyUpdates: Partial<WidgetSpec['copy']> = {};
    if (data.eyebrow) {
      copyUpdates.eyebrows = [{ text: data.eyebrow as string, withBullet: true }];
    }
    if (data.headline) copyUpdates.headline = data.headline as string;
    if (data.headlineHighlight) copyUpdates.headlineHighlight = data.headlineHighlight as string;
    if (data.subtitle) copyUpdates.subtitle = data.subtitle as string;
    if (data.ctaLabel) copyUpdates.ctaLabel = data.ctaLabel as string;
    onChange({ copy: { ...spec.copy, ...copyUpdates } });

    if (data.featureHighlights) {
      onChange({ featureHighlights: data.featureHighlights as WidgetSpec['featureHighlights'] });
    }
    if (data.pickerCards) {
      onChange({ pickerCards: data.pickerCards as WidgetSpec['pickerCards'] });
    }
  };

  const generateWithAi = async () => {
    setGenerating(true);
    setError(null);
    try {
      const archetype = pickArchetype(spec);
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoting: spec.promoting, archetype, helpLink: spec.helpLink }),
      });
      if (!res.ok) throw new Error('AI generation failed');
      const data = await res.json();
      applyResult(data);
      setHasGenerated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const refineWithAi = async (prompt: string) => {
    setRefining(prompt);
    setError(null);
    try {
      const archetype = pickArchetype(spec);
      const currentCopy = {
        eyebrow: spec.copy.eyebrows?.[0]?.text,
        headline: spec.copy.headline,
        headlineHighlight: spec.copy.headlineHighlight,
        subtitle: spec.copy.subtitle,
        ctaLabel: spec.copy.ctaLabel,
      };
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoting: spec.promoting, archetype, helpLink: spec.helpLink, refine: prompt, currentCopy }),
      });
      if (!res.ok) throw new Error('AI refinement failed');
      const data = await res.json();
      applyResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Refinement failed');
    } finally {
      setRefining(null);
    }
  };

  const eyebrows = spec.copy.eyebrows || [];
  const addEyebrow = () => {
    updateCopy({ eyebrows: [...eyebrows, { text: '', withBullet: true }] });
  };
  const updateEyebrow = (i: number, updates: Partial<EyebrowSpec>) => {
    const newEyebrows = [...eyebrows];
    newEyebrows[i] = { ...newEyebrows[i], ...updates };
    updateCopy({ eyebrows: newEyebrows });
  };
  const removeEyebrow = (i: number) => {
    updateCopy({ eyebrows: eyebrows.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Widget copy</label>
        <button
          onClick={generateWithAi}
          disabled={generating || !spec.promoting}
          className="px-4 py-1.5 text-xs font-medium rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? 'Generating...' : hasGenerated ? '✨ Regenerate all' : '✨ Generate with AI'}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">{error}</div>
      )}

      {hasGenerated && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Refine with AI</label>
          <div className="flex flex-wrap gap-1.5">
            {refinements.map((r) => (
              <button
                key={r.label}
                onClick={() => refineWithAi(r.prompt)}
                disabled={!!refining || generating}
                className={`px-3 py-1 text-xs rounded-full border transition-all ${
                  refining === r.prompt
                    ? 'border-purple-400 bg-purple-50 text-purple-600 animate-pulse'
                    : 'border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50/50'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {refining === r.prompt ? 'Refining...' : r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-gray-500">Eyebrow pills</label>
          <button onClick={addEyebrow} className="text-xs text-purple-600 hover:text-purple-700">+ Add</button>
        </div>
        {eyebrows.map((eb, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <input
              type="text"
              value={eb.icon || ''}
              onChange={(e) => updateEyebrow(i, { icon: e.target.value })}
              placeholder="★"
              className="w-10 text-center px-1 py-1 border border-gray-200 rounded text-sm bg-white"
              maxLength={2}
            />
            <input
              type="text"
              value={eb.text}
              onChange={(e) => updateEyebrow(i, { text: e.target.value })}
              placeholder="NEW IN CAMPAIGN AGENT"
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs bg-white uppercase"
            />
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={eb.withBullet || false}
                onChange={(e) => updateEyebrow(i, { withBullet: e.target.checked })}
                className="rounded"
              />
              ●
            </label>
            <button onClick={() => removeEyebrow(i)} className="text-gray-300 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Headline</label>
        <input
          type="text"
          value={spec.copy.headline}
          onChange={(e) => updateCopy({ headline: e.target.value })}
          placeholder="Turn Ideas into Campaigns in Minutes"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Highlight phrase <span className="text-gray-300">(substring of headline to color)</span>
        </label>
        <input
          type="text"
          value={spec.copy.headlineHighlight || ''}
          onChange={(e) => updateCopy({ headlineHighlight: e.target.value })}
          placeholder="Campaigns in Minutes"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
        <textarea
          value={spec.copy.subtitle}
          onChange={(e) => updateCopy({ subtitle: e.target.value })}
          placeholder="Create personalized campaigns at scale with AI-powered content generation."
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">CTA label (optional)</label>
        <input
          type="text"
          value={spec.copy.ctaLabel || ''}
          onChange={(e) => updateCopy({ ctaLabel: e.target.value })}
          placeholder="Try it now"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Merge tag (optional)</label>
        <input
          type="text"
          value={spec.copy.mergeTag || ''}
          onChange={(e) => updateCopy({ mergeTag: e.target.value })}
          placeholder="{{User.firstName|null}}"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Footer link text</label>
          <input
            type="text"
            value={spec.copy.footerLink?.text || ''}
            onChange={(e) => {
              const url = spec.copy.footerLink?.url || '';
              updateCopy({ footerLink: e.target.value ? { text: e.target.value, url } : undefined });
            }}
            placeholder="Learn how it works"
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Footer link URL</label>
          <input
            type="url"
            value={spec.copy.footerLink?.url || ''}
            onChange={(e) => {
              const text = spec.copy.footerLink?.text || '';
              if (text) updateCopy({ footerLink: { text, url: e.target.value } });
            }}
            placeholder="https://..."
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Pinned tag (hero-promo only)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={spec.copy.pinnedTag?.eyebrow || ''}
            onChange={(e) => {
              const body = spec.copy.pinnedTag?.body || '';
              updateCopy({ pinnedTag: e.target.value ? { eyebrow: e.target.value, body } : undefined });
            }}
            placeholder="🚀 LAUNCH FASTER"
            className="px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
          />
          <input
            type="text"
            value={spec.copy.pinnedTag?.body || ''}
            onChange={(e) => {
              const eyebrow = spec.copy.pinnedTag?.eyebrow || '';
              if (eyebrow) updateCopy({ pinnedTag: { eyebrow, body: e.target.value } });
            }}
            placeholder="Tag body text"
            className="px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
          />
        </div>
      </div>
    </div>
  );
}

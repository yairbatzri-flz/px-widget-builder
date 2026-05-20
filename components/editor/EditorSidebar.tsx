'use client';

import { useState } from 'react';
import { WidgetSpec, ActionKind, BackgroundSpec, ButtonSpec, SecondaryButtonSpec, EyebrowSpec, ThemeName, Archetype } from '@/lib/types';
import { pickArchetype, detectArchetype } from '@/lib/templates';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left px-4 py-2.5 group hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</span>
        <span className="text-gray-300 group-hover:text-gray-500 text-xs">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

const actionOptions: { kind: ActionKind['kind']; label: string }[] = [
  { kind: 'helix', label: 'Open Helix' },
  { kind: 'template-duplicate', label: 'Duplicate Template' },
  { kind: 'close', label: 'Close Widget' },
  { kind: 'locked-popup', label: 'Locked Popup' },
  { kind: 'open-url', label: 'Open URL' },
  { kind: 'custom', label: 'Custom JS' },
];

const themeOptions: { value: ThemeName; label: string; colors: [string, string] }[] = [
  { value: 'lavender-light', label: 'Light', colors: ['#f0e7ff', '#9c27b0'] },
  { value: 'deep-purple', label: 'Purple', colors: ['#1c0d3a', '#d500f9'] },
  { value: 'dark-navy', label: 'Navy', colors: ['#0d1a2e', '#d500f9'] },
];

const archetypes: { value: Archetype; label: string }[] = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'hero-promo', label: 'Hero Promo' },
  { value: 'bento-grid', label: 'Bento Grid' },
  { value: 'split-picker', label: 'Split Picker' },
  { value: 'feature-showcase', label: 'Feature Showcase' },
  { value: 'hero-announce', label: 'Hero Announce' },
];

const refinements = [
  { label: 'Shorter', prompt: 'Make the headline and subtitle significantly shorter and punchier. Cut every unnecessary word.' },
  { label: 'Longer', prompt: 'Expand the subtitle with more detail and context. Make the headline slightly more descriptive.' },
  { label: 'Bullets', prompt: 'Rewrite the subtitle as 2-3 short bullet points separated by " | " (pipe). Keep it scannable.' },
  { label: 'Enthusiastic', prompt: 'Make it more exciting and energetic. Use power words and make the reader feel the excitement.' },
  { label: 'Technical', prompt: 'Use more precise, technical language. Speak to power users. Reference specific capabilities.' },
  { label: 'Official', prompt: 'Make the tone more formal and corporate. Professional, authoritative, enterprise-grade feel.' },
  { label: 'Playful', prompt: 'Make it fun, witty, and conversational. Add personality. Light humor welcome.' },
];

const defaultBg: BackgroundSpec = { type: 'solid', color: '#f0e7ff' };
const defaultBtn: ButtonSpec = { type: 'solid', color: '#7b1fa2', textColor: '#ffffff', borderRadius: 24, hoverEffect: 'lift', alignment: 'left' };

export default function EditorSidebar({ spec, onChange }: Props) {
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const showRefine = hasGenerated || (spec.copy.headline.length > 0 && spec.copy.subtitle.length > 0);

  const bg = spec.background ?? defaultBg;
  const btn = spec.button ?? defaultBtn;
  const detected = detectArchetype({ ...spec, archetypeOverride: undefined });

  const updateCopy = (updates: Partial<WidgetSpec['copy']>) => {
    onChange({ copy: { ...spec.copy, ...updates } });
  };

  const updateBg = (updates: Partial<BackgroundSpec>) => {
    onChange({ background: { ...bg, ...updates } });
  };

  const updateBtn = (updates: Partial<ButtonSpec>) => {
    onChange({ button: { ...btn, ...updates } });
  };

  const updateGraphics = (updates: Partial<WidgetSpec['graphics']>) => {
    onChange({ graphics: { ...spec.graphics, ...updates } });
  };

  const applyAiResult = (data: Record<string, unknown>) => {
    const copyUpdates: Partial<WidgetSpec['copy']> = {};
    if (data.eyebrow) copyUpdates.eyebrows = [{ text: data.eyebrow as string, withBullet: true }];
    if (data.headline) copyUpdates.headline = data.headline as string;
    if (data.headlineHighlight) copyUpdates.headlineHighlight = data.headlineHighlight as string;
    if (data.subtitle) copyUpdates.subtitle = data.subtitle as string;
    if (data.ctaLabel) copyUpdates.ctaLabel = data.ctaLabel as string;
    onChange({ copy: { ...spec.copy, ...copyUpdates } });
    if (data.featureHighlights) onChange({ featureHighlights: data.featureHighlights as WidgetSpec['featureHighlights'] });
    if (data.pickerCards) onChange({ pickerCards: data.pickerCards as WidgetSpec['pickerCards'] });
  };

  const generateWithAi = async () => {
    setGenerating(true);
    setAiError(null);
    try {
      const archetype = pickArchetype(spec);
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoting: spec.promoting, archetype, helpLink: spec.helpLink }),
      });
      if (!res.ok) throw new Error('AI generation failed');
      applyAiResult(await res.json());
      setHasGenerated(true);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const refineWithAi = async (prompt: string) => {
    setRefining(prompt);
    setAiError(null);
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
      applyAiResult(await res.json());
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Refinement failed');
    } finally {
      setRefining(null);
    }
  };

  const eyebrows = spec.copy.eyebrows || [];
  const features = spec.featureHighlights || [];
  const cards = spec.pickerCards || [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Topic + AI */}
        <Section title="Topic" defaultOpen={true}>
          <input
            type="text"
            value={spec.promoting}
            onChange={(e) => onChange({ promoting: e.target.value })}
            placeholder="e.g. Campaign Agent, Email Generator"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          />
          <input
            type="url"
            value={spec.helpLink || ''}
            onChange={(e) => onChange({ helpLink: e.target.value || undefined })}
            placeholder="Help article URL (optional)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
          />
          <button
            onClick={generateWithAi}
            disabled={generating || !spec.promoting}
            className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? 'Generating...' : hasGenerated ? '✨ Regenerate copy' : '✨ Generate with AI'}
          </button>
          {showRefine && (
            <div className="flex flex-wrap gap-1">
              {refinements.map((r) => (
                <button
                  key={r.label}
                  onClick={() => refineWithAi(r.prompt)}
                  disabled={!!refining || generating}
                  className={`px-2 py-0.5 text-[10px] rounded-full border transition-all ${
                    refining === r.prompt
                      ? 'border-purple-400 bg-purple-50 text-purple-600 animate-pulse'
                      : 'border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600'
                  } disabled:opacity-40`}
                >
                  {refining === r.prompt ? '...' : r.label}
                </button>
              ))}
            </div>
          )}
          {aiError && <div className="text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded">{aiError}</div>}
        </Section>

        {/* Layout + Theme */}
        <Section title="Layout & Theme" defaultOpen={true}>
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 block">Layout</label>
            <div className="flex flex-wrap gap-1">
              {archetypes.map((a) => (
                <button
                  key={a.value}
                  onClick={() => {
                    const newArch = a.value === detected ? undefined : a.value;
                    const wideLayouts: Archetype[] = ['split-picker', 'bento-grid'];
                    const effectiveArch = newArch || detected;
                    const needsWide = wideLayouts.includes(effectiveArch);
                    const widthUpdate = needsWide && (spec.widgetWidth || 620) < 900 ? { widgetWidth: 900 } : {};
                    onChange({ archetypeOverride: newArch, ...widthUpdate });
                  }}
                  className={`px-2 py-1 text-[10px] rounded border transition-all ${
                    (spec.archetypeOverride || detected) === a.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {a.label} {a.value === detected && !spec.archetypeOverride ? '•' : ''}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 block">Theme</label>
            <div className="flex gap-1.5">
              {themeOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => onChange({ theme: t.value })}
                  className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] transition-all ${
                    spec.theme === t.value ? 'border-purple-400 bg-purple-50 font-medium' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.colors[0] }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.colors[1] }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-gray-400">Width</label>
            <input type="range" value={spec.widgetWidth} onChange={(e) => onChange({ widgetWidth: parseInt(e.target.value) })} min={300} max={1400} className="flex-1" />
            <span className="text-[10px] text-gray-500 w-10 text-right">{spec.widgetWidth}px</span>
          </div>
        </Section>

        {/* Copy */}
        <Section title="Copy" defaultOpen={true}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-gray-400">Eyebrows</label>
              <button onClick={() => updateCopy({ eyebrows: [...eyebrows, { text: '', withBullet: true }] })} className="text-[10px] text-purple-600">+ Add</button>
            </div>
            {eyebrows.map((eb, i) => (
              <div key={i} className="flex items-center gap-1 mb-1">
                <input value={eb.icon || ''} onChange={(e) => { const n = [...eyebrows]; n[i] = { ...n[i], icon: e.target.value }; updateCopy({ eyebrows: n }); }} placeholder="★" className="w-7 text-center px-0 py-0.5 border border-gray-200 rounded text-xs bg-white" maxLength={2} />
                <input value={eb.text} onChange={(e) => { const n = [...eyebrows]; n[i] = { ...n[i], text: e.target.value }; updateCopy({ eyebrows: n }); }} placeholder="NEW FEATURE" className="flex-1 px-2 py-0.5 border border-gray-200 rounded text-[10px] bg-white uppercase" />
                <button onClick={() => updateCopy({ eyebrows: eyebrows.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-400 text-xs">&times;</button>
              </div>
            ))}
          </div>
          <input
            value={spec.copy.headline}
            onChange={(e) => updateCopy({ headline: e.target.value })}
            placeholder="Headline"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white"
          />
          <input
            value={spec.copy.headlineHighlight || ''}
            onChange={(e) => updateCopy({ headlineHighlight: e.target.value })}
            placeholder="Highlight phrase (from headline)"
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
          />
          <textarea
            value={spec.copy.subtitle}
            onChange={(e) => updateCopy({ subtitle: e.target.value })}
            placeholder="Subtitle"
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white resize-none"
          />
          <input
            value={spec.copy.subtitleSecondary || ''}
            onChange={(e) => updateCopy({ subtitleSecondary: e.target.value })}
            placeholder="Secondary subtitle (optional)"
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
          />
          <input
            value={spec.copy.statusText || ''}
            onChange={(e) => updateCopy({ statusText: e.target.value })}
            placeholder="Status text e.g. Available now"
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
          />
          <input
            value={spec.copy.mergeTag || ''}
            onChange={(e) => updateCopy({ mergeTag: e.target.value })}
            placeholder="Merge tag e.g. {{User.firstName|null}}"
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-mono bg-white"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={spec.copy.footerLink?.text || ''}
              onChange={(e) => {
                const url = spec.copy.footerLink?.url || '';
                updateCopy({ footerLink: e.target.value ? { text: e.target.value, url } : undefined });
              }}
              placeholder="Footer link text"
              className="px-2 py-1 border border-gray-200 rounded text-[10px] bg-white"
            />
            <input
              value={spec.copy.footerLink?.url || ''}
              onChange={(e) => {
                const text = spec.copy.footerLink?.text || '';
                if (text) updateCopy({ footerLink: { text, url: e.target.value } });
              }}
              placeholder="Footer URL"
              className="px-2 py-1 border border-gray-200 rounded text-[10px] bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={spec.copy.pinnedTag?.eyebrow || ''}
              onChange={(e) => {
                const body = spec.copy.pinnedTag?.body || '';
                updateCopy({ pinnedTag: e.target.value ? { eyebrow: e.target.value, body } : undefined });
              }}
              placeholder="Pinned tag eyebrow"
              className="px-2 py-1 border border-gray-200 rounded text-[10px] bg-white"
            />
            <input
              value={spec.copy.pinnedTag?.body || ''}
              onChange={(e) => {
                const eyebrow = spec.copy.pinnedTag?.eyebrow || '';
                if (eyebrow) updateCopy({ pinnedTag: { eyebrow, body: e.target.value } });
              }}
              placeholder="Pinned tag body"
              className="px-2 py-1 border border-gray-200 rounded text-[10px] bg-white"
            />
          </div>
        </Section>

        {/* Styling */}
        <Section title="Background">
          <div className="flex gap-1.5 mb-2">
            {(['solid', 'gradient'] as const).map(t => (
              <button key={t} onClick={() => updateBg({ type: t })} className={`px-2 py-1 rounded border text-[10px] capitalize ${bg.type === t ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 text-gray-500'}`}>{t}</button>
            ))}
          </div>
          {bg.type === 'solid' && (
            <div className="flex items-center gap-2">
              <input type="color" value={bg.color} onChange={(e) => updateBg({ color: e.target.value })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
              <input type="text" value={bg.color} onChange={(e) => updateBg({ color: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
            </div>
          )}
          {bg.type === 'gradient' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-8">From</span>
                <input type="color" value={bg.gradientFrom || '#fff'} onChange={(e) => updateBg({ gradientFrom: e.target.value })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
                <input type="text" value={bg.gradientFrom || '#fff'} onChange={(e) => updateBg({ gradientFrom: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-8">To</span>
                <input type="color" value={bg.gradientTo || '#fdf8ff'} onChange={(e) => updateBg({ gradientTo: e.target.value })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
                <input type="text" value={bg.gradientTo || '#fdf8ff'} onChange={(e) => updateBg({ gradientTo: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-8">Angle</span>
                <input type="number" value={bg.gradientAngle || 180} onChange={(e) => updateBg({ gradientAngle: parseInt(e.target.value) || 180 })} min={0} max={360} className="w-16 px-2 py-1 border border-gray-200 rounded text-[10px] bg-white" />
                <span className="text-[10px] text-gray-400">deg</span>
              </div>
            </div>
          )}
        </Section>

        {/* Button */}
        <Section title="Button">
          <input
            value={spec.copy.ctaLabel || ''}
            onChange={(e) => updateCopy({ ctaLabel: e.target.value })}
            placeholder="Primary button label"
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
          />
          <div className="border-t border-gray-100 pt-3 mt-1 space-y-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide block">Secondary Button</span>
            <input
              value={spec.secondaryButton?.label || ''}
              onChange={(e) => {
                if (e.target.value) {
                  onChange({ secondaryButton: { ...({ style: 'text', position: 'before', label: '' } as SecondaryButtonSpec), ...spec.secondaryButton, label: e.target.value } });
                } else {
                  onChange({ secondaryButton: undefined });
                }
              }}
              placeholder="Secondary button label (optional)"
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
            />
            {spec.secondaryButton?.label && (
              <>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Style</span>
                  <div className="flex gap-1">
                    {(['text', 'outline', 'solid'] as const).map(s => (
                      <button key={s} onClick={() => onChange({ secondaryButton: { ...spec.secondaryButton!, style: s } })} className={`px-2 py-0.5 rounded text-[10px] capitalize ${(spec.secondaryButton?.style || 'text') === s ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Position</span>
                  <div className="flex gap-1">
                    {(['before', 'after'] as const).map(p => (
                      <button key={p} onClick={() => onChange({ secondaryButton: { ...spec.secondaryButton!, position: p } })} className={`px-2 py-0.5 rounded text-[10px] capitalize ${(spec.secondaryButton?.position || 'before') === p ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>{p === 'before' ? 'Before primary' : 'After primary'}</button>
                    ))}
                  </div>
                </div>
                {spec.secondaryButton.style !== 'text' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">Color</span>
                    <input type="color" value={spec.secondaryButton.color || '#7b1fa2'} onChange={(e) => onChange({ secondaryButton: { ...spec.secondaryButton!, color: e.target.value } })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Action</span>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => onChange({ secondaryButton: { ...spec.secondaryButton!, action: undefined } })} className={`px-2 py-0.5 rounded text-[10px] ${!spec.secondaryButton?.action ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>None</button>
                    {actionOptions.map(a => (
                      <button key={a.kind} onClick={() => {
                        const action: ActionKind = a.kind === 'custom' ? { kind: 'custom', js: '' } : a.kind === 'open-url' ? { kind: 'open-url', url: '' } : { kind: a.kind } as ActionKind;
                        onChange({ secondaryButton: { ...spec.secondaryButton!, action } });
                      }} className={`px-2 py-0.5 rounded text-[10px] ${spec.secondaryButton?.action?.kind === a.kind ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>{a.label}</button>
                    ))}
                  </div>
                  {spec.secondaryButton?.action?.kind === 'open-url' && (
                    <input value={spec.secondaryButton.action.url} onChange={(e) => onChange({ secondaryButton: { ...spec.secondaryButton!, action: { kind: 'open-url', url: e.target.value } } })} placeholder="https://..." className="w-full mt-1 px-2 py-1 border border-gray-200 rounded text-[10px] bg-white" />
                  )}
                  {spec.secondaryButton?.action?.kind === 'custom' && (
                    <input value={spec.secondaryButton.action.js} onChange={(e) => onChange({ secondaryButton: { ...spec.secondaryButton!, action: { kind: 'custom', js: e.target.value } } })} placeholder="JS code" className="w-full mt-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
                  )}
                </div>
              </>
            )}
          </div>
          <div className="border-t border-gray-100 pt-3 mt-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-2">Primary Style</span>
          </div>
          <div className="flex gap-1.5 mb-2">
            {(['solid', 'gradient'] as const).map(t => (
              <button key={t} onClick={() => updateBtn({ type: t })} className={`px-2 py-1 rounded border text-[10px] capitalize ${btn.type === t ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 text-gray-500'}`}>{t}</button>
            ))}
          </div>
          {btn.type === 'solid' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">BG</span>
              <input type="color" value={btn.color} onChange={(e) => updateBtn({ color: e.target.value })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
              <input type="text" value={btn.color} onChange={(e) => updateBtn({ color: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
            </div>
          )}
          {btn.type === 'gradient' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-8">From</span>
                <input type="color" value={btn.gradientFrom || '#d500f9'} onChange={(e) => updateBtn({ gradientFrom: e.target.value })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
                <input type="text" value={btn.gradientFrom || '#d500f9'} onChange={(e) => updateBtn({ gradientFrom: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-8">To</span>
                <input type="color" value={btn.gradientTo || '#7b1fa2'} onChange={(e) => updateBtn({ gradientTo: e.target.value })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
                <input type="text" value={btn.gradientTo || '#7b1fa2'} onChange={(e) => updateBtn({ gradientTo: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Text</span>
            <input type="color" value={btn.textColor} onChange={(e) => updateBtn({ textColor: e.target.value })} className="w-8 h-6 rounded border border-gray-200 cursor-pointer p-0 appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded" />
            <input type="text" value={btn.textColor} onChange={(e) => updateBtn({ textColor: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Radius</span>
            <input type="number" value={btn.borderRadius} onChange={(e) => updateBtn({ borderRadius: parseInt(e.target.value) || 8 })} min={0} max={50} className="w-14 px-2 py-1 border border-gray-200 rounded text-[10px] bg-white" />
            <span className="text-[10px] text-gray-400">px</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block mb-1">Hover</span>
            <div className="flex gap-1">
              {(['lift', 'glow', 'darken', 'none'] as const).map(h => (
                <button key={h} onClick={() => updateBtn({ hoverEffect: h })} className={`px-2 py-0.5 rounded text-[10px] capitalize ${btn.hoverEffect === h ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>{h}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block mb-1">Alignment</span>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map(a => (
                <button key={a} onClick={() => updateBtn({ alignment: a })} className={`px-2.5 py-0.5 rounded text-[10px] capitalize ${(btn.alignment || 'left') === a ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>{a}</button>
              ))}
            </div>
          </div>
        </Section>

        {/* Graphics */}
        <Section title="Graphics">
          <div className="flex flex-wrap gap-1">
            {(['none', 'image', 'video', 'both'] as const).map((t) => (
              <button key={t} onClick={() => updateGraphics({ type: t })} className={`px-2 py-1 rounded border text-[10px] capitalize ${spec.graphics.type === t ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 text-gray-500'}`}>
                {t === 'none' ? 'None' : t === 'both' ? 'Image+Video' : t}
              </button>
            ))}
          </div>
          {(spec.graphics.type === 'image' || spec.graphics.type === 'both') && (
            <>
              <input type="url" value={spec.graphics.imageUrl || ''} onChange={(e) => updateGraphics({ imageUrl: e.target.value })} placeholder="Image URL" className="w-full px-2 py-1.5 border border-gray-200 rounded text-[10px] bg-white" />
              <div className="flex gap-1">
                {(['inline', 'hero-top'] as const).map((pos) => (
                  <button key={pos} onClick={() => updateGraphics({ imagePosition: pos })} className={`px-2 py-0.5 rounded text-[10px] ${(spec.graphics.imagePosition || 'inline') === pos ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                    {pos === 'inline' ? 'Inline' : 'Hero top'}
                  </button>
                ))}
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block mb-1">Image Fit</span>
                <div className="flex gap-1">
                  {(['full-bleed', 'inset'] as const).map((fit) => (
                    <button key={fit} onClick={() => updateGraphics({ imageFit: fit })} className={`px-2 py-0.5 rounded text-[10px] capitalize ${(spec.graphics.imageFit || 'full-bleed') === fit ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                      {fit === 'full-bleed' ? 'Full bleed' : 'Inset'}
                    </button>
                  ))}
                </div>
              </div>
              {spec.graphics.imageFit === 'inset' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">Padding</span>
                  <input type="range" min={0} max={30} value={spec.graphics.imagePadding || 0} onChange={(e) => updateGraphics({ imagePadding: parseInt(e.target.value) })} className="flex-1" />
                  <span className="text-[10px] text-gray-500 w-8">{spec.graphics.imagePadding || 0}px</span>
                </div>
              )}
            </>
          )}
          {(spec.graphics.type === 'video' || spec.graphics.type === 'both') && (
            <div className="flex gap-2">
              <input type="text" value={spec.graphics.videoId || ''} onChange={(e) => updateGraphics({ videoId: e.target.value })} placeholder="Vimeo ID" className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-[10px] bg-white" />
              <input type="text" value={spec.graphics.videoHash || ''} onChange={(e) => updateGraphics({ videoHash: e.target.value })} placeholder="Hash" className="w-20 px-2 py-1.5 border border-gray-200 rounded text-[10px] bg-white" />
            </div>
          )}
        </Section>

        {/* Actions */}
        <Section title="Actions">
          <div className="flex flex-wrap gap-1">
            {actionOptions.map((a) => (
              <button key={a.kind} onClick={() => {
                const action: ActionKind = a.kind === 'custom' ? { kind: 'custom', js: '' } : a.kind === 'open-url' ? { kind: 'open-url', url: '' } : { kind: a.kind } as ActionKind;
                onChange({ actions: [...spec.actions, action] });
              }} className="px-2 py-0.5 text-[10px] rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50">
                + {a.label}
              </button>
            ))}
          </div>
          {spec.actions.map((action, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded text-[10px]">
              <span className="font-bold text-purple-600 uppercase tracking-wide">{action.kind}</span>
              {action.kind === 'custom' && (
                <input value={action.js} onChange={(e) => { const a = [...spec.actions]; a[i] = { kind: 'custom', js: e.target.value }; onChange({ actions: a }); }} placeholder="JS code" className="flex-1 px-1.5 py-0.5 border border-gray-200 rounded text-[10px] font-mono bg-white" />
              )}
              {action.kind === 'open-url' && (
                <input value={action.url} onChange={(e) => { const a = [...spec.actions]; a[i] = { kind: 'open-url', url: e.target.value }; onChange({ actions: a }); }} placeholder="https://..." className="flex-1 px-1.5 py-0.5 border border-gray-200 rounded text-[10px] bg-white" />
              )}
              <button onClick={() => onChange({ actions: spec.actions.filter((_, idx) => idx !== i) })} className="ml-auto text-gray-300 hover:text-red-400">&times;</button>
            </div>
          ))}
        </Section>

        {/* Features / Picker cards */}
        <Section title="Features & Cards">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-medium">Feature highlights</span>
              {features.length < 3 && (
                <button onClick={() => onChange({ featureHighlights: [...features, { icon: '✨', title: '', style: 'card' as const }] })} className="text-[10px] text-purple-600">+ Add</button>
              )}
            </div>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-1">
                <input value={f.icon} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], icon: e.target.value }; onChange({ featureHighlights: n }); }} className="w-7 text-center border border-gray-200 rounded py-0.5 bg-white text-xs" maxLength={2} />
                <input value={f.title} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], title: e.target.value }; onChange({ featureHighlights: n }); }} placeholder="Title" className="flex-1 px-2 py-0.5 border border-gray-200 rounded text-[10px] bg-white" />
                <input value={f.subtitle || ''} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], subtitle: e.target.value }; onChange({ featureHighlights: n }); }} placeholder="Subtitle" className="flex-1 px-2 py-0.5 border border-gray-200 rounded text-[10px] bg-white" />
                <button onClick={() => onChange({ featureHighlights: features.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-400 text-xs">&times;</button>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-medium">Picker cards</span>
              {cards.length < 3 && (
                <button onClick={() => onChange({ pickerCards: [...cards, { eyebrow: '', title: '', description: '', onClick: '' }] })} className="text-[10px] text-purple-600">+ Add</button>
              )}
            </div>
            {cards.map((c, i) => (
              <div key={i} className="space-y-1 border border-gray-100 rounded p-2">
                <div className="flex items-center gap-1">
                  <input value={c.eyebrow} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], eyebrow: e.target.value }; onChange({ pickerCards: n }); }} placeholder="Eyebrow" className="w-20 px-1.5 py-0.5 border border-gray-200 rounded text-[10px] bg-white" />
                  <input value={c.title} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], title: e.target.value }; onChange({ pickerCards: n }); }} placeholder="Title" className="flex-1 px-1.5 py-0.5 border border-gray-200 rounded text-[10px] bg-white" />
                  <button onClick={() => onChange({ pickerCards: cards.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-400 text-xs">&times;</button>
                </div>
                <input value={c.description} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], description: e.target.value }; onChange({ pickerCards: n }); }} placeholder="Description" className="w-full px-1.5 py-0.5 border border-gray-200 rounded text-[10px] bg-white" />
                <input value={c.imageUrl || ''} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], imageUrl: e.target.value || undefined }; onChange({ pickerCards: n }); }} placeholder="Image URL" className="w-full px-1.5 py-0.5 border border-gray-200 rounded text-[10px] bg-white" />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

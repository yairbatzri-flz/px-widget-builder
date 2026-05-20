'use client';

import { useState } from 'react';
import { WidgetSpec, ActionKind, BackgroundSpec, ButtonSpec } from '@/lib/types';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-50 last:border-0 pb-5 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left py-1 group"
      >
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className="text-gray-300 group-hover:text-gray-500 text-xs">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

const actionOptions: { kind: ActionKind['kind']; label: string }[] = [
  { kind: 'helix', label: 'Open Helix' },
  { kind: 'template-duplicate', label: 'Duplicate Template' },
  { kind: 'close', label: 'Close Widget' },
  { kind: 'locked-popup', label: 'Locked Popup' },
  { kind: 'custom', label: 'Custom JS' },
];

const defaultBg: BackgroundSpec = { type: 'solid', color: '#f0e7ff' };
const defaultBtn: ButtonSpec = { type: 'solid', color: '#7b1fa2', textColor: '#ffffff', borderRadius: 24, hoverEffect: 'lift', alignment: 'left' };

export default function StepConfigure({ spec, onChange }: Props) {
  const bg = spec.background ?? defaultBg;
  const btn = spec.button ?? defaultBtn;

  const updateGraphics = (updates: Partial<WidgetSpec['graphics']>) => {
    onChange({ graphics: { ...spec.graphics, ...updates } });
  };

  const updateBg = (updates: Partial<BackgroundSpec>) => {
    onChange({ background: { ...bg, ...updates } });
  };

  const updateBtn = (updates: Partial<ButtonSpec>) => {
    onChange({ button: { ...btn, ...updates } });
  };

  const addAction = (kind: ActionKind['kind']) => {
    const action: ActionKind = kind === 'custom'
      ? { kind: 'custom', js: '' }
      : { kind } as ActionKind;
    onChange({ actions: [...spec.actions, action] });
  };

  const removeAction = (i: number) => onChange({ actions: spec.actions.filter((_, idx) => idx !== i) });

  const features = spec.featureHighlights || [];
  const cards = spec.pickerCards || [];

  return (
    <div className="space-y-5">
      {/* Topic */}
      <Section title="What are you promoting?">
        <input
          type="text"
          value={spec.promoting}
          onChange={(e) => onChange({ promoting: e.target.value })}
          placeholder="e.g. Campaign Agent, Board Templates, AI Content"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
        />
        <input
          type="url"
          value={spec.helpLink || ''}
          onChange={(e) => onChange({ helpLink: e.target.value || undefined })}
          placeholder="Help article URL (optional)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
        />
      </Section>

      {/* Widget width */}
      <Section title="Widget size" defaultOpen={false}>
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-500 w-16">Width (px)</label>
          <input
            type="number"
            value={spec.widgetWidth}
            onChange={(e) => onChange({ widgetWidth: parseInt(e.target.value) || 620 })}
            min={300}
            max={1400}
            className="w-24 px-3 py-1.5 border border-gray-200 rounded text-sm bg-white"
          />
          <input
            type="range"
            value={spec.widgetWidth}
            onChange={(e) => onChange({ widgetWidth: parseInt(e.target.value) })}
            min={300}
            max={1400}
            className="flex-1"
          />
        </div>
      </Section>

      {/* Background */}
      <Section title="Background" defaultOpen={false}>
        <div className="flex gap-2 mb-2">
          {(['solid', 'gradient'] as const).map(t => (
            <button
              key={t}
              onClick={() => updateBg({ type: t })}
              className={`px-3 py-1.5 rounded-lg border text-xs capitalize ${
                bg.type === t ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 text-gray-500'
              }`}
            >{t}</button>
          ))}
        </div>
        {bg.type === 'solid' && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500">Color</label>
            <input
              type="color"
              value={bg.color}
              onChange={(e) => updateBg({ color: e.target.value })}
              className="w-10 h-8 rounded border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={bg.color}
              onChange={(e) => updateBg({ color: e.target.value })}
              className="w-28 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white"
            />
          </div>
        )}
        {bg.type === 'gradient' && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500 w-10">From</label>
              <input type="color" value={bg.gradientFrom || '#ffffff'} onChange={(e) => updateBg({ gradientFrom: e.target.value })} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
              <input type="text" value={bg.gradientFrom || '#ffffff'} onChange={(e) => updateBg({ gradientFrom: e.target.value })} className="w-28 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500 w-10">To</label>
              <input type="color" value={bg.gradientTo || '#fdf8ff'} onChange={(e) => updateBg({ gradientTo: e.target.value })} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
              <input type="text" value={bg.gradientTo || '#fdf8ff'} onChange={(e) => updateBg({ gradientTo: e.target.value })} className="w-28 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500 w-10">Angle</label>
              <input type="number" value={bg.gradientAngle || 180} onChange={(e) => updateBg({ gradientAngle: parseInt(e.target.value) || 180 })} min={0} max={360} className="w-20 px-2 py-1 border border-gray-200 rounded text-xs bg-white" />
              <span className="text-xs text-gray-400">deg</span>
            </div>
          </div>
        )}
      </Section>

      {/* Button design */}
      <Section title="Button design" defaultOpen={false}>
        <div className="flex gap-2 mb-2">
          {(['solid', 'gradient'] as const).map(t => (
            <button
              key={t}
              onClick={() => updateBtn({ type: t })}
              className={`px-3 py-1.5 rounded-lg border text-xs capitalize ${
                btn.type === t ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 text-gray-500'
              }`}
            >{t}</button>
          ))}
        </div>
        {btn.type === 'solid' && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500">BG</label>
            <input type="color" value={btn.color} onChange={(e) => updateBtn({ color: e.target.value })} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <input type="text" value={btn.color} onChange={(e) => updateBtn({ color: e.target.value })} className="w-28 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white" />
          </div>
        )}
        {btn.type === 'gradient' && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500 w-10">From</label>
              <input type="color" value={btn.gradientFrom || '#d500f9'} onChange={(e) => updateBtn({ gradientFrom: e.target.value })} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
              <input type="text" value={btn.gradientFrom || '#d500f9'} onChange={(e) => updateBtn({ gradientFrom: e.target.value })} className="w-28 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500 w-10">To</label>
              <input type="color" value={btn.gradientTo || '#7b1fa2'} onChange={(e) => updateBtn({ gradientTo: e.target.value })} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
              <input type="text" value={btn.gradientTo || '#7b1fa2'} onChange={(e) => updateBtn({ gradientTo: e.target.value })} className="w-28 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-500">Text</label>
          <input type="color" value={btn.textColor} onChange={(e) => updateBtn({ textColor: e.target.value })} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
          <input type="text" value={btn.textColor} onChange={(e) => updateBtn({ textColor: e.target.value })} className="w-28 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-500">Radius</label>
          <input type="number" value={btn.borderRadius} onChange={(e) => updateBtn({ borderRadius: parseInt(e.target.value) || 8 })} min={0} max={50} className="w-16 px-2 py-1 border border-gray-200 rounded text-xs bg-white" />
          <span className="text-xs text-gray-400">px</span>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Hover effect</label>
          <div className="flex gap-2">
            {(['lift', 'glow', 'darken', 'none'] as const).map(h => (
              <button
                key={h}
                onClick={() => updateBtn({ hoverEffect: h })}
                className={`px-2.5 py-1 rounded text-xs capitalize ${
                  btn.hoverEffect === h ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-500'
                }`}
              >{h}</button>
            ))}
          </div>
        </div>
      </Section>

      {/* Graphics */}
      <Section title="Graphics" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {(['none', 'image', 'video', 'both'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateGraphics({ type: t })}
              className={`px-3 py-1.5 rounded-lg border text-xs capitalize ${
                spec.graphics.type === t ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-gray-200 text-gray-500'
              }`}
            >{t === 'none' ? 'None' : t === 'both' ? 'Image + Video' : t}</button>
          ))}
        </div>
        {(spec.graphics.type === 'image' || spec.graphics.type === 'both') && (
          <div className="space-y-2">
            <input type="url" value={spec.graphics.imageUrl || ''} onChange={(e) => updateGraphics({ imageUrl: e.target.value })} placeholder="Image URL" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
            <div className="flex gap-2">
              {(['inline', 'hero-top'] as const).map((pos) => (
                <button key={pos} onClick={() => updateGraphics({ imagePosition: pos })} className={`px-3 py-1 rounded text-xs ${(spec.graphics.imagePosition || 'inline') === pos ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                  {pos === 'inline' ? 'Inline' : 'Hero top'}
                </button>
              ))}
            </div>
          </div>
        )}
        {(spec.graphics.type === 'video' || spec.graphics.type === 'both') && (
          <div className="flex gap-2">
            <input type="text" value={spec.graphics.videoId || ''} onChange={(e) => updateGraphics({ videoId: e.target.value })} placeholder="Vimeo ID" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
            <input type="text" value={spec.graphics.videoHash || ''} onChange={(e) => updateGraphics({ videoHash: e.target.value })} placeholder="Hash (optional)" className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
          </div>
        )}
      </Section>

      {/* Actions */}
      <Section title="Actions" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {actionOptions.map((a) => (
            <button key={a.kind} onClick={() => addAction(a.kind)} className="px-2.5 py-1 text-xs rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50">
              + {a.label}
            </button>
          ))}
        </div>
        {spec.actions.map((action, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs">
            <span className="font-bold text-purple-600 uppercase tracking-wide">{action.kind}</span>
            {action.kind === 'custom' && (
              <input
                type="text"
                value={action.js}
                onChange={(e) => {
                  const a = [...spec.actions];
                  a[i] = { kind: 'custom', js: e.target.value };
                  onChange({ actions: a });
                }}
                placeholder="document.getElementById('myPopup').classList.add('show');"
                className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white"
              />
            )}
            <button onClick={() => removeAction(i)} className="ml-auto text-gray-300 hover:text-red-400">&times;</button>
          </div>
        ))}
      </Section>

      {/* Feature highlights */}
      <Section title="Feature highlights (optional)" defaultOpen={false}>
        <p className="text-xs text-gray-400">Add 3 features for the feature-showcase layout, or 2-3 picker cards for split-picker.</p>
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={f.icon} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], icon: e.target.value }; onChange({ featureHighlights: n }); }} className="w-10 text-center border border-gray-200 rounded py-1 bg-white" maxLength={2} />
              <input value={f.title} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], title: e.target.value }; onChange({ featureHighlights: n }); }} placeholder="Title" className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm bg-white" />
              <input value={f.subtitle || ''} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], subtitle: e.target.value }; onChange({ featureHighlights: n }); }} placeholder="Subtitle" className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white" />
              <button onClick={() => onChange({ featureHighlights: features.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-400">&times;</button>
            </div>
          ))}
          {features.length < 3 && (
            <button onClick={() => onChange({ featureHighlights: [...features, { icon: '✨', title: '', style: 'card' as const }] })} className="text-xs text-purple-600 hover:text-purple-700">+ Add feature</button>
          )}
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
          <span className="text-xs font-medium text-gray-500">Picker cards</span>
          {cards.map((c, i) => (
            <div key={i} className="space-y-1.5 border border-gray-100 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <input value={c.eyebrow} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], eyebrow: e.target.value }; onChange({ pickerCards: n }); }} placeholder="Eyebrow" className="w-24 px-2 py-1 border border-gray-200 rounded text-xs bg-white" />
                <input value={c.title} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], title: e.target.value }; onChange({ pickerCards: n }); }} placeholder="Title" className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm bg-white" />
                <button onClick={() => onChange({ pickerCards: cards.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-400">&times;</button>
              </div>
              <input value={c.description} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], description: e.target.value }; onChange({ pickerCards: n }); }} placeholder="Description" className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white" />
              <input value={c.imageUrl || ''} onChange={(e) => { const n = [...cards]; n[i] = { ...n[i], imageUrl: e.target.value || undefined }; onChange({ pickerCards: n }); }} placeholder="Image URL (optional)" className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white" />
            </div>
          ))}
          {cards.length < 3 && (
            <button onClick={() => onChange({ pickerCards: [...cards, { eyebrow: '', title: '', description: '', onClick: '' }] })} className="text-xs text-purple-600 hover:text-purple-700">+ Add picker card</button>
          )}
        </div>
      </Section>
    </div>
  );
}

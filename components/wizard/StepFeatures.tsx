'use client';

import { WidgetSpec, FeatureHighlight, PickerCard } from '@/lib/types';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

const defaultFeature: FeatureHighlight = { icon: '✨', title: '', subtitle: '', style: 'card' };
const defaultPickerCard: PickerCard = { eyebrow: '', title: '', description: '', onClick: '' };

export default function StepFeatures({ spec, onChange }: Props) {
  const features = spec.featureHighlights || [];
  const cards = spec.pickerCards || [];

  const updateFeature = (index: number, updates: Partial<FeatureHighlight>) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], ...updates };
    onChange({ featureHighlights: newFeatures });
  };

  const addFeature = () => {
    if (features.length >= 3) return;
    onChange({ featureHighlights: [...features, { ...defaultFeature }] });
  };

  const removeFeature = (index: number) => {
    onChange({ featureHighlights: features.filter((_, i) => i !== index) });
  };

  const updateCard = (index: number, updates: Partial<PickerCard>) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], ...updates };
    onChange({ pickerCards: newCards });
  };

  const addCard = () => {
    if (cards.length >= 3) return;
    onChange({ pickerCards: [...cards, { ...defaultPickerCard }] });
  };

  const removeCard = (index: number) => {
    onChange({ pickerCards: cards.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Feature highlights (3 max)</label>
          {features.length < 3 && (
            <button onClick={addFeature} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
              + Add feature
            </button>
          )}
        </div>
        {features.length === 0 && (
          <p className="text-xs text-gray-400">Optional. Used by the feature-showcase archetype.</p>
        )}
        {features.map((f, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={f.icon}
                onChange={(e) => updateFeature(i, { icon: e.target.value })}
                className="w-12 text-center px-2 py-1 border border-gray-200 rounded text-lg bg-white"
                maxLength={2}
              />
              <input
                type="text"
                value={f.title}
                onChange={(e) => updateFeature(i, { title: e.target.value })}
                placeholder="Title"
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm bg-white"
              />
              <button onClick={() => removeFeature(i)} className="text-gray-300 hover:text-red-400 text-lg">&times;</button>
            </div>
            <input
              type="text"
              value={f.subtitle || ''}
              onChange={(e) => updateFeature(i, { subtitle: e.target.value })}
              placeholder="Subtitle (optional)"
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
            />
            <div className="flex gap-2">
              {(['card', 'pill'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateFeature(i, { style: s })}
                  className={`px-3 py-1 rounded text-xs ${
                    f.style === s ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Picker cards (3 max)</label>
          {cards.length < 3 && (
            <button onClick={addCard} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
              + Add card
            </button>
          )}
        </div>
        {cards.length === 0 && (
          <p className="text-xs text-gray-400">Optional. Used by the split-picker archetype.</p>
        )}
        {cards.map((c, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={c.eyebrow}
                onChange={(e) => updateCard(i, { eyebrow: e.target.value })}
                placeholder="Eyebrow (AI-POWERED)"
                className="w-36 px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={c.title}
                onChange={(e) => updateCard(i, { title: e.target.value })}
                placeholder="Card title"
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm bg-white"
              />
              <button onClick={() => removeCard(i)} className="text-gray-300 hover:text-red-400 text-lg">&times;</button>
            </div>
            <textarea
              value={c.description}
              onChange={(e) => updateCard(i, { description: e.target.value })}
              placeholder="Card description"
              rows={2}
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={c.badge || ''}
                onChange={(e) => updateCard(i, { badge: e.target.value })}
                placeholder="Badge (optional)"
                className="w-28 px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={c.footerLink || ''}
                onChange={(e) => updateCard(i, { footerLink: e.target.value })}
                placeholder="Footer link text"
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs bg-white"
              />
            </div>
            <input
              type="text"
              value={c.onClick}
              onChange={(e) => updateCard(i, { onClick: e.target.value })}
              placeholder="onClick JS payload"
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs font-mono bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

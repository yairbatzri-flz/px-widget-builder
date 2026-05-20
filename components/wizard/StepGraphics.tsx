'use client';

import { WidgetSpec } from '@/lib/types';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

const graphicsTypes = [
  { value: 'none', label: 'No graphics', desc: 'Text-only widget' },
  { value: 'image', label: 'Image', desc: 'Static image or screenshot' },
  { value: 'video', label: 'Video (Vimeo)', desc: 'Embedded Vimeo player' },
  { value: 'both', label: 'Image + Video', desc: 'Both an image and video' },
] as const;

export default function StepGraphics({ spec, onChange }: Props) {
  const updateGraphics = (updates: Partial<WidgetSpec['graphics']>) => {
    onChange({ graphics: { ...spec.graphics, ...updates } });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Graphics type</label>
        <div className="grid grid-cols-2 gap-2">
          {graphicsTypes.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateGraphics({ type: opt.value })}
              className={`text-left p-3 rounded-lg border-2 transition-all ${
                spec.graphics.type === opt.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="text-sm font-medium text-gray-800">{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {(spec.graphics.type === 'image' || spec.graphics.type === 'both') && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
            <input
              type="url"
              value={spec.graphics.imageUrl || ''}
              onChange={(e) => updateGraphics({ imageUrl: e.target.value })}
              placeholder="https://cdn.folloze.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image position</label>
            <div className="flex gap-2">
              {(['inline', 'hero-top'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => updateGraphics({ imagePosition: pos })}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    (spec.graphics.imagePosition || 'inline') === pos
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {pos === 'inline' ? 'Inline' : 'Hero (top)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(spec.graphics.type === 'video' || spec.graphics.type === 'both') && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vimeo Video ID</label>
            <input
              type="text"
              value={spec.graphics.videoId || ''}
              onChange={(e) => updateGraphics({ videoId: e.target.value })}
              placeholder="123456789"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Video hash (optional)</label>
            <input
              type="text"
              value={spec.graphics.videoHash || ''}
              onChange={(e) => updateGraphics({ videoHash: e.target.value })}
              placeholder="abc123def"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

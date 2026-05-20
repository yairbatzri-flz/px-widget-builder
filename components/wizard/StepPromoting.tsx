'use client';

import { WidgetSpec } from '@/lib/types';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

export default function StepPromoting({ spec, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          What are you promoting?
        </label>
        <input
          type="text"
          value={spec.promoting}
          onChange={(e) => onChange({ promoting: e.target.value })}
          placeholder="e.g. Campaign Agent, Board Templates, AI Content Generator"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
        />
        <p className="text-xs text-gray-400 mt-1">
          The feature or product you&apos;re announcing to users
        </p>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Help article link (optional)
        </label>
        <input
          type="url"
          value={spec.helpLink || ''}
          onChange={(e) => onChange({ helpLink: e.target.value || undefined })}
          placeholder="https://support.folloze.com/..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
        />
      </div>
    </div>
  );
}

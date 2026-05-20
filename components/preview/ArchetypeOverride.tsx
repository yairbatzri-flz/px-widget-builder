'use client';

import { Archetype } from '@/lib/types';

type Props = {
  detected: Archetype;
  override?: Archetype;
  onChange: (archetype: Archetype | undefined) => void;
};

const archetypes: { value: Archetype; label: string }[] = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'hero-promo', label: 'Hero Promo' },
  { value: 'bento-grid', label: 'Bento Grid' },
  { value: 'split-picker', label: 'Split Picker' },
  { value: 'feature-showcase', label: 'Feature Showcase' },
];

export default function ArchetypeOverride({ detected, override, onChange }: Props) {
  const current = override || detected;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500">Layout:</span>
      <span className="text-xs text-purple-600 font-semibold capitalize">
        {detected.replace('-', ' ')}
      </span>
      <select
        value={current}
        onChange={(e) => {
          const val = e.target.value as Archetype;
          onChange(val === detected ? undefined : val);
        }}
        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
      >
        {archetypes.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label} {a.value === detected ? '(auto)' : ''}
          </option>
        ))}
      </select>
      {override && (
        <button
          onClick={() => onChange(undefined)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Reset
        </button>
      )}
    </div>
  );
}

'use client';

import { ThemeName } from '@/lib/types';

type Props = {
  value: ThemeName;
  onChange: (theme: ThemeName) => void;
};

const themeOptions: { value: ThemeName; label: string; colors: [string, string] }[] = [
  { value: 'lavender-light', label: 'Light Lavender', colors: ['#f0e7ff', '#9c27b0'] },
  { value: 'deep-purple', label: 'Deep Purple', colors: ['#1c0d3a', '#d500f9'] },
  { value: 'dark-navy', label: 'Dark Navy', colors: ['#0d1a2e', '#d500f9'] },
];

export default function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500">Theme:</span>
      {themeOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${
            value === opt.value
              ? 'border-purple-400 bg-purple-50 font-medium'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          title={opt.label}
        >
          <span
            className="w-3 h-3 rounded-full border border-gray-200"
            style={{ background: opt.colors[0] }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: opt.colors[1] }}
          />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

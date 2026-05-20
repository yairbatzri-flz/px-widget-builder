'use client';

import { useState, useMemo } from 'react';
import { WidgetSpec, ThemeName, Archetype } from '@/lib/types';
import { buildWidget, detectArchetype } from '@/lib/templates';
import { neutralizeForPx } from '@/lib/neutralization';
import ThemePicker from './ThemePicker';
import ArchetypeOverride from './ArchetypeOverride';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
  onBack: () => void;
  onReset: () => void;
};

export default function PreviewOutput({ spec, onChange, onBack, onReset }: Props) {
  const [showCode, setShowCode] = useState(false);
  const [neutralized, setNeutralized] = useState(false);
  const [copied, setCopied] = useState(false);

  const detected = detectArchetype({ ...spec, archetypeOverride: undefined });
  const rawHtml = useMemo(() => buildWidget(spec), [spec]);
  const outputHtml = neutralized ? neutralizeForPx(rawHtml) : rawHtml;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(outputHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Edit copy
          </button>
          <span className="text-gray-200">|</span>
          <button onClick={onReset} className="text-sm text-gray-400 hover:text-gray-600">
            Start over
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              showCode ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {showCode ? 'Hide code' : 'Show HTML'}
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl border border-gray-100 px-4 py-3">
        <ThemePicker
          value={spec.theme}
          onChange={(theme: ThemeName) => onChange({ theme })}
        />
        <span className="text-gray-200">|</span>
        <ArchetypeOverride
          detected={detected}
          override={spec.archetypeOverride}
          onChange={(archetype: Archetype | undefined) => onChange({ archetypeOverride: archetype })}
        />
      </div>

      {/* Code panel */}
      {showCode && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={neutralized}
                onChange={(e) => setNeutralized(e.target.checked)}
                className="rounded"
              />
              Neutralize for PX
            </label>
            {neutralized && (
              <span className="text-xs text-amber-600">
                onclick → data-px-onclick (re-attach via PX custom code)
              </span>
            )}
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs font-mono overflow-auto max-h-[300px] leading-relaxed">
            <code>{outputHtml}</code>
          </pre>
        </div>
      )}

      {/* Live preview */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-8 flex items-center justify-center min-h-[300px] overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
      </div>
    </div>
  );
}

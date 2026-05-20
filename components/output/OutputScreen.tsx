'use client';

import { useState, useMemo } from 'react';
import { WidgetSpec } from '@/lib/types';
import { buildWidget } from '@/lib/templates';
import { neutralizeForPx } from '@/lib/neutralization';

type Props = {
  spec: WidgetSpec;
};

export default function OutputScreen({ spec }: Props) {
  const [neutralized, setNeutralized] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawHtml = useMemo(() => buildWidget(spec), [spec]);
  const outputHtml = neutralized ? neutralizeForPx(rawHtml) : rawHtml;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(outputHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Output HTML</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={neutralized}
              onChange={(e) => setNeutralized(e.target.checked)}
              className="rounded"
            />
            Neutralize for PX
            <span className="text-gray-300" title="Converts onclick to data-px-click for PX WAF compatibility">(?)</span>
          </label>
          <button
            onClick={copyToClipboard}
            className="px-4 py-1.5 text-xs font-medium rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
      </div>

      {neutralized && (
        <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          Event handlers converted to <code className="font-mono">data-px-*</code> attributes. You&apos;ll need a PX custom code block to re-attach them.
        </div>
      )}

      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs font-mono overflow-auto max-h-[400px] leading-relaxed">
          <code>{outputHtml}</code>
        </pre>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 flex items-center justify-center min-h-[200px] overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
      </div>
    </div>
  );
}

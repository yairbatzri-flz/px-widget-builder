'use client';

import { useState, useMemo } from 'react';
import { WidgetSpec } from '@/lib/types';
import { buildWidget } from '@/lib/templates';
import { neutralizeForPx } from '@/lib/neutralization';
import EditorSidebar from '@/components/editor/EditorSidebar';

const defaultSpec: WidgetSpec = {
  promoting: '',
  graphics: { type: 'none' },
  actions: [],
  copy: {
    headline: '',
    subtitle: '',
  },
  theme: 'lavender-light',
  background: { type: 'solid', color: '#f0e7ff' },
  button: { type: 'solid', color: '#7b1fa2', textColor: '#ffffff', borderRadius: 24, hoverEffect: 'lift', alignment: 'left' },
  widgetWidth: 620,
};

export default function Home() {
  const [spec, setSpec] = useState<WidgetSpec>(defaultSpec);
  const [showCode, setShowCode] = useState(false);
  const [neutralized, setNeutralized] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateSpec = (updates: Partial<WidgetSpec>) => {
    setSpec((prev) => ({ ...prev, ...updates }));
  };

  const rawHtml = useMemo(() => buildWidget(spec), [spec]);
  const outputHtml = neutralized ? neutralizeForPx(rawHtml) : rawHtml;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(outputHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white flex-shrink-0 z-30">
        <div className="px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">PX</span>
            </div>
            <h1 className="text-xs font-semibold text-gray-800">Widget Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-[10px] text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={neutralized}
                onChange={(e) => setNeutralized(e.target.checked)}
                className="rounded w-3 h-3"
              />
              PX Neutralize
            </label>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`px-2.5 py-1 text-[10px] rounded border transition-colors ${
                showCode ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {showCode ? 'Hide HTML' : 'Show HTML'}
            </button>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-[10px] font-medium rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy HTML'}
            </button>
            <button
              onClick={() => setSpec(defaultSpec)}
              className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-gray-600 border border-gray-200 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <EditorSidebar spec={spec} onChange={updateSpec} />
        </aside>

        {/* Preview + Code */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Code panel */}
          {showCode && (
            <div className="flex-shrink-0 border-b border-gray-200 bg-gray-900 max-h-[250px] overflow-auto">
              <pre className="p-4 text-[10px] font-mono text-gray-100 leading-relaxed">
                <code>{outputHtml}</code>
              </pre>
            </div>
          )}

          {/* Live preview */}
          <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
            <div className="flex flex-col items-center gap-4">
              {!spec.copy.headline && !spec.copy.subtitle ? (
                <div className="text-center text-gray-300 py-20">
                  <div className="text-4xl mb-3">✨</div>
                  <p className="text-sm font-medium">Start building your widget</p>
                  <p className="text-xs mt-1">Enter a topic and generate copy with AI, or fill in the fields manually</p>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

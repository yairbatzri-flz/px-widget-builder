'use client';

import { WidgetSpec, ActionKind } from '@/lib/types';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

const actionTemplates: { kind: ActionKind['kind']; label: string; desc: string }[] = [
  { kind: 'helix', label: 'Open Helix', desc: 'Trigger the Helix AI sidebar' },
  { kind: 'template-duplicate', label: 'Duplicate Template', desc: 'Clone a board template' },
  { kind: 'close', label: 'Close Widget', desc: 'Dismiss the engagement' },
  { kind: 'locked-popup', label: 'Locked Popup', desc: 'Show AI-locked state popup' },
  { kind: 'custom', label: 'Custom JS', desc: 'Write your own JavaScript' },
];

export default function StepActions({ spec, onChange }: Props) {
  const addAction = (kind: ActionKind['kind']) => {
    let action: ActionKind;
    switch (kind) {
      case 'helix': action = { kind: 'helix' }; break;
      case 'template-duplicate': action = { kind: 'template-duplicate' }; break;
      case 'close': action = { kind: 'close' }; break;
      case 'locked-popup': action = { kind: 'locked-popup' }; break;
      case 'custom': action = { kind: 'custom', js: '' }; break;
      default: return;
    }
    onChange({ actions: [...spec.actions, action] });
  };

  const removeAction = (index: number) => {
    onChange({ actions: spec.actions.filter((_, i) => i !== index) });
  };

  const updateAction = (index: number, updates: Partial<ActionKind>) => {
    const newActions = [...spec.actions];
    newActions[index] = { ...newActions[index], ...updates } as ActionKind;
    onChange({ actions: newActions });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Add actions</label>
        <div className="flex flex-wrap gap-2">
          {actionTemplates.map((tmpl) => (
            <button
              key={tmpl.kind}
              onClick={() => addAction(tmpl.kind)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
            >
              + {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {spec.actions.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Current actions</label>
          {spec.actions.map((action, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                    {action.kind}
                  </span>
                  {action.kind !== 'close' && action.kind !== 'locked-popup' && 'close' in action && (
                    <label className="flex items-center gap-1 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        checked={(action as { close?: boolean }).close || false}
                        onChange={(e) => updateAction(i, { close: e.target.checked } as Partial<ActionKind>)}
                        className="rounded"
                      />
                      Close after
                    </label>
                  )}
                </div>
                {action.kind === 'custom' && (
                  <textarea
                    value={action.js}
                    onChange={(e) => updateAction(i, { kind: 'custom', js: e.target.value })}
                    placeholder="document.querySelector('#my-btn')?.click();"
                    rows={2}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs font-mono bg-white"
                  />
                )}
              </div>
              <button
                onClick={() => removeAction(i)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {spec.actions.length === 0 && (
        <p className="text-xs text-gray-400">No actions yet. The widget can be display-only.</p>
      )}
    </div>
  );
}

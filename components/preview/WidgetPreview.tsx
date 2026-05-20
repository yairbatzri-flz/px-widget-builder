'use client';

import { useMemo } from 'react';
import { WidgetSpec, ThemeName, Archetype } from '@/lib/types';
import { buildWidget, detectArchetype } from '@/lib/templates';
import ThemePicker from './ThemePicker';
import ArchetypeOverride from './ArchetypeOverride';

type Props = {
  spec: WidgetSpec;
  onChange: (updates: Partial<WidgetSpec>) => void;
};

export default function WidgetPreview({ spec, onChange }: Props) {
  const detected = detectArchetype({ ...spec, archetypeOverride: undefined });
  const html = useMemo(() => buildWidget(spec), [spec]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <ThemePicker
          value={spec.theme}
          onChange={(theme: ThemeName) => onChange({ theme })}
        />
        <ArchetypeOverride
          detected={detected}
          override={spec.archetypeOverride}
          onChange={(archetype: Archetype | undefined) => onChange({ archetypeOverride: archetype })}
        />
      </div>
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 flex items-center justify-center min-h-[300px] overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

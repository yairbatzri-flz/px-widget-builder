import { WidgetSpec, Archetype, Theme } from '../types';
import { getTheme } from '../themes';
import { buildAnnouncement } from './announcement';
import { buildHeroPromo } from './heroPromo';
import { buildBentoGrid } from './bentoGrid';
import { buildSplitPicker } from './splitPicker';
import { buildFeatureShowcase } from './featureShowcase';
import { buildHeroAnnounce } from './heroAnnounce';

export function pickArchetype(spec: WidgetSpec): Archetype {
  if (spec.archetypeOverride) return spec.archetypeOverride;
  if (spec.graphics.type === 'video') return 'hero-promo';
  if (spec.actions.length >= 4) return 'bento-grid';
  if (spec.actions.length >= 2) return 'split-picker';
  if (spec.featureHighlights && spec.featureHighlights.length === 3) return 'feature-showcase';
  return 'announcement';
}

const builders: Record<Archetype, (spec: WidgetSpec, theme: Theme) => string> = {
  'announcement': buildAnnouncement,
  'hero-promo': buildHeroPromo,
  'bento-grid': buildBentoGrid,
  'split-picker': buildSplitPicker,
  'feature-showcase': buildFeatureShowcase,
  'hero-announce': buildHeroAnnounce,
};

export function buildWidget(spec: WidgetSpec): string {
  const archetype = pickArchetype(spec);
  const theme = getTheme(spec.theme);
  return builders[archetype](spec, theme);
}

export { pickArchetype as detectArchetype };

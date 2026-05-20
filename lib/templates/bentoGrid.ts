import { WidgetSpec, Theme, BentoTileSpec } from '../types';
import { renderEyebrowPills, renderHeadline, renderBentoTile } from '../elements';
import { buildStyleBlock } from '../styles';

export function buildBentoGrid(spec: WidgetSpec, theme: Theme): string {
  const styles = buildStyleBlock(theme, spec.background, spec.button);
  const eyebrows = spec.copy.eyebrows?.length
    ? `<div class="pxw-center">${renderEyebrowPills(spec.copy.eyebrows)}</div>` : '';
  const headline = `<div class="pxw-center">${renderHeadline(spec.copy.headline, spec.copy.headlineHighlight)}</div>`;
  const subtitle = `<p class="pxw-subtitle pxw-center">${spec.copy.subtitle}</p>`;
  const w = spec.widgetWidth || 760;

  const defaultTiles: BentoTileSpec[] = [
    { title: 'Feature 1', description: 'Description here' },
    { title: 'Feature 2', description: 'Description here' },
    { title: 'Feature 3', description: 'Description here' },
    { title: 'Feature 4', description: 'Description here' },
    { title: 'Feature 5', description: 'Description here' },
  ];

  const tiles = (spec as unknown as { bentoTiles?: BentoTileSpec[] }).bentoTiles || defaultTiles;
  const hero = renderBentoTile(tiles[0], true);
  const smallTiles = tiles.slice(1, 5).map(t => renderBentoTile(t, false)).join('');

  return `${styles}
<div class="pxw" style="width:${w}px">
  ${eyebrows}
  ${headline}
  ${subtitle}
  <div class="pxw-bento">
    ${hero}
    <div class="pxw-bento-grid">
      ${smallTiles}
    </div>
  </div>
</div>`;
}

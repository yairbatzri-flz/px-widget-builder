import { BentoTileSpec } from '../types';
import { escapeAttr } from '../utils';

export function renderBentoTile(tile: BentoTileSpec, isHero: boolean): string {
  const imgClass = isHero ? 'pxw-bento-img pxw-bento-img-hero' : 'pxw-bento-img pxw-bento-img-sm';
  const tileClass = isHero ? 'pxw-bento-tile pxw-bento-hero' : 'pxw-bento-tile pxw-bento-small';
  const imgStyle = tile.imageUrl ? ` style="background-image:url('${tile.imageUrl}')"` : '';
  const onclick = tile.onClick ? ` onclick="${escapeAttr(tile.onClick)}"` : '';

  return `<div class="${tileClass}"${onclick}>
    <div class="${imgClass}"${imgStyle}></div>
    <div class="pxw-bento-body">
      ${tile.actionLabel ? `<div class="pxw-bento-action">${tile.actionLabel}</div>` : ''}
      <div class="pxw-bento-title">${tile.title}</div>
      <div class="pxw-bento-desc">${tile.description}</div>
      <div class="pxw-bento-footer">
        <span class="pxw-bento-link">Open &rsaquo;</span>
      </div>
    </div>
  </div>`;
}

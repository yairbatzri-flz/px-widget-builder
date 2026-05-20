import { EyebrowSpec } from '../types';

export function renderEyebrowPills(eyebrows: EyebrowSpec[]): string {
  if (!eyebrows.length) return '';
  const pills = eyebrows.map(e => {
    const prefix = e.icon ? `${e.icon} ` : e.withBullet ? '&#9679; ' : '';
    return `<span class="pxw-eyebrow">${prefix}${e.text}</span>`;
  }).join('');
  return `<div class="pxw-eyebrow-row">${pills}</div>`;
}

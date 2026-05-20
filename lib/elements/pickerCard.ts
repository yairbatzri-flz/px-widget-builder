import { PickerCard } from '../types';
import { escapeAttr } from '../utils';

export function renderPickerCard(card: PickerCard): string {
  const onclick = card.onClick ? ` onclick="${escapeAttr(card.onClick)}"` : '';
  const image = card.imageUrl ? `<img src="${card.imageUrl}" class="pxw-picker-img" alt="" />` : '';
  return `<div class="pxw-picker-card"${onclick}>
    ${image}
    <div class="pxw-picker-card-header">
      <span class="pxw-picker-eyebrow">${card.eyebrow}</span>
      ${card.badge ? `<span class="pxw-picker-badge">${card.badge}</span>` : ''}
    </div>
    <div class="pxw-picker-title">${card.title}</div>
    <div class="pxw-picker-desc">${card.description}</div>
    ${card.footerLink ? `<div class="pxw-picker-footer"><span class="pxw-picker-link">${card.footerLink}</span></div>` : ''}
  </div>`;
}

export function renderPickerCards(cards: PickerCard[]): string {
  return `<div class="pxw-picker-cards">${cards.map(c => renderPickerCard(c)).join('')}</div>`;
}

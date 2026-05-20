import { escapeAttr } from '../utils';
import { SecondaryButtonSpec } from '../types';
import { composeActionJs } from '../snippets/compose';

export function renderCtaButton(label: string, onClick?: string): string {
  const onclick = onClick ? ` onclick="${escapeAttr(onClick)}"` : '';
  return `<button class="pxw-cta"${onclick}>${label}</button>`;
}

export function renderSecondaryButton(spec: SecondaryButtonSpec): string {
  const onclick = spec.action ? ` onclick="${escapeAttr(composeActionJs(spec.action))}"` : '';
  const styleClass = `pxw-cta-secondary pxw-cta-secondary-${spec.style}`;
  const inlineStyle = spec.style === 'solid' && spec.color
    ? ` style="background:${spec.color};color:${spec.textColor || '#fff'}"`
    : spec.style === 'outline' && spec.color
    ? ` style="border-color:${spec.color};color:${spec.color}"`
    : spec.style === 'text' && spec.color
    ? ` style="color:${spec.color}"`
    : '';
  return `<button class="${styleClass}"${inlineStyle}${onclick}>${spec.label}</button>`;
}

export function renderCtaWrap(primary: string, secondary?: { html: string; position: 'before' | 'after' }): string {
  if (!secondary) return `<div class="pxw-cta-wrap">${primary}</div>`;
  const content = secondary.position === 'before'
    ? `${secondary.html}${primary}`
    : `${primary}${secondary.html}`;
  return `<div class="pxw-cta-wrap">${content}</div>`;
}

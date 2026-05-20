import { FeatureHighlight } from '../types';

export function renderFeatureCard(feature: FeatureHighlight): string {
  return `<div class="pxw-feature-card">
    <div class="pxw-feature-icon">${feature.icon}</div>
    <div class="pxw-feature-title">${feature.title}</div>
    ${feature.subtitle ? `<div class="pxw-feature-subtitle">${feature.subtitle}</div>` : ''}
  </div>`;
}

export function renderFeatureCards(features: FeatureHighlight[]): string {
  return `<div class="pxw-feature-cards">${features.map(f => renderFeatureCard(f)).join('')}</div>`;
}

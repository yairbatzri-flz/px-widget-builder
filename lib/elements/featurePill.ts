import { FeatureHighlight } from '../types';

export function renderFeaturePill(feature: FeatureHighlight): string {
  return `<div class="pxw-feature-pill">
    <div class="pxw-pill-icon">${feature.icon}</div>
    <div>
      <div class="pxw-pill-title">${feature.title}</div>
      ${feature.subtitle ? `<div class="pxw-pill-subtitle">${feature.subtitle}</div>` : ''}
    </div>
  </div>`;
}

export function renderFeaturePills(features: FeatureHighlight[]): string {
  return `<div class="pxw-feature-pills">${features.map(f => renderFeaturePill(f)).join('')}</div>`;
}

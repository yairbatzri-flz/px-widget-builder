import { WidgetSpec, Theme } from '../types';
import { renderEyebrowPills, renderHeadline, renderFeatureCards, renderFeaturePills, renderFooterLink } from '../elements';
import { buildStyleBlock } from '../styles';

export function buildFeatureShowcase(spec: WidgetSpec, theme: Theme): string {
  const styles = buildStyleBlock(theme, spec.background, spec.button);
  const eyebrows = spec.copy.eyebrows?.length ? renderEyebrowPills(spec.copy.eyebrows) : '';
  const headline = renderHeadline(spec.copy.headline, spec.copy.headlineHighlight);
  const subtitle = `<p class="pxw-subtitle">${spec.copy.subtitle}</p>`;
  const footer = spec.copy.footerLink ? renderFooterLink(spec.copy.footerLink) : '';
  const w = spec.widgetWidth || 680;

  const features = spec.featureHighlights || [];
  const featureStyle = features[0]?.style || 'card';
  const hasHeroImage = spec.graphics.type !== 'none' && spec.graphics.imageUrl && spec.graphics.imagePosition === 'hero-top';

  if (featureStyle === 'pill' && hasHeroImage) {
    return `${styles}
<div class="pxw pxw-showcase-hero" style="width:${w}px;padding:0">
  ${eyebrows ? `<div class="pxw-showcase-eyebrow-wrap">${eyebrows}</div>` : ''}
  <img src="${spec.graphics.imageUrl}" class="pxw-showcase-hero-img" alt="" />
  <div class="pxw-showcase-body">
    ${headline}
    ${subtitle}
    ${features.length ? renderFeaturePills(features) : ''}
    ${footer}
  </div>
</div>`;
  }

  return `${styles}
<div class="pxw" style="width:${w}px">
  ${eyebrows}
  ${headline}
  ${subtitle}
  ${features.length ? renderFeatureCards(features) : ''}
  ${footer}
</div>`;
}

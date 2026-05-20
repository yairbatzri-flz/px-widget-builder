import { WidgetSpec, Theme } from '../types';
import { renderEyebrowPills, renderHeadline, renderFooterLink, buildCtaRow } from '../elements';
import { buildStyleBlock } from '../styles';

export function buildAnnouncement(spec: WidgetSpec, theme: Theme): string {
  const styles = buildStyleBlock(theme, spec.background, spec.button);
  const eyebrows = spec.copy.eyebrows?.length ? renderEyebrowPills(spec.copy.eyebrows) : '';
  const headline = renderHeadline(spec.copy.headline, spec.copy.headlineHighlight);
  const subtitle = `<p class="pxw-subtitle">${spec.copy.subtitle}</p>`;

  let image = '';
  if (spec.graphics.type === 'image' && spec.graphics.imageUrl) {
    image = `<img src="${spec.graphics.imageUrl}" class="pxw-img-inline" alt="" />`;
  }

  const ctaRow = buildCtaRow(spec);
  const footer = spec.copy.footerLink ? renderFooterLink(spec.copy.footerLink) : '';
  const w = spec.widgetWidth || 620;

  return `${styles}
<div class="pxw" style="width:${w}px">
  ${eyebrows}
  ${headline}
  ${subtitle}
  ${image}
  ${ctaRow}
  ${footer}
</div>`;
}

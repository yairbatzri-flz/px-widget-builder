import { WidgetSpec, Theme } from '../types';
import { renderEyebrowPills, renderHeadline, buildCtaRow } from '../elements';
import { buildStyleBlock } from '../styles';

export function buildHeroAnnounce(spec: WidgetSpec, theme: Theme): string {
  const styles = buildStyleBlock(theme, spec.background, spec.button);
  const eyebrows = spec.copy.eyebrows?.length ? renderEyebrowPills(spec.copy.eyebrows) : '';
  const headline = renderHeadline(spec.copy.headline, spec.copy.headlineHighlight);
  const subtitle = `<p class="pxw-subtitle">${spec.copy.subtitle}</p>`;
  const subtitleSecondary = spec.copy.subtitleSecondary
    ? `<p class="pxw-subtitle pxw-subtitle-secondary">${spec.copy.subtitleSecondary}</p>`
    : '';
  const ctaRow = buildCtaRow(spec);
  const w = spec.widgetWidth || 620;

  const hasImage = spec.graphics.type !== 'none' && spec.graphics.imageUrl;
  const inset = spec.graphics.imageFit === 'inset';
  const heroClass = inset ? 'pxw-ha-hero pxw-ha-hero-inset' : 'pxw-ha-hero';
  const imgClass = inset ? 'pxw-ha-hero-img pxw-ha-hero-img-inset' : 'pxw-ha-hero-img';
  const padding = spec.graphics.imagePadding || 0;
  const wrapStyle = padding > 0 ? ` style="padding:${padding}px"` : '';
  const heroImg = hasImage
    ? `<div class="${heroClass}"${wrapStyle}><img src="${spec.graphics.imageUrl}" class="${imgClass}" alt="" /></div>`
    : `<div class="pxw-ha-hero pxw-ha-hero-placeholder"><div class="pxw-ha-placeholder-inner">🖼<br/><span>HERO IMAGE GOES HERE</span></div></div>`;

  const statusText = spec.copy.statusText
    ? `<span class="pxw-ha-status"><span class="pxw-ha-status-dot"></span>${spec.copy.statusText}</span>`
    : '';

  const eyebrowRow = (eyebrows || statusText)
    ? `<div class="pxw-ha-eyebrow-row">${eyebrows}${statusText}</div>`
    : '';

  const divider = inset ? '' : '<div class="pxw-ha-divider"></div>';

  return `${styles}
<div class="pxw pxw-ha" style="width:${w}px">
  ${heroImg}
  ${divider}
  <div class="pxw-ha-body">
    ${eyebrowRow}
    ${headline}
    ${subtitle}
    ${subtitleSecondary}
    ${ctaRow}
  </div>
</div>`;
}

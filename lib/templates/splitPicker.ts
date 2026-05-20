import { WidgetSpec, Theme } from '../types';
import { renderEyebrowPills, renderHeadline, renderPickerCards, buildCtaRow } from '../elements';
import { buildStyleBlock } from '../styles';

export function buildSplitPicker(spec: WidgetSpec, theme: Theme): string {
  const styles = buildStyleBlock(theme, spec.background, spec.button);
  const eyebrows = spec.copy.eyebrows?.length ? renderEyebrowPills(spec.copy.eyebrows) : '';
  const headline = renderHeadline(spec.copy.headline, spec.copy.headlineHighlight);
  const subtitle = `<p class="pxw-subtitle">${spec.copy.subtitle}</p>`;
  const ctaRow = buildCtaRow(spec);
  const w = spec.widgetWidth || 1100;

  const cards = spec.pickerCards?.length
    ? renderPickerCards(spec.pickerCards)
    : '';

  const hasImage = spec.graphics.type !== 'none' && spec.graphics.imageUrl;
  const rightContent = cards
    || (hasImage ? `<img src="${spec.graphics.imageUrl}" class="pxw-split-img" alt="" />` : '');

  return `${styles}
<div class="pxw pxw-split" style="width:${w}px">
  <div class="pxw-split-left">
    ${eyebrows}
    ${headline}
    ${subtitle}
    ${ctaRow}
  </div>
  <div class="pxw-split-right">
    ${rightContent}
  </div>
</div>`;
}

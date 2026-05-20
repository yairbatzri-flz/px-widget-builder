import { WidgetSpec, Theme } from '../types';
import { renderEyebrowPills, renderHeadline, renderPinnedTag, renderVimeoWrapper } from '../elements';
import { buildStyleBlock } from '../styles';

export function buildHeroPromo(spec: WidgetSpec, theme: Theme): string {
  const styles = buildStyleBlock(theme, spec.background, spec.button);
  const pinnedTag = spec.copy.pinnedTag ? renderPinnedTag(spec.copy.pinnedTag) : '';
  const eyebrows = spec.copy.eyebrows?.length ? renderEyebrowPills(spec.copy.eyebrows) : '';
  const headline = renderHeadline(spec.copy.headline, spec.copy.headlineHighlight);
  const subtitle = `<p class="pxw-subtitle pxw-center">${spec.copy.subtitle}</p>`;
  const w = spec.widgetWidth || 720;

  let video = '';
  if (spec.graphics.videoId) {
    video = renderVimeoWrapper(spec.graphics.videoId, spec.graphics.videoHash);
  }

  return `${styles}
<div class="pxw pxw-hero" style="width:${w}px">
  ${pinnedTag}
  ${eyebrows}
  ${video}
  <div class="pxw-center">${headline}</div>
  ${subtitle}
</div>`;
}

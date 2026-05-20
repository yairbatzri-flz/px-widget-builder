import { WidgetSpec } from '../types';
import { composeActionJs } from '../snippets/compose';
import { renderCtaButton, renderSecondaryButton, renderCtaWrap } from './ctaButton';

export function buildCtaRow(spec: WidgetSpec): string {
  const actionJs = spec.actions.length > 0 ? composeActionJs(spec.actions[0]) : undefined;
  const primary = spec.copy.ctaLabel ? renderCtaButton(spec.copy.ctaLabel, actionJs) : '';
  if (!primary) return '';

  const sb = spec.secondaryButton;
  if (sb && sb.label) {
    const secondaryHtml = renderSecondaryButton(sb);
    return renderCtaWrap(primary, { html: secondaryHtml, position: sb.position });
  }

  return renderCtaWrap(primary);
}

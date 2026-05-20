import { WidgetSpec } from './types';

export type ValidationError = { field: string; message: string };

export function validateSpec(spec: WidgetSpec): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!spec.promoting?.trim()) {
    errors.push({ field: 'promoting', message: 'What are you promoting is required' });
  }

  if (!spec.copy.headline?.trim()) {
    errors.push({ field: 'copy.headline', message: 'Headline is required' });
  }

  if (!spec.copy.subtitle?.trim()) {
    errors.push({ field: 'copy.subtitle', message: 'Subtitle is required' });
  }

  if (spec.copy.headline && spec.copy.headline.length > 80) {
    errors.push({ field: 'copy.headline', message: 'Headline should be under 80 characters' });
  }

  if (spec.copy.subtitle && spec.copy.subtitle.length > 200) {
    errors.push({ field: 'copy.subtitle', message: 'Subtitle should be under 200 characters' });
  }

  if (spec.graphics.type === 'video' && !spec.graphics.videoId) {
    errors.push({ field: 'graphics.videoId', message: 'Video ID is required when graphics type is video' });
  }

  if ((spec.graphics.type === 'image' || spec.graphics.type === 'both') && !spec.graphics.imageUrl) {
    errors.push({ field: 'graphics.imageUrl', message: 'Image URL is required when graphics type includes image' });
  }

  if (spec.copy.headlineHighlight && !spec.copy.headline.includes(spec.copy.headlineHighlight)) {
    errors.push({ field: 'copy.headlineHighlight', message: 'Highlight text must be a substring of the headline' });
  }

  if (spec.featureHighlights && spec.featureHighlights.length > 0 && spec.featureHighlights.length !== 3) {
    errors.push({ field: 'featureHighlights', message: 'Feature highlights should have exactly 3 items' });
  }

  return errors;
}

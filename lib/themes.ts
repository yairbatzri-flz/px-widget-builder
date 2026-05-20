import { Theme, ThemeName } from './types';

export const themes: Record<ThemeName, Theme> = {
  'lavender-light': {
    mode: 'light',
    bgPrimary: '#f0e7ff',
    bgCard: '#ffffff',
    bgEyebrowPill: 'rgba(213,0,249,0.12)',
    bgAccentIcon: '#d500f9',
    textPrimary: '#1a0d2e',
    textSecondary: '#6a4a8a',
    textHighlight: '#9c27b0',
    textEyebrow: '#7b1fa2',
    ctaBg: '#7b1fa2',
    ctaText: '#ffffff',
    linkColor: '#9c27b0',
    shadow: '0 12px 40px rgba(123,31,162,0.18)',
  },
  'deep-purple': {
    mode: 'dark',
    bgPrimary: '#1c0d3a',
    bgCard: 'rgba(255,255,255,0.04)',
    bgEyebrowPill: 'rgba(213,0,249,0.18)',
    bgAccentIcon: '#d500f9',
    textPrimary: '#ffffff',
    textSecondary: '#c5b3d9',
    textHighlight: '#f0a3ff',
    textEyebrow: '#ffd9ff',
    ctaBg: '#d500f9',
    ctaText: '#ffffff',
    linkColor: '#f0a3ff',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  'dark-navy': {
    mode: 'dark',
    bgPrimary: '#0d1a2e',
    bgCard: 'rgba(255,255,255,0.04)',
    bgEyebrowPill: 'rgba(213,0,249,0.18)',
    bgAccentIcon: '#d500f9',
    textPrimary: '#ffffff',
    textSecondary: '#c5b3d9',
    textHighlight: '#f0a3ff',
    textEyebrow: '#ffd9ff',
    ctaBg: '#d500f9',
    ctaText: '#ffffff',
    linkColor: '#f0a3ff',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
};

export function getTheme(name: ThemeName): Theme {
  return themes[name] || themes['lavender-light'];
}

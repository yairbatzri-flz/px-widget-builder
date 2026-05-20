export type ActionKind =
  | { kind: 'helix' }
  | { kind: 'template-duplicate' }
  | { kind: 'close' }
  | { kind: 'locked-popup' }
  | { kind: 'open-url'; url: string }
  | { kind: 'custom'; js: string };

export type EyebrowSpec = {
  text: string;
  withBullet?: boolean;
  icon?: string;
};

export type FeatureHighlight = {
  icon: string;
  title: string;
  subtitle?: string;
  style: 'pill' | 'card';
};

export type PickerCard = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl?: string;
  badge?: string;
  footerLink?: string;
  onClick: string;
};

export type BackgroundSpec = {
  type: 'solid' | 'gradient';
  color: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
};

export type ButtonSpec = {
  type: 'solid' | 'gradient';
  color: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor: string;
  borderRadius: number;
  hoverEffect: 'lift' | 'glow' | 'darken' | 'none';
  alignment: 'left' | 'center' | 'right';
};

export type SecondaryButtonSpec = {
  label: string;
  style: 'text' | 'outline' | 'solid';
  color?: string;
  textColor?: string;
  position: 'before' | 'after';
  action?: ActionKind;
};

export type WidgetSpec = {
  promoting: string;
  graphics: {
    type: 'image' | 'video' | 'both' | 'none';
    imageUrl?: string;
    imagePosition?: 'inline' | 'hero-top';
    imageFit?: 'full-bleed' | 'inset';
    imagePadding?: number;
    videoId?: string;
    videoHash?: string;
  };
  helpLink?: string;
  actions: ActionKind[];
  copy: {
    eyebrows?: EyebrowSpec[];
    headline: string;
    headlineHighlight?: string;
    subtitle: string;
    subtitleSecondary?: string;
    statusText?: string;
    ctaLabel?: string;
    mergeTag?: string;
    footerLink?: { text: string; url: string };
    pinnedTag?: { eyebrow: string; body: string };
  };
  featureHighlights?: FeatureHighlight[];
  pickerCards?: PickerCard[];
  theme: ThemeName;
  archetypeOverride?: Archetype;
  background: BackgroundSpec;
  button: ButtonSpec;
  secondaryButton?: SecondaryButtonSpec;
  widgetWidth: number;
};

export type Archetype = 'announcement' | 'hero-promo' | 'hero-announce' | 'bento-grid' | 'split-picker' | 'feature-showcase';

export type ThemeName = 'lavender-light' | 'deep-purple' | 'dark-navy';

export type Theme = {
  mode: 'light' | 'dark';
  bgPrimary: string;
  bgCard?: string;
  bgEyebrowPill: string;
  bgAccentIcon: string;
  textPrimary: string;
  textSecondary: string;
  textHighlight: string;
  textEyebrow: string;
  ctaBg: string;
  ctaText: string;
  linkColor: string;
  shadow: string;
};

export type BentoTileSpec = {
  title: string;
  description: string;
  imageUrl?: string;
  actionLabel?: string;
  onClick?: string;
};

export type WizardState = WidgetSpec & {
  currentStep: number;
};

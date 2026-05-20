import { Theme, BackgroundSpec, ButtonSpec } from './types';

function bgCss(bg: BackgroundSpec): string {
  if (bg.type === 'gradient') {
    const from = bg.gradientFrom || bg.color || '#ffffff';
    const to = bg.gradientTo || '#f0e7ff';
    return `linear-gradient(${bg.gradientAngle || 180}deg, ${from} 0%, ${to} 100%)`;
  }
  return bg.color;
}

function btnBgCss(btn: ButtonSpec): string {
  if (btn.type === 'gradient') {
    const from = btn.gradientFrom || btn.color || '#d500f9';
    const to = btn.gradientTo || '#7b1fa2';
    return `linear-gradient(135deg, ${from}, ${to})`;
  }
  return btn.color;
}

function btnHoverCss(btn: ButtonSpec): string {
  switch (btn.hoverEffect) {
    case 'lift':
      return 'transform:translateY(-2px); box-shadow:0 8px 20px rgba(123,31,162,0.35);';
    case 'glow':
      return 'box-shadow:0 0 20px rgba(213,0,249,0.5);';
    case 'darken':
      return 'filter:brightness(0.88);';
    default:
      return '';
  }
}

export function buildStyleBlock(theme: Theme, bg: BackgroundSpec, btn: ButtonSpec): string {
  const bgVal = bgCss(bg);
  const btnBg = btnBgCss(btn);
  const btnHover = btnHoverCss(btn);

  const btnAlign = btn.alignment === 'center' ? 'center' : btn.alignment === 'right' ? 'flex-end' : 'flex-start';

  return `<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800;900&display=swap');
.pxw { font-family:'Open Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:${bgVal}; border-radius:16px; padding:28px 30px 30px; box-shadow:${theme.shadow}; position:relative; box-sizing:border-box; }
.pxw *, .pxw *::before, .pxw *::after { box-sizing:border-box; margin:0; padding:0; }
.pxw-center { text-align:center; }

.pxw-eyebrow-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
.pxw-eyebrow { display:inline-block; padding:4px 12px; border-radius:20px; background:${theme.bgEyebrowPill}; color:${theme.textEyebrow} !important; font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; line-height:1.4; }

.pxw-headline { margin:0 0 8px 0; font-size:28px; font-weight:900; line-height:1.15; color:${theme.textPrimary} !important; letter-spacing:-0.6px; }
.pxw-highlight { color:${theme.textHighlight} !important; font-weight:900; }

.pxw-subtitle { margin:0 0 4px 0; font-size:14px; line-height:1.5; color:${theme.textSecondary} !important; font-weight:500; }

.pxw-cta-wrap { display:flex; justify-content:${btnAlign}; margin-top:12px; }
.pxw-cta { display:inline-flex; align-items:center; gap:6px; padding:12px 28px; border:none; border-radius:${btn.borderRadius}px; background:${btnBg}; color:${btn.textColor} !important; font-size:14px; font-weight:700; cursor:pointer; transition:transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease; letter-spacing:0.2px; font-family:inherit; }
.pxw-cta:hover { ${btnHover} }
.pxw-cta-secondary { display:inline-flex; align-items:center; gap:6px; padding:12px 28px; border:none; border-radius:${btn.borderRadius}px; font-size:13px; font-weight:600; cursor:pointer; transition:opacity 0.15s, transform 0.15s; font-family:inherit; }
.pxw-cta-secondary:hover { opacity:0.8; }
.pxw-cta-secondary-text { background:transparent; color:${theme.textSecondary} !important; }
.pxw-cta-secondary-outline { background:transparent; border:2px solid ${theme.textSecondary}; color:${theme.textSecondary} !important; }
.pxw-cta-secondary-solid { background:${theme.bgEyebrowPill}; color:${theme.textPrimary} !important; }

.pxw-footer-link { margin-top:14px; }
.pxw-footer-link a { color:${theme.linkColor} !important; font-size:13px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; }

.pxw-pinned { position:absolute; top:-12px; left:-12px; transform:rotate(-3deg); background:${theme.bgAccentIcon}; color:#fff !important; padding:10px 16px; border-radius:10px; z-index:10; box-shadow:0 4px 16px rgba(213,0,249,0.35); max-width:180px; }
.pxw-pinned-eyebrow { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; opacity:0.85; margin-bottom:3px; color:#fff !important; }
.pxw-pinned-body { font-size:13px; font-weight:600; line-height:1.3; color:#fff !important; }

.pxw-vimeo { width:100%; border-radius:12px; overflow:hidden; flex-shrink:0; min-height:280px; background:#000; }
.pxw-vimeo iframe { width:100%; height:320px; border:none; }

.pxw-feature-cards { display:flex; gap:12px; margin-top:16px; flex-wrap:wrap; }
.pxw-feature-card { flex:1; min-width:140px; background:${theme.bgCard || 'rgba(255,255,255,0.06)'}; border-radius:14px; padding:20px 16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; }
.pxw-feature-icon { width:44px; height:44px; border-radius:12px; background:${theme.bgAccentIcon}; display:flex; align-items:center; justify-content:center; font-size:20px; color:#fff !important; }
.pxw-feature-title { font-size:15px; font-weight:700; color:${theme.textPrimary} !important; }
.pxw-feature-subtitle { font-size:13px; color:${theme.textSecondary} !important; line-height:1.3; }

.pxw-feature-pills { display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; }
.pxw-feature-pill { display:flex; align-items:center; gap:10px; padding:8px 14px; background:${theme.bgCard || 'rgba(255,255,255,0.06)'}; border-radius:24px; }
.pxw-pill-icon { width:32px; height:32px; border-radius:50%; background:${theme.bgAccentIcon}; display:flex; align-items:center; justify-content:center; font-size:15px; color:#fff !important; flex-shrink:0; }
.pxw-pill-title { font-size:13px; font-weight:700; color:${theme.textPrimary} !important; }
.pxw-pill-subtitle { font-size:11px; color:${theme.textSecondary} !important; }

.pxw-bento { display:flex; gap:12px; align-items:stretch; }
.pxw-bento-hero { flex:1.2; }
.pxw-bento-grid { flex:1; display:flex; flex-wrap:wrap; gap:12px; }
.pxw-bento-tile { background:${theme.bgCard || '#fff'}; border-radius:14px; overflow:hidden; display:flex; flex-direction:column; cursor:pointer; box-shadow:0 2px 8px rgba(123,31,162,0.08), 0 0 0 1px rgba(220,180,240,0.3); transition:transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease; }
.pxw-bento-tile:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(123,31,162,0.18), 0 0 0 1px rgba(186,104,200,0.45); }
.pxw-bento-small { flex:1; min-width:45%; }
.pxw-bento-img { width:100%; background:linear-gradient(135deg,${theme.bgEyebrowPill},${theme.bgPrimary}); background-size:cover; background-position:center; }
.pxw-bento-img-hero { height:200px; }
.pxw-bento-img-sm { height:80px; }
.pxw-bento-body { padding:12px 14px; flex:1; display:flex; flex-direction:column; }
.pxw-bento-action { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${theme.textEyebrow} !important; margin-bottom:4px; }
.pxw-bento-title { font-size:14px; font-weight:700; color:${theme.textPrimary} !important; margin-bottom:4px; }
.pxw-bento-desc { font-size:12px; color:${theme.textSecondary} !important; line-height:1.4; flex:1; }
.pxw-bento-footer { margin-top:8px; padding-top:8px; border-top:1px solid ${theme.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}; }
.pxw-bento-link { font-size:11px; font-weight:600; color:${theme.linkColor} !important; }

.pxw-picker-cards { display:flex; gap:14px; flex-wrap:wrap; }
.pxw-picker-card { flex:1; min-width:200px; background:${theme.bgCard || '#fff'}; border-radius:14px; padding:0; display:flex; flex-direction:column; gap:0; cursor:pointer; transition:transform 0.15s; box-shadow:0 2px 8px rgba(123,31,162,0.08); overflow:hidden; }
.pxw-picker-img { width:100%; height:140px; object-fit:cover; display:block; }
.pxw-picker-card .pxw-picker-card-header,
.pxw-picker-card .pxw-picker-title,
.pxw-picker-card .pxw-picker-desc,
.pxw-picker-card .pxw-picker-footer { padding:0 18px; }
.pxw-picker-card .pxw-picker-card-header { padding-top:16px; }
.pxw-picker-card .pxw-picker-title { padding-top:6px; }
.pxw-picker-card .pxw-picker-desc { padding-top:4px; padding-bottom:4px; }
.pxw-picker-card .pxw-picker-footer { padding-bottom:16px; }
.pxw-picker-card:not(:has(.pxw-picker-img)) { padding:20px 18px; gap:8px; }
.pxw-picker-card:not(:has(.pxw-picker-img)) .pxw-picker-card-header,
.pxw-picker-card:not(:has(.pxw-picker-img)) .pxw-picker-title,
.pxw-picker-card:not(:has(.pxw-picker-img)) .pxw-picker-desc,
.pxw-picker-card:not(:has(.pxw-picker-img)) .pxw-picker-footer { padding:0; }
.pxw-picker-card:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(123,31,162,0.15); }
.pxw-picker-card-header { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.pxw-picker-eyebrow { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${theme.textEyebrow} !important; background:${theme.bgEyebrowPill}; padding:3px 8px; border-radius:6px; }
.pxw-picker-badge { font-size:10px; font-weight:600; color:${theme.ctaText} !important; background:${theme.ctaBg}; padding:2px 8px; border-radius:10px; }
.pxw-picker-title { font-size:16px; font-weight:700; color:${theme.textPrimary} !important; }
.pxw-picker-desc { font-size:13px; color:${theme.textSecondary} !important; line-height:1.4; flex:1; }
.pxw-picker-footer { margin-top:6px; }
.pxw-picker-link { font-size:12px; font-weight:600; color:${theme.linkColor} !important; }

.pxw-split { display:flex; gap:32px; align-items:flex-start; flex-wrap:wrap; }
.pxw-split-left { flex:0 0 38%; min-width:260px; }
.pxw-split-right { flex:1; min-width:280px; }
.pxw-split-img { width:100%; border-radius:12px; display:block; object-fit:cover; max-height:400px; box-shadow:0 4px 16px rgba(0,0,0,0.1); }

.pxw-hero { overflow:visible; display:flex; flex-direction:column; align-items:center; gap:16px; }

.pxw-showcase-hero { overflow:hidden; }
.pxw-showcase-hero-img { width:100%; display:block; }
.pxw-showcase-body { padding:22px 28px 28px; }
.pxw-showcase-eyebrow-wrap { padding:20px 28px 0; }

.pxw-img-inline { width:100%; border-radius:10px; margin-top:14px; }

.pxw-ha { padding:0; overflow:hidden; border-radius:0; }
.pxw-ha-hero { width:100%; min-height:180px; background:repeating-linear-gradient(45deg,${theme.mode === 'light' ? 'rgba(123,31,162,0.04)' : 'rgba(255,255,255,0.03)'},${theme.mode === 'light' ? 'rgba(123,31,162,0.04)' : 'rgba(255,255,255,0.03)'} 10px,transparent 10px,transparent 20px); display:flex; align-items:center; justify-content:center; position:relative; }
.pxw-ha-hero-img { width:100%; display:block; }
.pxw-ha-hero-inset { padding:3px; background:linear-gradient(90deg,${theme.textHighlight},#e040fb,${theme.ctaBg}); }
.pxw-ha-hero-img-inset { border-radius:0; }
.pxw-ha-hero-placeholder { min-height:200px; }
.pxw-ha-placeholder-inner { text-align:center; color:${theme.textSecondary} !important; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; opacity:0.5; }
.pxw-ha-placeholder-inner span { display:block; margin-top:8px; }
.pxw-ha-divider { height:3px; background:linear-gradient(90deg,${theme.textHighlight},#e040fb,${theme.ctaBg}); }
.pxw-ha-body { padding:20px 28px 24px; }
.pxw-ha-eyebrow-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.pxw-ha-status { font-size:12px; color:${theme.textSecondary} !important; font-weight:500; display:flex; align-items:center; gap:5px; }
.pxw-ha-status-dot { width:7px; height:7px; border-radius:50%; background:#e53935; display:inline-block; }
.pxw-subtitle-secondary { margin-top:6px; font-size:13px; font-weight:400; color:${theme.textSecondary} !important; opacity:0.8; }
</style>`;
}

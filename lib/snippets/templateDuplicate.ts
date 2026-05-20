export function templateDuplicateSnippet(): string {
  return `const el = document.getElementsByClassName('flz-btn button-with-dropdown'); if (el[0]) { el[0].click(); } const closeBtn = document.querySelector('.vex-close.aptr-engagement-close-btn.px-close-button'); if (closeBtn) { closeBtn.click(); }`;
}

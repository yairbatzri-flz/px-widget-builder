export function openUrlSnippet(url: string): string {
  return `window.open('${url}','_blank'); const closeBtn = document.querySelector('.vex-close.aptr-engagement-close-btn.px-close-button'); if (closeBtn) { closeBtn.click(); }`;
}

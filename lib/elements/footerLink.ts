export function renderFooterLink(link: { text: string; url: string }): string {
  return `<div class="pxw-footer-link">
    <a href="${link.url}" target="_blank" rel="noopener">${link.text} &rsaquo;</a>
  </div>`;
}

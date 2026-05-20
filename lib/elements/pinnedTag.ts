export function renderPinnedTag(tag: { eyebrow: string; body: string }): string {
  return `<div class="pxw-pinned">
    <div class="pxw-pinned-eyebrow">${tag.eyebrow}</div>
    <div class="pxw-pinned-body">${tag.body}</div>
  </div>`;
}

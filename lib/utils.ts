export function escapeAttr(js: string): string {
  return js.replace(/"/g, '&quot;');
}

export function renderHeadline(headline: string, highlight: string | undefined): string {
  let html = headline;
  if (highlight && headline.includes(highlight)) {
    html = headline.replace(highlight, `<span class="pxw-highlight">${highlight}</span>`);
  }
  return `<h2 class="pxw-headline">${html}</h2>`;
}

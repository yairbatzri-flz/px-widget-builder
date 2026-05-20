export function neutralizeForPx(html: string): string {
  let result = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

  result = result.replace(/<([a-z][a-z0-9]*)\b([^>]*?)>/gi, (fullMatch, tag: string, attrs: string) => {
    const neutralized = attrs.replace(
      /\s(on[a-z]+)=/gi,
      (_m: string, event: string) => ` data-px-${event}=`
    );
    return `<${tag}${neutralized}>`;
  });

  return result;
}

export function deneutralize(html: string): string {
  return html.replace(/\sdata-px-(on[a-z]+)=/gi, (_m, event: string) => {
    return ` ${event}=`;
  });
}

export function renderVimeoWrapper(videoId: string, videoHash?: string): string {
  const hashParam = videoHash ? `&h=${videoHash}` : '';
  return `<div class="pxw-vimeo">
    <iframe
      src="https://player.vimeo.com/video/${videoId}?autoplay=0&title=0&byline=0&portrait=0${hashParam}"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>`;
}

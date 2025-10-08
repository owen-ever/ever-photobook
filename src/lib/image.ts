export function calculateImageDimensions(imgWidth: number, imgHeight: number, viewportW: number, viewportH: number) {
  const imgAspectRatio = imgWidth / imgHeight;
  const viewportAspectRatio = viewportW / viewportH;

  let targetWidth: number;
  let targetHeight: number;

  if (imgAspectRatio > viewportAspectRatio) {
    // Image is wider than viewport - fit to width
    targetWidth = Math.min(viewportW * 0.95, imgWidth);
    targetHeight = targetWidth / imgAspectRatio;
  } else {
    // Image is taller than viewport - fit to height
    targetHeight = Math.min(viewportH * 0.95, imgHeight);
    targetWidth = targetHeight * imgAspectRatio;
  }

  return { width: targetWidth, height: targetHeight };
}

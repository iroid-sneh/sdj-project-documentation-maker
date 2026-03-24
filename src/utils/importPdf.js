import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Extract all pages from a PDF file as base64 PNG images.
 * Uses adaptive scale based on page count.
 */
export async function extractPdfPages(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  // Adaptive scale: lower for large PDFs to save memory
  let scale = 2;
  if (pdf.numPages > 50) scale = 1;
  else if (pdf.numPages > 20) scale = 1.5;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imageData = canvas.toDataURL('image/jpeg', 0.85);

    pages.push({
      pageNumber: i,
      imageData,
    });

    // Cleanup canvas memory between pages
    canvas.width = 0;
    canvas.height = 0;
  }

  return pages;
}

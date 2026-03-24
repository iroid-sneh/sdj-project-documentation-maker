import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Wait for all images inside an element to be fully loaded/decoded
function waitForImages(element) {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    if (img.complete && img.naturalHeight > 0) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
      // Force reload if src is base64 but not yet decoded
      if (img.src) {
        const src = img.src;
        img.src = '';
        img.src = src;
      }
    });
  });
  return Promise.all(promises);
}

export async function exportPdf(containerEl, projectName, totalPages) {
  const pageElements = containerEl.querySelectorAll('.print-area');
  if (pageElements.length === 0) return;

  let scale = 3;
  if (totalPages > 100) scale = 2;
  else if (totalPages > 50) scale = 2.5;

  // Wait for every image in the entire document to be loaded first
  await waitForImages(containerEl);
  // Extra safety delay for browser to finish decoding
  await new Promise((r) => setTimeout(r, 200));

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  for (let i = 0; i < pageElements.length; i++) {
    const pageEl = pageElements[i];

    const noPrintEls = pageEl.querySelectorAll('.no-print');
    noPrintEls.forEach((el) => (el.style.display = 'none'));

    // Temporarily make all overflow visible so html2canvas captures everything
    const overflowEls = pageEl.querySelectorAll('*');
    const savedOverflows = [];
    overflowEls.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.overflow === 'hidden') {
        savedOverflows.push({ el, val: el.style.overflow });
        el.style.overflow = 'visible';
      }
    });

    let canvas;
    try {
      canvas = await html2canvas(pageEl, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
      });
    } catch (err) {
      console.warn(`Failed to render page ${i + 1}, skipping:`, err);
      noPrintEls.forEach((el) => (el.style.display = ''));
      savedOverflows.forEach(({ el, val }) => (el.style.overflow = val));
      continue;
    }

    // Restore overflow and no-print
    savedOverflows.forEach(({ el, val }) => (el.style.overflow = val));
    noPrintEls.forEach((el) => (el.style.display = ''));

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');

    canvas.width = 0;
    canvas.height = 0;
  }

  const fileName = projectName
    ? `${projectName.replace(/[^a-zA-Z0-9 ]/g, '').trim()}.pdf`
    : 'document.pdf';

  pdf.save(fileName);
}

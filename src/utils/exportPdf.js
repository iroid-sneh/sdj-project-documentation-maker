import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export async function exportPdf(containerEl, projectName, totalPages) {
  const pageElements = containerEl.querySelectorAll('.print-area');
  if (pageElements.length === 0) return;

  // Adaptive quality: lower scale for large documents to prevent crashes
  let scale = 2;
  if (totalPages > 100) scale = 1;
  else if (totalPages > 50) scale = 1.5;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < pageElements.length; i++) {
    const pageEl = pageElements[i];

    // Hide no-print elements
    const noPrintEls = pageEl.querySelectorAll('.no-print');
    noPrintEls.forEach((el) => (el.style.display = 'none'));

    let canvas;
    try {
      canvas = await html2canvas(pageEl, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: pageEl.scrollWidth,
        height: pageEl.scrollHeight,
      });
    } catch (err) {
      console.warn(`Failed to render page ${i + 1}, skipping:`, err);
      noPrintEls.forEach((el) => (el.style.display = ''));
      continue;
    }

    // Restore no-print elements
    noPrintEls.forEach((el) => (el.style.display = ''));

    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

    // Help garbage collector between pages
    canvas.width = 0;
    canvas.height = 0;
  }

  const fileName = projectName
    ? `${projectName.replace(/[^a-zA-Z0-9 ]/g, '').trim()}.pdf`
    : 'document.pdf';

  pdf.save(fileName);
}

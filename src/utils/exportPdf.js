import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export async function exportPdf(containerEl, projectName) {
  // Find all .print-area elements (the actual A4 page divs)
  const pageElements = containerEl.querySelectorAll('.print-area');
  if (pageElements.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < pageElements.length; i++) {
    const pageEl = pageElements[i];

    // Hide no-print elements temporarily
    const noPrintEls = pageEl.querySelectorAll('.no-print');
    noPrintEls.forEach((el) => (el.style.display = 'none'));

    const canvas = await html2canvas(pageEl, {
      scale: 2, // high quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: pageEl.scrollWidth,
      height: pageEl.scrollHeight,
    });

    // Restore no-print elements
    noPrintEls.forEach((el) => (el.style.display = ''));

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Calculate dimensions to fit A4 exactly
    const imgWidth = A4_WIDTH_MM;
    const imgHeight = A4_HEIGHT_MM;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  }

  const fileName = projectName
    ? `${projectName.replace(/[^a-zA-Z0-9 ]/g, '').trim()}.pdf`
    : 'document.pdf';

  pdf.save(fileName);
}

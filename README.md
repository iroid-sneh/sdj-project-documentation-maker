# SDJ College - Project Documentation Maker

A web-based documentation generator built specifically for **SDJ International College, Vesu** students. Create properly formatted project reports that follow the college's official documentation guidelines — no more manual formatting in Word.

## What It Does

This tool lets you build your college project documentation page by page, with all the correct formatting rules applied automatically. Just add your content, arrange your pages, and export a print-ready PDF.

## College Formatting Rules (Applied Automatically)

| Element         | Font   | Size   | Style       |
|-----------------|--------|--------|-------------|
| Heading (H1)    | Arial  | 16pt   | Bold        |
| Sub Heading (H2)| Arial  | 12pt   | Bold        |
| Content / Body  | Arial  | 11pt   | Normal      |
| Content Width   | —      | —      | Justify     |

Every page includes:
- **Header**: College logo (left) + Project name (right)
- **Footer**: Page number (centered)
- **Page size**: A4 (210mm x 297mm) — fixed, never stretches

## Features

### Content Blocks
- **Heading** — Centered bold title (Arial 16pt)
- **Sub Heading** — Left-aligned bold subtitle (Arial 12pt)
- **Paragraph** — Justified body text (Arial 11pt, 1.6 line height)
- **Bullet Points** — Disc-style unordered list
- **Numbered Points** — Decimal ordered list
- **Table** — Full-bordered table with per-cell bold toggle (first row auto-bold as header)
- **Image Upload** — PNG, JPG, JPEG, GIF, BMP, WebP, SVG (up to 100MB) with size slider (10%–100%)
- **PDF Page Import** — Upload existing PDF pages directly into your document (great for college-provided cover pages, certificates, etc.)

### Page Management (Canva-style)
- Add, delete, duplicate, and reorder pages
- Thumbnail navigator panel with mini page previews
- Click any page to select and edit it
- Auto-reflow: content that overflows a page automatically moves to the next page

### Editing
- Edit any existing section — click the pencil icon, modify in the form, hit Save
- Move sections up/down within a page
- Alignment controls: Left, Center, Right, Justify
- Table cells have individual bold toggle buttons

### Export
- **Save PDF** — Generates a proper multi-page PDF using html2canvas + jsPDF
- All pages captured at 2x resolution for sharp output
- File named after your project automatically

### Data Persistence
- All pages, sections, and project name saved to localStorage automatically
- Your work persists across browser sessions

## Tech Stack

- **React 19** — Functional components with hooks
- **Vite** — Fast dev server and build tool
- **Tailwind CSS v4** — UI styling for the editor interface
- **Lucide React** — Icons
- **html2canvas-pro** — Page-to-image rendering for PDF export
- **jsPDF** — PDF generation

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## How to Use

1. **Set your project name** in the sidebar (shown on every page header)
2. **Select a section type** from the dropdown (Heading, Paragraph, Table, etc.)
3. **Enter content** and choose alignment
4. **Click "Add to Page"** — it appears in the live A4 preview
5. **Add more pages** using the "+ Add Page" button in the page navigator
6. **Import PDF pages** — upload college-provided pages (cover page, certificate, etc.) directly
7. **Reorder** pages and sections as needed
8. **Click "Save PDF"** to download your complete documentation

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx           — Content editor form + section list
│   ├── PageNavigator.jsx     — Page thumbnail grid (dark panel)
│   ├── DocumentPreview.jsx   — Live A4 page preview with auto-reflow
│   └── ConfirmModal.jsx      — Confirmation dialog for destructive actions
├── utils/
│   └── exportPdf.js          — PDF generation using html2canvas + jsPDF
├── App.jsx                   — State management, page/section CRUD, localStorage
├── main.jsx                  — Entry point
└── index.css                 — Tailwind + print styles
```

## Contact

Feel free to contact me for any bugs, issues, or feature requests for this documentation maker.

---

Built for SDJ International College, Vesu — Department of Computer Science & Engineering

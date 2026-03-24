import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import PageNavigator from './components/PageNavigator';
import DocumentPreview from './components/DocumentPreview';
import { exportPdf } from './utils/exportPdf';
import { extractPdfPages } from './utils/importPdf';
import { saveData, loadData } from './utils/storage';
import {
  createCoverPage,
  createAcknowledgementPage,
  createIndexPage,
} from './utils/collegeTemplates';

const STORAGE_KEY = 'documentPages';
const PROJECT_NAME_KEY = 'documentProjectName';

function createPage() {
  return { id: Date.now(), sections: [] };
}

export default function App() {
  const [pages, setPages] = useState([createPage()]);
  const [activePageId, setActivePageId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [loaded, setLoaded] = useState(false);
  const previewRef = useRef(null);
  const saveTimer = useRef(null);

  // Load from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [savedPages, savedName] = await Promise.all([
        loadData(STORAGE_KEY, null),
        loadData(PROJECT_NAME_KEY, ''),
      ]);
      if (cancelled) return;
      if (savedPages && Array.isArray(savedPages) && savedPages.length > 0) {
        setPages(savedPages);
        setActivePageId(savedPages[0].id);
      } else {
        const fresh = createPage();
        setPages([fresh]);
        setActivePageId(fresh.id);
      }
      setProjectName(savedName || '');
      setLoaded(true);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Debounced save to IndexedDB (300ms) — handles 200+ pages with images
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveData(STORAGE_KEY, pages);
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [pages, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveData(PROJECT_NAME_KEY, projectName);
  }, [projectName, loaded]);

  // Ensure activePageId is valid
  useEffect(() => {
    if (pages.length > 0 && !pages.find((p) => p.id === activePageId)) {
      setActivePageId(pages[0].id);
    }
  }, [pages, activePageId]);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const activePageIndex = pages.findIndex((p) => p.id === activePageId);

  // --- Page operations ---
  const addPage = useCallback(() => {
    const newPage = createPage();
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === activePageId);
      const copy = [...prev];
      copy.splice(idx + 1, 0, newPage);
      return copy;
    });
    setActivePageId(newPage.id);
  }, [activePageId]);

  const duplicatePage = useCallback((pageId) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === pageId);
      if (idx === -1) return prev;
      const dup = {
        ...JSON.parse(JSON.stringify(prev[idx])),
        id: Date.now() + Math.random(),
      };
      const copy = [...prev];
      copy.splice(idx + 1, 0, dup);
      return copy;
    });
  }, []);

  const deletePage = useCallback((pageId) => {
    setPages((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((p) => p.id !== pageId);
    });
  }, []);

  const movePage = useCallback((pageId, direction) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === pageId);
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }, []);

  // --- Section operations (scoped to active page) ---
  const addSection = useCallback((section) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId
          ? { ...p, sections: [...p.sections, section] }
          : p
      )
    );
  }, [activePageId]);

  const deleteSection = useCallback((sectionId) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId
          ? { ...p, sections: p.sections.filter((s) => s.id !== sectionId) }
          : p
      )
    );
  }, [activePageId]);

  const moveSection = useCallback((index, direction) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const newIdx = index + direction;
        if (newIdx < 0 || newIdx >= p.sections.length) return p;
        const updated = [...p.sections];
        [updated[index], updated[newIdx]] = [updated[newIdx], updated[index]];
        return { ...p, sections: updated };
      })
    );
  }, [activePageId]);

  const updateSection = useCallback((sectionId, updatedData) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.id === sectionId ? { ...s, ...updatedData } : s
              ),
            }
          : p
      )
    );
  }, [activePageId]);

  // Auto-reflow with max iterations guard (prevents infinite loops)
  const reflowCount = useRef(0);
  const reflowResetTimer = useRef(null);

  const handleOverflow = useCallback((pageId) => {
    // Guard: max 50 reflows per second to prevent infinite loops
    reflowCount.current++;
    if (reflowCount.current > 50) return;

    clearTimeout(reflowResetTimer.current);
    reflowResetTimer.current = setTimeout(() => {
      reflowCount.current = 0;
    }, 1000);

    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === pageId);
      if (idx === -1) return prev;
      const page = prev[idx];
      if (page.sections.length <= 1) return prev;

      const lastSection = page.sections[page.sections.length - 1];
      const updatedPage = { ...page, sections: page.sections.slice(0, -1) };
      const copy = [...prev];
      copy[idx] = updatedPage;

      if (idx + 1 < copy.length) {
        const nextPage = copy[idx + 1];
        copy[idx + 1] = {
          ...nextPage,
          sections: [lastSection, ...nextPage.sections],
        };
      } else {
        copy.push({
          id: Date.now() + Math.random(),
          sections: [lastSection],
        });
      }
      return copy;
    });
  }, []);

  const savePdf = useCallback(async () => {
    const container = previewRef.current;
    if (!container) return;
    await exportPdf(container, projectName, pages.length);
  }, [projectName, pages.length]);

  const importPdf = useCallback(async (file) => {
    try {
      const pdfPages = await extractPdfPages(file);
      setPages((prev) => {
        const idx = prev.findIndex((p) => p.id === activePageId);
        const newPages = pdfPages.map((pg, i) => ({
          id: Date.now() + i + Math.random(),
          sections: [
            {
              id: Date.now() + i * 1000 + Math.random(),
              type: 'imported-pdf',
              content: `${file.name} — Page ${pg.pageNumber}`,
              imageData: pg.imageData,
              align: 'center',
            },
          ],
        }));
        const copy = [...prev];
        copy.splice(idx + 1, 0, ...newPages);
        return copy;
      });
    } catch (err) {
      alert('Failed to import PDF. The file may be corrupted or too large.');
      console.error('PDF import error:', err);
    }
  }, [activePageId]);

  const insertTemplate = useCallback((templateType) => {
    let newPage;
    switch (templateType) {
      case 'cover': newPage = createCoverPage(); break;
      case 'acknowledgement': newPage = createAcknowledgementPage(); break;
      case 'index': newPage = createIndexPage(); break;
      default: return;
    }
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === activePageId);
      const copy = [...prev];
      copy.splice(idx + 1, 0, newPage);
      return copy;
    });
    setActivePageId(newPage.id);
  }, [activePageId]);

  const clearAll = () => {
    const fresh = createPage();
    setPages([fresh]);
    setActivePageId(fresh.id);
  };

  // Show loading state while IndexedDB loads
  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sections={activePage?.sections || []}
        onAddSection={addSection}
        onDeleteSection={deleteSection}
        onMoveSection={moveSection}
        onUpdateSection={updateSection}
        onClearAll={clearAll}
        onSavePdf={savePdf}
        onImportPdf={importPdf}
        onInsertTemplate={insertTemplate}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        activePageIndex={activePageIndex}
        totalPages={pages.length}
      />
      <PageNavigator
        pages={pages}
        activePageId={activePageId}
        onSelectPage={setActivePageId}
        onAddPage={addPage}
        onDeletePage={deletePage}
        onMovePage={movePage}
        onDuplicatePage={duplicatePage}
        projectName={projectName}
      />
      <DocumentPreview
        ref={previewRef}
        pages={pages}
        activePageId={activePageId}
        onSelectPage={setActivePageId}
        onOverflow={handleOverflow}
        projectName={projectName}
      />
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import PageNavigator from './components/PageNavigator';
import DocumentPreview from './components/DocumentPreview';
import { exportPdf } from './utils/exportPdf';

const STORAGE_KEY = 'documentPages';
const PROJECT_NAME_KEY = 'documentProjectName';

function createPage() {
  return { id: Date.now(), sections: [] };
}

function loadPages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [createPage()];
}

function loadProjectName() {
  try {
    return localStorage.getItem(PROJECT_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export default function App() {
  const [pages, setPages] = useState(loadPages);
  const [activePageId, setActivePageId] = useState(() => loadPages()[0].id);
  const [projectName, setProjectName] = useState(loadProjectName);
  const previewRef = useRef(null);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch {
      console.warn('localStorage quota exceeded.');
    }
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(PROJECT_NAME_KEY, projectName);
  }, [projectName]);

  // Ensure activePageId is always valid
  useEffect(() => {
    if (!pages.find((p) => p.id === activePageId)) {
      setActivePageId(pages[0]?.id);
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
        id: Date.now(),
      };
      const copy = [...prev];
      copy.splice(idx + 1, 0, dup);
      return copy;
    });
  }, []);

  const deletePage = useCallback((pageId) => {
    setPages((prev) => {
      if (prev.length <= 1) return prev; // keep at least 1 page
      const filtered = prev.filter((p) => p.id !== pageId);
      return filtered;
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

  // Auto-reflow: when a page overflows, move its last section to the next page
  const handleOverflow = useCallback((pageId) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === pageId);
      if (idx === -1) return prev;
      const page = prev[idx];
      if (page.sections.length <= 1) return prev; // can't move the only section

      const lastSection = page.sections[page.sections.length - 1];
      const updatedPage = {
        ...page,
        sections: page.sections.slice(0, -1),
      };

      const copy = [...prev];
      copy[idx] = updatedPage;

      // If next page exists, prepend the section to it
      if (idx + 1 < copy.length) {
        const nextPage = copy[idx + 1];
        copy[idx + 1] = {
          ...nextPage,
          sections: [lastSection, ...nextPage.sections],
        };
      } else {
        // Create a new page with the overflowing section
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
    await exportPdf(container, projectName);
  }, [projectName]);

  const clearAll = () => {
    const fresh = createPage();
    setPages([fresh]);
    setActivePageId(fresh.id);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Sidebar for editing */}
      <Sidebar
        sections={activePage?.sections || []}
        onAddSection={addSection}
        onDeleteSection={deleteSection}
        onMoveSection={moveSection}
        onUpdateSection={updateSection}
        onClearAll={clearAll}
        onSavePdf={savePdf}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        activePageIndex={activePageIndex}
        totalPages={pages.length}
      />

      {/* Middle: Page thumbnail navigator */}
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

      {/* Right: Full document preview */}
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

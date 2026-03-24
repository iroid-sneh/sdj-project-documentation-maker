import { useState, useRef } from 'react';
import ConfirmModal from './ConfirmModal';
import {
  Plus,
  Trash2,
  Printer,
  ChevronUp,
  ChevronDown,
  FileX,
  Image,
  FileUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table,
  X,
  Pencil,
  Check,
} from 'lucide-react';

const SECTION_TYPES = [
  { value: 'title', label: 'Heading' },
  { value: 'subtitle', label: 'Sub Heading' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'bullet', label: 'Bullet Points' },
  { value: 'numbered', label: 'Numbered Points' },
  { value: 'table', label: 'Table' },
  { value: 'image', label: 'Image Upload' },
  { value: 'pdf-page', label: 'PDF Page Upload' },
];

const ALIGN_OPTIONS = [
  { value: 'left', icon: AlignLeft, label: 'Left' },
  { value: 'center', icon: AlignCenter, label: 'Center' },
  { value: 'right', icon: AlignRight, label: 'Right' },
  { value: 'justify', icon: AlignJustify, label: 'Justify' },
];

const IMAGE_ACCEPT = '.png,.jpg,.jpeg,.gif,.bmp,.webp,.svg';
const PDF_ACCEPT = '.pdf';
const MAX_FILE_SIZE = 100 * 1024 * 1024;

function getDefaultAlign(type) {
  if (type === 'title') return 'center';
  if (type === 'image' || type === 'pdf-page') return 'center';
  return 'justify';
}

function getSectionLabel(type) {
  const found = SECTION_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
}

export default function Sidebar({
  sections,
  onAddSection,
  onDeleteSection,
  onMoveSection,
  onUpdateSection,
  onClearAll,
  onSavePdf,
  projectName,
  onProjectNameChange,
  activePageIndex,
  totalPages,
}) {
  const [type, setType] = useState('title');
  const [content, setContent] = useState('');
  const [align, setAlign] = useState('center');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const [imageWidth, setImageWidth] = useState(50);

  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);
  const [tableData, setTableData] = useState(() => createEmptyTable(2, 2));

  // Edit mode: null means adding new, otherwise holds the section id being edited
  const [editingId, setEditingId] = useState(null);

  // Confirm modal state
  const [modal, setModal] = useState({ open: false, type: null, data: null });

  const isFileType = type === 'image' || type === 'pdf-page';
  const isTable = type === 'table';
  const isEditing = editingId !== null;

  function createEmptyTable(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ text: '', bold: false }))
    );
  }

  // Normalize old string cells to object format
  function normalizeCell(cell) {
    if (typeof cell === 'string') return { text: cell, bold: false };
    return cell;
  }

  const resetForm = () => {
    setType('title');
    setContent('');
    setAlign('center');
    setFileData(null);
    setFileName('');
    setImageWidth(50);
    setTableRows(2);
    setTableCols(2);
    setTableData(createEmptyTable(2, 2));
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setAlign(getDefaultAlign(newType));
    setFileData(null);
    setFileName('');
    setContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (newType === 'table') {
      setTableRows(2);
      setTableCols(2);
      setTableData(createEmptyTable(2, 2));
    }
  };

  // Load a section's data into the form for editing
  const handleEditSection = (section) => {
    setEditingId(section.id);
    setType(section.type);
    setAlign(section.align || getDefaultAlign(section.type));
    setContent(section.content || '');

    if (section.type === 'image' || section.type === 'pdf-page') {
      setFileData(section.fileData || null);
      setFileName(section.content || '');
      setImageWidth(section.imageWidth || 50);
    } else if (section.type === 'table' && section.tableData) {
      const data = section.tableData.map((r) => r.map(normalizeCell));
      setTableRows(data.length);
      setTableCols(data[0]?.length || 2);
      setTableData(data);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleTableDimensionChange = (newRows, newCols) => {
    const r = Math.max(1, Math.min(20, newRows));
    const c = Math.max(1, Math.min(10, newCols));
    setTableRows(r);
    setTableCols(c);
    const newData = createEmptyTable(r, c);
    for (let i = 0; i < Math.min(r, tableData.length); i++) {
      for (let j = 0; j < Math.min(c, (tableData[i] || []).length); j++) {
        newData[i][j] = normalizeCell(tableData[i][j]);
      }
    }
    setTableData(newData);
  };

  const handleTableCellChange = (row, col, value) => {
    setTableData((prev) => {
      const copy = prev.map((r) => r.map(normalizeCell));
      copy[row][col] = { ...copy[row][col], text: value };
      return copy;
    });
  };

  const handleTableCellBoldToggle = (row, col) => {
    setTableData((prev) => {
      const copy = prev.map((r) => r.map(normalizeCell));
      copy[row][col] = { ...copy[row][col], bold: !copy[row][col].bold };
      return copy;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 100MB limit.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (isFileType) {
      if (!fileData) {
        alert('Please select a file first.');
        return;
      }
      const data = { type, content: fileName, fileData, align, imageWidth: type === 'image' ? imageWidth : undefined };
      if (isEditing) {
        onUpdateSection(editingId, data);
        resetForm();
      } else {
        onAddSection({ id: Date.now(), ...data });
        setFileData(null);
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } else if (isTable) {
      const hasContent = tableData.some((row) =>
        row.some((cell) => normalizeCell(cell).text.trim() !== '')
      );
      if (!hasContent) {
        alert('Please fill in at least one table cell.');
        return;
      }
      const data = {
        type: 'table',
        content: `Table ${tableRows}x${tableCols}`,
        tableData: tableData.map((r) => [...r]),
        align,
      };
      if (isEditing) {
        onUpdateSection(editingId, data);
        resetForm();
      } else {
        onAddSection({ id: Date.now(), ...data });
        setTableData(createEmptyTable(tableRows, tableCols));
      }
    } else {
      const trimmed = content.trim();
      if (!trimmed) return;
      const data = { type, content: trimmed, align };
      if (isEditing) {
        onUpdateSection(editingId, data);
        resetForm();
      } else {
        onAddSection({ id: Date.now(), ...data });
        setContent('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
  };

  const [saving, setSaving] = useState(false);

  const handlePrint = async () => {
    if (onSavePdf) {
      setSaving(true);
      try {
        await onSavePdf();
      } finally {
        setSaving(false);
      }
    }
  };

  const showAlignOptions =
    type !== 'bullet' &&
    type !== 'numbered' &&
    type !== 'pdf-page' &&
    type !== 'table';

  return (
    <aside className="no-print w-[350px] min-w-[350px] h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <h1 className="text-base font-bold text-gray-800">Doc Generator</h1>
        <p className="text-xs text-gray-500">College Documentation Maker</p>
      </div>

      {/* Project Name */}
      <div className="px-3 py-2.5 border-b border-gray-200 bg-white">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="e.g. Guest House Mgmt System"
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-amber-600 mt-1">
          * Please use small names or alias
        </p>
      </div>

      {/* Active page indicator */}
      <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
        <p className="text-xs font-semibold text-blue-700">
          Editing Page {activePageIndex + 1} of {totalPages}
        </p>
      </div>

      {/* Add / Edit Section Form */}
      <div
        className={`p-3 border-b space-y-2.5 overflow-y-auto max-h-[40vh] ${
          isEditing
            ? 'border-amber-200 bg-amber-50'
            : 'border-gray-200'
        }`}
      >
        {/* Edit mode banner */}
        {isEditing && (
          <div className="flex items-center justify-between bg-amber-100 rounded-lg px-3 py-1.5">
            <span className="text-xs font-semibold text-amber-800">
              Editing section
            </span>
            <button
              onClick={handleCancelEdit}
              className="text-xs text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Section Type
          </label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={isEditing && isFileType}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {SECTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {showAlignOptions && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <div className="flex gap-1">
              {ALIGN_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAlign(opt.value)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      align === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                    title={opt.label}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isFileType ? (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {type === 'image' ? 'Upload Image' : 'Upload PDF Page'}
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {fileData ? (
                <div className="space-y-1.5">
                  {type === 'image' && (
                    <img
                      src={fileData}
                      alt="Preview"
                      className="max-h-20 mx-auto rounded"
                    />
                  )}
                  <p className="text-xs text-gray-600 truncate">{fileName}</p>
                  <p className="text-xs text-green-600 font-medium">
                    {isEditing ? 'Click to replace' : 'Ready to add'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {type === 'image' ? (
                    <Image size={20} className="mx-auto text-gray-400" />
                  ) : (
                    <FileUp size={20} className="mx-auto text-gray-400" />
                  )}
                  <p className="text-xs text-gray-500">
                    Click to browse (max 100MB)
                  </p>
                  <p className="text-xs text-gray-400">
                    {type === 'image'
                      ? 'PNG, JPG, JPEG, GIF, BMP, WebP, SVG'
                      : 'PDF files only'}
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={type === 'image' ? IMAGE_ACCEPT : PDF_ACCEPT}
              onChange={handleFileChange}
              className="hidden"
            />
            {type === 'image' && (
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Image Size: {imageWidth}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={imageWidth}
                  onChange={(e) => setImageWidth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>
        ) : isTable ? (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Table Dimensions
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Rows</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) =>
                    handleTableDimensionChange(
                      parseInt(e.target.value) || 1,
                      tableCols
                    )
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
              <X size={12} className="text-gray-400 mt-4" />
              <div className="flex-1">
                <label className="text-xs text-gray-500">Columns</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) =>
                    handleTableDimensionChange(
                      tableRows,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              First row is treated as header (bold)
            </p>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-xs">
                <tbody>
                  {tableData.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((rawCell, ci) => {
                        const cell = normalizeCell(rawCell);
                        return (
                          <td key={ci} className="p-0">
                            <div className="flex items-center border-b border-r border-gray-200">
                              <input
                                type="text"
                                value={cell.text}
                                onChange={(e) =>
                                  handleTableCellChange(ri, ci, e.target.value)
                                }
                                placeholder={ri === 0 ? `Header ${ci + 1}` : ''}
                                className={`flex-1 min-w-0 px-2 py-1 text-xs focus:outline-none focus:bg-blue-50 ${
                                  cell.bold || ri === 0 ? 'font-bold' : ''
                                } ${ri === 0 ? 'bg-gray-50' : ''}`}
                              />
                              <button
                                type="button"
                                onClick={() => handleTableCellBoldToggle(ri, ci)}
                                className={`px-1.5 py-1 text-xs font-black border-l border-gray-200 shrink-0 cursor-pointer transition-colors ${
                                  cell.bold
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                                title="Toggle bold"
                              >
                                B
                              </button>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder={
                type === 'bullet' || type === 'numbered'
                  ? 'Enter each point on a new line...'
                  : 'Enter your content...'
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-0.5">Ctrl + Enter to {isEditing ? 'save' : 'add'}</p>
          </div>
        )}

        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <Check size={16} />
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center justify-center gap-1 bg-white border border-gray-300 text-gray-600 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {isTable ? <Table size={16} /> : <Plus size={16} />}
            Add to Page {activePageIndex + 1}
          </button>
        )}
      </div>

      {/* Section List for active page */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Page {activePageIndex + 1} Sections ({sections.length})
        </p>
        {sections.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            This page is empty. Add sections above.
          </p>
        )}
        {sections.map((section, index) => {
          const isBeingEdited = editingId === section.id;
          return (
            <div
              key={section.id}
              className={`border rounded-lg p-2.5 flex items-start gap-2 transition-colors ${
                isBeingEdited
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-blue-600 uppercase">
                  {getSectionLabel(section.type)}
                </span>
                {section.align && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({section.align})
                  </span>
                )}
                <p className="text-xs text-gray-700 truncate mt-0.5">
                  {section.content.split('\n')[0]}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleEditSection(section)}
                  className={`p-0.5 rounded cursor-pointer ${
                    isBeingEdited
                      ? 'bg-amber-200 text-amber-700'
                      : 'hover:bg-blue-50 text-blue-500'
                  }`}
                  title="Edit"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => onMoveSection(index, -1)}
                  disabled={index === 0}
                  className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  onClick={() => onMoveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ChevronDown size={12} />
                </button>
                <button
                  onClick={() =>
                    setModal({
                      open: true,
                      type: 'delete-section',
                      data: section,
                    })
                  }
                  className="p-0.5 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-1.5">
        <button
          onClick={handlePrint}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Printer size={16} />
          {saving ? 'Generating PDF...' : 'Save PDF'}
        </button>
        <button
          onClick={() =>
            setModal({ open: true, type: 'clear-all', data: null })
          }
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-600 rounded-lg px-4 py-1.5 text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer"
        >
          <FileX size={14} />
          Clear All
        </button>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        open={modal.open && modal.type === 'delete-section'}
        title="Delete Section?"
        message="This section will be permanently removed from the page. This action cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={() => {
          if (editingId === modal.data?.id) resetForm();
          onDeleteSection(modal.data?.id);
          setModal({ open: false, type: null, data: null });
        }}
        onCancel={() => setModal({ open: false, type: null, data: null })}
      />

      <ConfirmModal
        open={modal.open && modal.type === 'clear-all'}
        title="Clear Everything?"
        message="All pages and all sections will be permanently deleted. This action cannot be undone."
        confirmText="Yes, Clear All"
        danger
        onConfirm={() => {
          onClearAll();
          setModal({ open: false, type: null, data: null });
        }}
        onCancel={() => setModal({ open: false, type: null, data: null })}
      />
    </aside>
  );
}

import { useState } from "react";
import {
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Copy,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";

const COLLEGE_LOGO = "/CollegeLogo.png";

function MiniSection({ section }) {
    switch (section.type) {
        case "title":
            return (
                <div
                    style={{
                        fontSize: "4px",
                        fontWeight: "bold",
                        textAlign: section.align || "center",
                        margin: "2px 0 1px",
                        fontFamily: "Arial, sans-serif",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {section.content}
                </div>
            );
        case "subtitle":
            return (
                <div
                    style={{
                        fontSize: "3px",
                        fontWeight: "bold",
                        textAlign: section.align || "left",
                        margin: "1.5px 0 1px",
                        fontFamily: "Arial, sans-serif",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {section.content}
                </div>
            );
        case "paragraph":
            return (
                <div
                    style={{
                        fontSize: "2.5px",
                        textAlign: section.align || "justify",
                        margin: "1px 0",
                        fontFamily: "Arial, sans-serif",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {section.content}
                </div>
            );
        case "bullet":
        case "numbered":
            return (
                <div
                    style={{
                        fontSize: "2.5px",
                        margin: "1px 0",
                        paddingLeft: "4px",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    {section.content
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((item, i) => (
                            <div key={i} style={{ lineHeight: 1.3 }}>
                                {section.type === "bullet" ? "• " : `${i + 1}. `}
                                {item}
                            </div>
                        ))}
                </div>
            );
        case "table":
            return (
                <div
                    style={{
                        margin: "1px 0",
                        fontSize: "2px",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <div
                        style={{
                            border: "0.3px solid #666",
                            display: "inline-block",
                            width: "100%",
                        }}
                    >
                        {(section.tableData || []).slice(0, 3).map((row, ri) => (
                            <div
                                key={ri}
                                style={{
                                    display: "flex",
                                    borderBottom:
                                        ri < 2 ? "0.3px solid #666" : "none",
                                }}
                            >
                                {row.slice(0, 4).map((rawCell, ci) => {
                                    const cell = typeof rawCell === "string" ? { text: rawCell, bold: false } : rawCell;
                                    return (
                                        <div
                                            key={ci}
                                            style={{
                                                flex: 1,
                                                padding: "0.5px 1px",
                                                borderRight:
                                                    ci < row.length - 1
                                                        ? "0.3px solid #666"
                                                        : "none",
                                                fontWeight:
                                                    ri === 0 || cell.bold ? "bold" : "normal",
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {cell.text || "\u00A0"}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            );
        case "image":
            return (
                <div
                    style={{
                        textAlign: section.align || "center",
                        margin: "1px 0",
                    }}
                >
                    <div
                        style={{
                            width: `${section.imageWidth || 50}%`,
                            height: "12px",
                            background: "#e5e7eb",
                            display: "inline-block",
                            borderRadius: "1px",
                            fontSize: "2px",
                            lineHeight: "12px",
                            color: "#9ca3af",
                            textAlign: "center",
                        }}
                    >
                        IMG
                    </div>
                </div>
            );
        case "pdf-page":
            return (
                <div
                    style={{
                        margin: "1px 0",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "80%",
                            height: "20px",
                            background: "#f3f4f6",
                            border: "0.3px solid #d1d5db",
                            display: "inline-block",
                            borderRadius: "1px",
                            fontSize: "2px",
                            lineHeight: "20px",
                            color: "#9ca3af",
                            textAlign: "center",
                        }}
                    >
                        PDF
                    </div>
                </div>
            );
        case "imported-pdf":
            return (
                <div
                    style={{
                        margin: "0",
                        textAlign: "center",
                        overflow: "hidden",
                    }}
                >
                    <img
                        src={section.imageData}
                        alt=""
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                        }}
                    />
                </div>
            );
        default:
            return null;
    }
}

function PageThumbnail({ page, pageIndex, projectName }) {
    return (
        <div
            style={{
                width: "100%",
                aspectRatio: "210 / 297",
                background: "white",
                padding: "4px 3px 3px 3px",
                boxSizing: "border-box",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Mini header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "1.5px",
                    borderBottom: "0.5px solid #000",
                    marginBottom: "2px",
                    minHeight: "8px",
                }}
            >
                <img
                    src={COLLEGE_LOGO}
                    alt=""
                    style={{ height: "7px", objectFit: "contain" }}
                />
                <span
                    style={{
                        fontSize: "2.5px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#000",
                    }}
                >
                    {projectName || "Project Name"}
                </span>
            </div>

            {/* Mini content */}
            <div style={{ flex: 1, overflow: "hidden" }}>
                {page.sections.length === 0 ? (
                    <div
                        style={{
                            fontSize: "2.5px",
                            color: "#bbb",
                            textAlign: "center",
                            marginTop: "15px",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        Empty page
                    </div>
                ) : (
                    page.sections.map((s) => (
                        <MiniSection key={s.id} section={s} />
                    ))
                )}
            </div>

            {/* Mini footer */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: "2.5px",
                    color: "#000",
                    marginTop: "auto",
                    paddingTop: "1px",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                {pageIndex + 1}
            </div>
        </div>
    );
}

export default function PageNavigator({
    pages,
    activePageId,
    onSelectPage,
    onAddPage,
    onDeletePage,
    onMovePage,
    onDuplicatePage,
    projectName,
}) {
    const [deletePageId, setDeletePageId] = useState(null);

    return (
        <div className="no-print w-[160px] min-w-[160px] h-screen bg-gray-800 flex flex-col border-r border-gray-700">
            {/* Header */}
            <div className="p-3 border-b border-gray-700">
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    Pages ({pages.length})
                </p>
            </div>

            {/* Thumbnails */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
                {pages.map((page, index) => {
                    const isActive = page.id === activePageId;
                    return (
                        <div key={page.id} className="group relative">
                            {/* Page number label */}
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-400">
                                    {index + 1}
                                </span>
                                {/* Action buttons on hover */}
                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMovePage(page.id, -1);
                                        }}
                                        disabled={index === 0}
                                        className="p-0.5 rounded text-gray-400 hover:text-white hover:bg-gray-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                        title="Move up"
                                    >
                                        <ChevronUp size={10} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMovePage(page.id, 1);
                                        }}
                                        disabled={index === pages.length - 1}
                                        className="p-0.5 rounded text-gray-400 hover:text-white hover:bg-gray-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                        title="Move down"
                                    >
                                        <ChevronDown size={10} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDuplicatePage(page.id);
                                        }}
                                        className="p-0.5 rounded text-gray-400 hover:text-white hover:bg-gray-600 cursor-pointer"
                                        title="Duplicate page"
                                    >
                                        <Copy size={10} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletePageId(page.id);
                                        }}
                                        disabled={pages.length <= 1}
                                        className="p-0.5 rounded text-red-400 hover:text-red-300 hover:bg-gray-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                        title="Delete page"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail card */}
                            <div
                                onClick={() => onSelectPage(page.id)}
                                className={`rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                                    isActive
                                        ? "border-blue-500 shadow-lg shadow-blue-500/20"
                                        : "border-transparent hover:border-gray-500"
                                }`}
                            >
                                <PageThumbnail
                                    page={page}
                                    pageIndex={index}
                                    projectName={projectName}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Page button */}
            <div className="p-2 border-t border-gray-700">
                <button
                    onClick={onAddPage}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-gray-300 border border-dashed border-gray-600 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                >
                    <Plus size={14} />
                    Add Page
                </button>
            </div>

            <ConfirmModal
                open={deletePageId !== null}
                title="Delete Page?"
                message="This entire page and all its sections will be permanently removed. This action cannot be undone."
                confirmText="Delete Page"
                danger
                onConfirm={() => {
                    onDeletePage(deletePageId);
                    setDeletePageId(null);
                }}
                onCancel={() => setDeletePageId(null)}
            />
        </div>
    );
}

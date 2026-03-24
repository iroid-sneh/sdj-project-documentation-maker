import { useEffect, useRef, useCallback, forwardRef } from "react";

const COLLEGE_LOGO = "/CollegeLogo.png";

function RenderSection({ section }) {
    const align = section.align || "justify";

    switch (section.type) {
        case "title":
            return (
                <h1
                    style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16pt",
                        fontWeight: "bold",
                        textAlign: align,
                        margin: "24px 0 12px",
                        color: "#000",
                    }}
                >
                    {section.content}
                </h1>
            );

        case "subtitle":
            return (
                <h2
                    style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "12pt",
                        fontWeight: "bold",
                        textAlign: align,
                        margin: "16px 0 8px",
                        color: "#000",
                    }}
                >
                    {section.content}
                </h2>
            );

        case "paragraph":
            return (
                <p
                    style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11pt",
                        lineHeight: 1.6,
                        textAlign: align,
                        margin: "8px 0",
                        color: "#000",
                    }}
                >
                    {section.content}
                </p>
            );

        case "bullet":
            return (
                <ul
                    style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11pt",
                        lineHeight: 1.6,
                        textAlign: "justify",
                        margin: "8px 0",
                        paddingLeft: "28px",
                        listStyleType: "disc",
                        color: "#000",
                    }}
                >
                    {section.content
                        .split("\n")
                        .filter(Boolean)
                        .map((item, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>
                                {item}
                            </li>
                        ))}
                </ul>
            );

        case "numbered":
            return (
                <ol
                    style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11pt",
                        lineHeight: 1.6,
                        textAlign: "justify",
                        margin: "8px 0",
                        paddingLeft: "28px",
                        listStyleType: "decimal",
                        color: "#000",
                    }}
                >
                    {section.content
                        .split("\n")
                        .filter(Boolean)
                        .map((item, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>
                                {item}
                            </li>
                        ))}
                </ol>
            );

        case "table":
            if (!section.tableData) return null;
            return (
                <div
                    style={{
                        margin: "12px 0",
                        overflowX: "auto",
                        breakInside: "avoid",
                        pageBreakInside: "avoid",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontFamily: "Arial, sans-serif",
                            fontSize: "11pt",
                            color: "#000",
                        }}
                    >
                        <tbody>
                            {section.tableData.map((row, ri) => (
                                <tr key={ri}>
                                    {row.map((rawCell, ci) => {
                                        const isHeader = ri === 0;
                                        const Tag = isHeader ? "th" : "td";
                                        const cell =
                                            typeof rawCell === "string"
                                                ? { text: rawCell, bold: false }
                                                : rawCell;
                                        const isBold = isHeader || cell.bold;
                                        return (
                                            <Tag
                                                key={ci}
                                                style={{
                                                    border: "1px solid #000",
                                                    padding: "6px 10px",
                                                    fontWeight: isBold
                                                        ? "bold"
                                                        : "normal",
                                                    textAlign: "left",
                                                    verticalAlign: "top",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {cell.text}
                                            </Tag>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case "image": {
            const imgWidth = section.imageWidth || 50;
            return (
                <div
                    style={{
                        textAlign: align,
                        margin: "12px 0",
                        breakInside: "avoid",
                        pageBreakInside: "avoid",
                    }}
                >
                    <img
                        src={section.fileData}
                        alt={section.content}
                        style={{
                            width: `${imgWidth}%`,
                            maxWidth: "100%",
                            height: "auto",
                            display: "inline-block",
                        }}
                    />
                </div>
            );
        }

        case "pdf-page":
            return (
                <div
                    style={{
                        margin: "12px 0",
                        textAlign: "center",
                    }}
                >
                    <iframe
                        src={section.fileData}
                        title={section.content}
                        style={{
                            width: "100%",
                            height: "800px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>
            );

        default:
            return null;
    }
}

function PageHeader({ projectName }) {
    return (
        <div
            className="page-header"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "6px",
                borderBottom: "1.5px solid #000",
                marginBottom: "20px",
                flexShrink: 0,
            }}
        >
            <img
                src={COLLEGE_LOGO}
                alt="SDJ International College"
                style={{
                    height: "50px",
                    objectFit: "contain",
                }}
            />
            <p
                style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "11pt",
                    fontWeight: "bold",
                    margin: 0,
                    color: "#000",
                    textAlign: "right",
                }}
            >
                {projectName || "Project Name"}
            </p>
        </div>
    );
}

function PageFooter({ pageNumber }) {
    return (
        <div
            className="page-footer"
            style={{
                textAlign: "center",
                paddingTop: "10px",
                fontFamily: "Arial, sans-serif",
                fontSize: "10pt",
                color: "#000",
                flexShrink: 0,
            }}
        >
            {pageNumber}
        </div>
    );
}

const DocumentPreview = forwardRef(function DocumentPreview({
    pages,
    activePageId,
    onSelectPage,
    onOverflow,
    projectName,
}, ref) {
    const containerRef = useRef(null);
    const pageRefs = useRef({});
    const contentRefs = useRef({});
    const bodyRefs = useRef({});
    const reflowTimer = useRef(null);

    // Scroll to active page when it changes
    useEffect(() => {
        const el = pageRefs.current[activePageId];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [activePageId]);

    // Overflow detection: after render, check if any page's content overflows
    const checkOverflow = useCallback(() => {
        if (!onOverflow) return;

        for (const page of pages) {
            if (page.sections.length <= 1) continue;
            const bodyEl = bodyRefs.current[page.id];
            const contentEl = contentRefs.current[page.id];
            if (!bodyEl || !contentEl) continue;

            const bodyHeight = bodyEl.clientHeight;
            const contentHeight = contentEl.scrollHeight;

            if (contentHeight > bodyHeight + 2) {
                // This page overflows — move last section to next page
                onOverflow(page.id);
                return; // handle one at a time to avoid batching issues
            }
        }
    }, [pages, onOverflow]);

    useEffect(() => {
        // Debounce reflow checks to avoid rapid loops
        clearTimeout(reflowTimer.current);
        reflowTimer.current = setTimeout(checkOverflow, 80);
        return () => clearTimeout(reflowTimer.current);
    }, [checkOverflow]);

    // Also check after images load
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onLoad = () => {
            clearTimeout(reflowTimer.current);
            reflowTimer.current = setTimeout(checkOverflow, 100);
        };

        container.addEventListener("load", onLoad, true);
        return () => container.removeEventListener("load", onLoad, true);
    }, [checkOverflow]);

    return (
        <div
            ref={(el) => {
                containerRef.current = el;
                if (typeof ref === "function") ref(el);
                else if (ref) ref.current = el;
            }}
            className="flex-1 bg-gray-100 overflow-y-auto p-8 flex flex-col items-center gap-10"
        >
            {pages.map((page, pageIndex) => {
                const isActive = page.id === activePageId;
                return (
                    <div
                        key={page.id}
                        ref={(el) => (pageRefs.current[page.id] = el)}
                        onClick={() => onSelectPage(page.id)}
                        className="relative cursor-pointer"
                        style={{ flexShrink: 0 }}
                    >
                        {/* Page badge — outside the overflow-hidden page */}
                        <div
                            className={`no-print absolute -top-3 left-4 z-10 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-300 text-gray-600"
                            }`}
                        >
                            Page {pageIndex + 1}
                        </div>

                        {/* A4 page */}
                        <div
                            className={`print-area bg-white shadow-lg transition-all ${
                                isActive
                                    ? "ring-3 ring-blue-500 shadow-blue-200"
                                    : "border border-gray-200 hover:shadow-xl"
                            }`}
                            style={{
                                width: "210mm",
                                height: "297mm",
                                padding: "20mm 18mm 15mm 18mm",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                            }}
                        >
                            {/* Header */}
                            <PageHeader projectName={projectName} />

                            {/* Body — fixed available area, overflow hidden */}
                            <div
                                ref={(el) =>
                                    (bodyRefs.current[page.id] = el)
                                }
                                style={{
                                    flex: 1,
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                <div
                                    ref={(el) =>
                                        (contentRefs.current[page.id] = el)
                                    }
                                >
                                    {page.sections.length === 0 ? (
                                        <p
                                            style={{
                                                fontFamily:
                                                    "Arial, sans-serif",
                                                fontSize: "11pt",
                                                color: "#bbb",
                                                textAlign: "center",
                                                marginTop: "80px",
                                            }}
                                        >
                                            {isActive
                                                ? "Start adding sections from the sidebar"
                                                : "Empty page — click to select"}
                                        </p>
                                    ) : (
                                        page.sections.map((section) => (
                                            <RenderSection
                                                key={section.id}
                                                section={section}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <PageFooter pageNumber={pageIndex + 1} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default DocumentPreview;

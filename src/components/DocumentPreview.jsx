import { useEffect, useRef, useCallback, forwardRef } from "react";
import COLLEGE_LOGO from "../assets/CollegeLogo.png";

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
                    {section.content.split("\n").map((line, i, arr) => (
                        <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                        </span>
                    ))}
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

        case "table": {
            if (!section.tableData) return null;
            const isCompact = section.compact;
            return (
                <div
                    style={{
                        margin: isCompact ? "8px 0" : "12px 0",
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
                            fontSize: isCompact ? "9pt" : "11pt",
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
                                                    padding: isCompact
                                                        ? "3px 6px"
                                                        : "6px 10px",
                                                    fontWeight: isBold
                                                        ? "bold"
                                                        : "normal",
                                                    textAlign: "left",
                                                    verticalAlign: "top",
                                                    lineHeight: isCompact
                                                        ? 1.3
                                                        : 1.5,
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
        }

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

        case "template-cover": {
            const s = section;
            const students = s.students || [];
            const F = "Arial, sans-serif";
            return (
                <div style={{ fontFamily: F, color: "#000", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                    <p style={{ fontSize: "14pt", margin: "40px 0 10px" }}>A report submitted to</p>
                    <img src={COLLEGE_LOGO} alt="SDJ International College" style={{ height: "90px", objectFit: "contain", margin: "6px 0 10px" }} />
                    <p style={{ fontSize: "12pt", margin: "6px 0 0" }}>Affiliated To: Veer Narmad South Gujarat University, Surat</p>
                    <p style={{ fontSize: "12pt", margin: "4px 0 0" }}>For, Partial requirement for the fulfillment of the degree of</p>
                    <h1 style={{ fontSize: "22pt", fontWeight: "bold", fontStyle: "italic", margin: "30px 0 0" }}>Bachelor of Computer Applications (BCA)</h1>
                    <div style={{ margin: "36px 0 0" }}>
                        <p style={{ fontSize: "14pt", margin: 0 }}>BCA Sem VI</p>
                        <p style={{ fontSize: "14pt", margin: "2px 0 0" }}>A.Y. 2025-26</p>
                    </div>
                    <p style={{ fontSize: "14pt", margin: "30px 0 0" }}>
                        Project Report On <strong>{s.projectTitle || <span style={{ color: "#999" }}>&lt;TYPE PROJECT TITLE HERE&gt;</span>}</strong>
                    </p>
                    <p style={{ fontSize: "14pt", margin: "30px 0 10px" }}>by</p>
                    <table style={{ borderCollapse: "collapse", width: "80%", fontSize: "12pt" }}>
                        <thead>
                            <tr>
                                {["Roll No.", "Seat No.", "Name Of Student"].map((h) => (
                                    <th key={h} style={{ border: "1px solid #000", padding: "7px 12px", fontWeight: "bold" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((stu, i) => (
                                <tr key={i}>
                                    <td style={{ border: "1px solid #000", padding: "7px 12px", width: "20%" }}>{stu.rollNo || "\u00A0"}</td>
                                    <td style={{ border: "1px solid #000", padding: "7px 12px", width: "20%" }}>{stu.seatNo || "\u00A0"}</td>
                                    <td style={{ border: "1px solid #000", padding: "7px 12px" }}>{stu.name || "\u00A0"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ textAlign: "left", width: "80%", marginTop: "auto", paddingBottom: "20px" }}>
                        <p style={{ fontSize: "12pt", fontWeight: "bold", margin: "0 0 2px" }}>Project Guide by:</p>
                        <p style={{ fontSize: "12pt", margin: 0 }}>{s.guideName || <span style={{ color: "#999" }}>&lt;Project guide Name&gt;</span>}</p>
                    </div>
                </div>
            );
        }

        case "template-acknowledgement": {
            const s = section;
            const studentLines = s.students || [];
            const F = "Arial, sans-serif";
            const P = { fontFamily: F, fontSize: "12pt", lineHeight: 1.8, textAlign: "justify", color: "#000", margin: "0 0 20px" };
            return (
                <div style={{ fontFamily: F, color: "#000", height: "100%", display: "flex", flexDirection: "column" }}>
                    <h1 style={{ fontFamily: F, fontSize: "18pt", fontWeight: "bold", textAlign: "center", margin: "30px 0 24px", textDecoration: "underline", textUnderlineOffset: "4px" }}>Acknowledgement</h1>
                    <p style={P}>
                        The success and final outcome of this project required a lot of guidance and assistance from many people and we are extremely fortunate to have got this all along the completion of our project work. Whatever we have done is only due to such guidance and assistance.
                    </p>
                    <p style={P}>
                        We would not forget to thank Principal Dr. Aditi Bhatt, IQAC coordinator and trust representative Dr. Vaibhav Desai, In-charge of PG Courses Dr. Vimal Vaiwala , In-charge of UG-BCA and Head of the BCA Department Prof. Nainesh Gathiyawala and Project guide {s.guideName ? <strong>{s.guideName}</strong> : "_________________ "} and all other Assistant professors of SDJ International College, Vesu, who took keen interest on our project work and guided us all along, till the completion of our project work by providing all the necessary information for developing a good system.
                    </p>
                    <p style={P}>
                        We are extremely grateful to her/him for providing such a nice support and guidance though she/he had busy schedule managing the college dealings.
                        {" "}We are thankful and fortunate enough to get support and guidance from all Teaching staffs of IT Department which helped us in successfully completing our project work. Also, we would like to extend our sincere regards to all the non-teaching staff of IT Department for their timely support.
                    </p>
                    <div style={{ textAlign: "right", marginTop: "auto", paddingBottom: "40px" }}>
                        {studentLines.map((line, i) => (
                            <p key={i} style={{ fontFamily: F, fontSize: "12pt", fontWeight: "bold", margin: "2px 0", color: "#000" }}>{line}</p>
                        ))}
                    </div>
                </div>
            );
        }

        case "imported-pdf":
            return (
                <div
                    style={{
                        margin: "0",
                        textAlign: "center",
                    }}
                >
                    <img
                        src={section.imageData}
                        alt={section.content}
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

    // Clean up refs when pages are removed
    useEffect(() => {
        const pageIds = new Set(pages.map((p) => p.id));
        for (const id of Object.keys(pageRefs.current)) {
            if (!pageIds.has(Number(id)) && !pageIds.has(id)) {
                delete pageRefs.current[id];
                delete contentRefs.current[id];
                delete bodyRefs.current[id];
            }
        }
    }, [pages]);

    // Overflow detection with 5px tolerance to prevent flicker
    const checkOverflow = useCallback(() => {
        if (!onOverflow) return;

        for (const page of pages) {
            if (page.sections.length <= 1) continue;
            // Skip template pages (noHeaderFooter) — they manage their own layout
            if (page.noHeaderFooter) continue;

            const bodyEl = bodyRefs.current[page.id];
            const contentEl = contentRefs.current[page.id];
            if (!bodyEl || !contentEl) continue;

            const bodyHeight = bodyEl.clientHeight;
            const contentHeight = contentEl.scrollHeight;

            if (contentHeight > bodyHeight + 5) {
                onOverflow(page.id);
                return;
            }
        }
    }, [pages, onOverflow]);

    useEffect(() => {
        clearTimeout(reflowTimer.current);
        reflowTimer.current = setTimeout(checkOverflow, 150);
        return () => clearTimeout(reflowTimer.current);
    }, [checkOverflow]);

    // Check after images load (debounced)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onLoad = () => {
            clearTimeout(reflowTimer.current);
            reflowTimer.current = setTimeout(checkOverflow, 200);
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
                // No header/footer for: template pages, imported PDFs, cover pages
                const isFullPage =
                    page.noHeaderFooter ||
                    (page.sections.length === 1 &&
                        (page.sections[0].type === "imported-pdf" ||
                            page.sections[0].type === "template-cover"));

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
                            {isFullPage && (
                                <span className="ml-1 opacity-70">
                                    (imported)
                                </span>
                            )}
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
                                padding:
                                    isFullPage &&
                                    page.sections.length === 1 &&
                                    page.sections[0].type === "imported-pdf"
                                        ? "0"
                                        : "20mm 18mm 15mm 18mm",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                            }}
                        >
                            {isFullPage ? (
                                /* Full-page: no header/footer */
                                page.sections.length === 1 &&
                                page.sections[0].type === "imported-pdf" ? (
                                    /* Imported PDF — edge to edge */
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            src={page.sections[0].imageData}
                                            alt={page.sections[0].content}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                display: "block",
                                            }}
                                        />
                                    </div>
                                ) : (
                                    /* Template page (cover/ack/index) — with padding, all sections */
                                    <div
                                        ref={(el) =>
                                            (bodyRefs.current[page.id] = el)
                                        }
                                        style={{
                                            flex: 1,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            ref={(el) =>
                                                (contentRefs.current[page.id] = el)
                                            }
                                            style={{ height: "100%" }}
                                        >
                                            {page.sections.map((section) => (
                                                <RenderSection
                                                    key={section.id}
                                                    section={section}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <>
                                    {/* Header */}
                                    <PageHeader
                                        projectName={projectName}
                                    />

                                    {/* Body */}
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
                                                (contentRefs.current[
                                                    page.id
                                                ] = el)
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
                                                page.sections.map(
                                                    (section) => (
                                                        <RenderSection
                                                            key={section.id}
                                                            section={section}
                                                        />
                                                    )
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <PageFooter
                                        pageNumber={pageIndex + 1}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default DocumentPreview;

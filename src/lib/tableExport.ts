import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

export type TableExportData = {
  headers: string[];
  rows: string[][];
};

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(cell: string): string {
  return /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

export function exportTableToCsv(
  { headers, rows }: TableExportData,
  filename = "table.csv",
): void {
  const lines = [headers, ...rows].map((row) =>
    row.map(escapeCsvCell).join(","),
  );
  downloadBlob(
    new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" }),
    filename,
  );
}

export function exportTableToHtml(
  { headers, rows }: TableExportData,
  filename = "table.html",
): void {
  const escape = (value: string) =>
    value.replace(
      /[&<>]/g,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char] ?? char,
    );
  const thead = `<tr>${headers.map((header) => `<th>${escape(header)}</th>`).join("")}</tr>`;
  const tbody = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join("")}</tr>`,
    )
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:8px;text-align:left}</style></head><body><table><thead>${thead}</thead><tbody>${tbody}</tbody></table></body></html>`;
  downloadBlob(new Blob([html], { type: "text/html;charset=utf-8;" }), filename);
}

export function exportTableToPdf(
  { headers, rows }: TableExportData,
  filename = "table.pdf",
): void {
  const doc = new jsPDF();
  autoTable(doc, { head: [headers], body: rows });
  doc.save(filename);
}

export async function exportElementToPng(
  element: HTMLElement,
  filename = "table.png",
): Promise<void> {
  const dataUrl = await toPng(element, { backgroundColor: "#ffffff" });
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

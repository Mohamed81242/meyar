/**
 * File utility functions for downloading and handling files
 */

import { AttachmentFile } from "@/shared/types";
import * as XLSX from "xlsx";

/**
 * Downloads a single file from a URL
 * Uses fetch to get the blob and creates a temporary anchor element
 */
export async function downloadFile(file: AttachmentFile): Promise<void> {
    try {
        const response = await fetch(file.fileUrl || file.url);
        if (!response.ok) {
            throw new Error(`Failed to download: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = file.fileName || file.name;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(`Error downloading file ${file.fileName}:`, error);
        throw error;
    }
}

/**
 * Downloads multiple files sequentially with a small delay between each
 * to prevent browser blocking
 */
export async function downloadFiles(
    files: AttachmentFile[],
    delayMs: number = 300
): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const file of files) {
        try {
            await downloadFile(file);
            success++;
            // Add delay between downloads to prevent browser blocking
            if (files.indexOf(file) < files.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        } catch {
            failed++;
        }
    }

    return { success, failed };
}

/**
 * Formats file size to human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() || "";
}

/**
 * Gets icon type based on file type/extension
 */
export function getFileIconType(
    fileType: string
): "pdf" | "image" | "document" | "other" {
    if (fileType.includes("pdf")) return "pdf";
    if (fileType.includes("image")) return "image";
    if (
        fileType.includes("word") ||
        fileType.includes("document") ||
        fileType.includes("text")
    )
        return "document";
    return "other";
}

/**
 * Export generic array data to a CSV file
 */
export function exportToCSV<T>(
    data: T[],
    columns: { header: string; accessor: keyof T | ((row: T) => any) }[],
    filename: string = "export.csv"
): void {
    if (!data || data.length === 0) {
        throw new Error("No data to export");
    }

    const headers = columns.map(col => col.header).join(",");
    
    const csvContent = [
        headers,
        ...data.map(row => 
            columns.map(col => {
                let value = typeof col.accessor === "function" 
                    ? col.accessor(row) 
                    : row[col.accessor];
                
                // Handle null/undefined
                if (value === null || value === undefined) {
                    value = "";
                }
                
                // Escape quotes and wrap in quotes to handle commas/newlines in data
                const stringValue = String(value).replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(",")
        )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export generic array data to an Excel (.xlsx) file
 */
export function exportToExcel<T>(
    data: T[],
    columns: { header: string; accessor: keyof T | ((row: T) => any) }[],
    filename: string = "export.xlsx"
): void {
    if (!data || data.length === 0) {
        throw new Error("No data to export");
    }

    // Format data into an array of objects mapping header -> value
    const formattedData = data.map(row => {
        const rowData: Record<string, any> = {};
        columns.forEach(col => {
            let value = typeof col.accessor === "function" 
                ? col.accessor(row) 
                : row[col.accessor];
            
            if (value === null || value === undefined) {
                value = "";
            }
            rowData[col.header] = value;
        });
        return rowData;
    });

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write file
    XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}

/**
 * Opens a native print dialog with a cleanly formatted HTML table of the data
 */
export function exportToPrint<T>(
    data: T[],
    columns: { header: string; accessor: keyof T | ((row: T) => any) }[],
    title: string = "Data Export"
): void {
    if (!data || data.length === 0) {
        throw new Error("No data to export");
    }

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
        document.body.removeChild(iframe);
        throw new Error("Failed to initialize print frame");
    }

    // Generate table HTML
    const headersHtml = columns.map(col => `<th>${col.header}</th>`).join("");
    
    const rowsHtml = data.map(row => {
        const cellsHtml = columns.map(col => {
            let value = typeof col.accessor === "function" 
                ? col.accessor(row) 
                : row[col.accessor];
            
            if (value === null || value === undefined) value = "";
            return `<td>${String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`;
        }).join("");
        return `<tr>${cellsHtml}</tr>`;
    }).join("");

    // Write content with basic clean styling
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                    padding: 20px;
                    color: #333;
                }
                h1 { 
                    font-size: 24px; 
                    margin-bottom: 20px; 
                    border-bottom: 2px solid #eee;
                    padding-bottom: 10px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    font-size: 12px;
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px 12px; 
                    text-align: left; 
                }
                th { 
                    background-color: #f8f9fa; 
                    font-weight: 600;
                }
                tr:nth-child(even) { background-color: #fcfcfc; }
                @media print {
                    @page { margin: 1cm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <h1>${title.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h1>
            <table>
                <thead>
                    <tr>${headersHtml}</tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </body>
        </html>
    `);
    
    doc.close();

    // Focus and print after content is loaded
    iframe.onload = () => {
        try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        } catch (e) {
            console.error("Print failed:", e);
        } finally {
            // Cleanup after printing dialog is closed/done
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 1000);
        }
    };
}

import { ExpenseDetectionArray } from "@/types/Expense";

/**
 * Upload an image file to the expense detection API
 * @param file - The image file to process
 * @param instruction - Optional custom instruction for the AI
 * @returns Promise<ExpenseDetectionArray> - Array of detected expenses
 */
export async function detectExpenseFromImage(
    file: File,
    instruction?: string
): Promise<ExpenseDetectionArray> {
    const formData = new FormData();
    formData.append("file", file);
    
    if (instruction) {
        formData.append("instruction", instruction);
    }

    const response = await fetch("/api/expense/detect", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to detect expense from image");
    }

    return response.json();
}

/**
 * Validate if a file is a supported image type
 * @param file - The file to validate
 * @returns boolean - True if the file is a supported image
 */
export function isSupportedImageType(file: File): boolean {
    return /^image\/(png|jpe?g|webp|gif|bmp|tiff)$/i.test(file.type);
}

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns string - Formatted size (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

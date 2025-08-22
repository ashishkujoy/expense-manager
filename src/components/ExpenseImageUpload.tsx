import React, { useState } from "react";
import { detectExpenseFromImage, isSupportedImageType, formatFileSize } from "@/app/lib/expenseDetection";
import { ExpenseDetectionArray } from "@/types/Expense";

export default function ExpenseImageUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [instruction, setInstruction] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ExpenseDetectionArray | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!isSupportedImageType(file)) {
                setError("Please select a valid image file (PNG, JPEG, WebP, GIF, BMP, or TIFF)");
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError("File size must be less than 10MB");
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!selectedFile) {
            setError("Please select an image file");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const detectedExpenses = await detectExpenseFromImage(
                selectedFile,
                instruction.trim() || undefined
            );
            setResult(detectedExpenses);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setInstruction("");
        setResult(null);
        setError(null);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Extract Expense from Receipt Image
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Receipt Image
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                    {selectedFile && (
                        <p className="mt-1 text-sm text-gray-600">
                            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="instruction" className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Instruction (Optional)
                    </label>
                    <textarea
                        id="instruction"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="e.g., Extract all line items with tax information..."
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={!selectedFile || isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? "Processing..." : "Extract Expense Data"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">
                        Detected Expenses:
                    </h3>
                    {result.map((expense, index) => (
                        <div key={index} className="mb-3 p-3 bg-white border border-green-300 rounded">
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-600">Amount:</span>
                                    <div className="text-green-700 font-semibold">
                                        ${expense.amount.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Category:</span>
                                    <div className="text-gray-800">{expense.category}</div>
                                </div>
                                <div className="col-span-3">
                                    <span className="font-medium text-gray-600">Description:</span>
                                    <div className="text-gray-800">{expense.description}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

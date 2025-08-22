"use client";

import { useExpenseForm } from "@/hooks/expenseForm";
import { Calendar, Camera, IndianRupee, Tag } from "lucide-react";
import { useState } from "react";
import WebCamera from "./Camera";

const categories = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Healthcare', 'Other'];


const ExpenseForm = () => {
    const { expense, updateExpense, submitExpense, loading } = useExpenseForm();
    const [showPhotoCapture, setShowPhotoCapture] = useState(false);
    const [detectingExpense, setDetectingExpense] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitExpense();
    };

    const onCapture = async (imageSrc: string) => {
        try {
            setDetectingExpense(true);
            
            // Convert base64 to blob
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', blob, 'receipt.jpg');
            formData.append('instruction', 'Extract amount (numeric), description, and a category from this bill image.');
            
            // Send to detect endpoint
            const detectResponse = await fetch('/api/expense/detect', {
                method: 'POST',
                body: formData,
            });
            
            if (!detectResponse.ok) {
                throw new Error('Failed to detect expense details');
            }
            
            const detectedData = await detectResponse.json();
            
            // Update the expense form with detected data
            if (detectedData.amount) {
                updateExpense({ amount: parseFloat(detectedData.amount) });
            }
            if (detectedData.description) {
                updateExpense({ description: detectedData.description });
            }
            if (detectedData.category) {
                updateExpense({ category: detectedData.category });
            }
            
            // Hide the camera after successful capture
            setShowPhotoCapture(false);
            
        } catch (error) {
            console.error('Error detecting expense:', error);
            // You might want to show an error message to the user here
        } finally {
            setDetectingExpense(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Expense</h2>
                <p className="text-gray-600">Track your spending manually or scan a receipt</p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> */}
            <div className="">
                <button
                    onClick={() => setShowPhotoCapture(true)}
                    disabled={detectingExpense}
                    className={`p-4 rounded-xl border-2 transition-all ${showPhotoCapture
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                        } ${detectingExpense ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <span className="font-medium">
                        {detectingExpense ? 'Detecting...' : 'Scan Receipt'}
                    </span>
                </button>
            </div>
            {
                showPhotoCapture && (
                    <div className="space-y-4">
                        <WebCamera onCapture={onCapture} />
                        {detectingExpense && (
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-blue-600 font-medium">Analyzing receipt...</p>
                            </div>
                        )}
                    </div>
                )
            }
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Date
                            </label>
                            <input
                                type="date"
                                value={expense.date}
                                onChange={(e) => updateExpense({ date: e.target.value })}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <IndianRupee className="w-4 h-4 inline mr-1" />
                                Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={expense.amount}
                                required
                                onChange={(e) => updateExpense({ amount: parseFloat(e.target.value) })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Tag className="w-4 h-4 inline mr-1" />
                            Category
                        </label>
                        <select
                            value={expense.category}
                            onChange={(e) => updateExpense({ category: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                            type="text"
                            placeholder="What did you spend on?"
                            value={expense.description}
                            required
                            onChange={(e) => updateExpense({ description: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        type="submit"
                        disabled={loading}
                    >
                        Add Expense
                    </button>
                </div>
            </form>
        </div>
    )
};

const CloseableExpenseForm = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setOpen(!open)}>
                {open ? "Close" : "Add Expense"}
            </button>
            {open && <ExpenseForm />}
        </div>
    );
}

export default CloseableExpenseForm;

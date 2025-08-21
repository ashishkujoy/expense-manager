"use client";

import { Calendar, Camera, IndianRupee, Tag } from "lucide-react";
import { useState } from "react";

type Expense = {
    date: string;
    amount: string;
    category: string;
    description: string;
}

const categories = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Healthcare', 'Other'];


const ExpenseForm = () => {
    const [showPhotoCapture, setShowPhotoCapture] = useState(false);
    const [newExpense, setNewExpense] = useState<Expense>({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        description: ''
    });

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
                    className={`p-4 rounded-xl border-2 transition-all ${showPhotoCapture
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <span className="font-medium">Scan Receipt</span>
                </button>
            </div>


            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Date
                        </label>
                        <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
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
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
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
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
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
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Add Expense
                </button>
            </div>
        </div>
    )
};

export default ExpenseForm;

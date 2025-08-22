import { Expense } from "@/types/Expense";
import { useState } from "react";

const postExpense = async (expense: Expense) => {
    try {
        const res = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        });
        const body = await res.json();
        if (!res.ok) {
            return { success: false, error: body.error || 'Unknown error' }
        }
        return { success: true, data: body }
    } catch (error) {
        console.error("Error posting expense:", error);
        return { success: false, error: 'Failed to post expense' }
    }
}

export const useExpenseForm = () => {
    const [loading, setLoading] = useState(false);
    const [expense, setExpense] = useState<Expense>({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        description: ''
    });

    const submitExpense = async () => {
        setLoading(true);
        const result = await postExpense(expense);
        setLoading(false);
        if (result.success) {
            resetForm();
        } else {
            console.error("Failed to submit expense:", result.error);
        }
    };

    const resetForm = () => {
        setExpense({
            date: new Date().toISOString().split('T')[0],
            amount: '',
            category: '',
            description: ''
        });
    };

    const updateExpense = (update: Partial<Expense>) => {
        setExpense((prev) => ({ ...prev, ...update }));
    };

    return { expense, updateExpense, resetForm, submitExpense, loading };
}
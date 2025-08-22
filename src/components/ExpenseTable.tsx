import { Expense, WithId } from "@/types/Expense";
import DateRangeSelector from "./DateRangeSelector";

export type ExpenseTableProps = {
    expenses: Array<WithId<Expense>>;
};

const ExpenseItem = (expense: Expense) => {
    return (
        <div className="bg-white p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition ease-in-out duration-200 mb-2">
            <div className="flex justify-between items-start">
                <div className="text-lg font-medium">{expense.description}</div>
                <div className="text-lg font-semibold text-gray-800">₹{expense.amount}</div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">{expense.date.toString().split("T")[0]}</div>
                <div className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{expense.category}</div>
            </div>
        </div>
    )
}

const ExpenseTable = ({ expenses }: ExpenseTableProps) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg h-full">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Your Expenses</h2>
            </div>
            <div className="mb-2">
                <DateRangeSelector />
            </div>
            <div className="overflow-x-auto flex-row gap-y-2">
                {
                    expenses.map(expense => (
                        <ExpenseItem key={expense.id} {...expense} />
                    ))
                }
            </div>
        </div>
    )
}

export default ExpenseTable;

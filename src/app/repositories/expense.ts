import { Expense } from "@/types/Expense";
import { neon } from "@neondatabase/serverless";

export const createExpense = async (expense: Expense, userId: number) => {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
        const rows = await sql`
        INSERT INTO expenses
            (date, amount, category, description, user_id)
        VALUES
            (${expense.date}, ${expense.amount}, ${expense.category}, ${expense.description}, ${userId})
        RETURNING id;
        `;
        return rows[0].id as number;
    } catch (error) {
        throw new Error(`Failed to create expense: ${error}`);
    }
}
import { createExpense } from "@/app/repositories/expense";
import { expenseSchema } from "@/types/Expense";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const expense = expenseSchema.safeParse(body);
    if (!expense.success) {
        return new Response(JSON.stringify({ error: "Invalid expense data" }), { status: 400 });
    }
    try {
        const expenseId = createExpense(expense.data);
        return new Response(null, {
            status: 201,
            headers: {
                location: `/api/expenses/${expenseId}`
            }
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: `${error}` }),
            { status: 400 }
        )
    }
}

import { z } from "zod";

export const expenseSchema = z.object({
    date: z.string().min(10),
    amount: z.number(),
    category: z.string().min(2).max(100),
    description: z.string().min(2).max(500),
});

export type Expense = z.infer<typeof expenseSchema>;

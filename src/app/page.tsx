import CloseableExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { fetchExpenses } from "./repositories/expense";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const expenses = await fetchExpenses(userId, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col space-y-4 h-full">
      <CloseableExpenseForm />
      <ExpenseTable expenses={expenses} />
    </div>
  );
}

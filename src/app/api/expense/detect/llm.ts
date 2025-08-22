import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z, { date } from "zod";

const MODEL = process.env.MODEL ?? "gemini-2.0-flash";
const BillSchema = z.object({
    amount: z.number().describe("Total amount on the bill in currency units"),
    description: z.string().describe("Short description of the purchase"),
    category: z.enum([
        "food", "groceries", "transport", "utilities", "entertainment",
        "shopping", "health", "travel", "rent", "other"
    ]).describe("Expense category"),
    date
});
const BillsSchema = z.array(BillSchema).describe("Array of bills extracted from the image");
const ResponseSchema = z.object({
    bills: BillsSchema,
    summary: z.object({
        total: z.number().describe("Total amount of all bills"),
    })
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let llm: any = null;

const getLLM = () => {
    if (llm) {
        return llm;
    }
    const chatLLM = new ChatGoogleGenerativeAI({ model: MODEL, temperature: 0 });
    const structured = chatLLM.withStructuredOutput(ResponseSchema);
    llm = structured;
    return llm;
}
// Bind Zod schema so output is validated JSON

const systemPrompt = `If a field is unreadable, use amount: 0, description: '', category: 'other'. Return only the requested fields. There can be more than one entry, return all the entries. For total amount look for the value in bill first, if it is not available, calculate the total from all entries considering the taxes`;


export const parseBill = async (dataUrl: string, instruction: string) => {
    const messages = [
        {
            role: "system",
            content: [
                {
                    type: "text", text: systemPrompt
                }
            ]
        },
        {
            role: "user",
            content: [
                { type: "text", text: instruction },
                { type: "image_url", image_url: { url: dataUrl } }
            ]
        }
    ];

    const result = await getLLM().invoke(messages);
    return result;
}
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { parseBill } from "./llm";

function bufferToDataUrl(buffer: Buffer, mime = "image/jpeg"): string {
    const b64 = buffer.toString("base64");
    return `data:${mime};base64,${b64}`;
}

export const POST = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user.id;

        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const instruction = formData.get("instruction") as string;

        if (!file) {
            return new Response(
                JSON.stringify({ error: "No file uploaded. Use field 'file'." }),
                { status: 400 }
            );
        }

        const mime = file.type || "application/octet-stream";
        if (!/^image\/(png|jpe?g|webp|gif|bmp|tiff)$/i.test(mime)) {
            return new Response(
                JSON.stringify({ error: `Unsupported media type: ${mime}` }),
                { status: 415 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dataUrl = bufferToDataUrl(buffer, mime);
        const finalInstruction = (typeof instruction === "string" && instruction.trim()) ||
            "Extract amount (numeric), description, and a category from this bill image.";

        const bill = await parseBill(dataUrl, finalInstruction);
        return new Response(JSON.stringify(bill), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error("Error processing expense detection:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Server error"
            }),
            { status: 500 }
        );
    }
};

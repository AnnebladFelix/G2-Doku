import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
    req: NextResponse,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    try {
        const comments = await prisma.comments.findMany({
            where: { documentId: parseInt(id, 10) },
            include: { user: true },
        });
        return NextResponse.json({ content: comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error },
            { status: 500 }
        );
    }
}

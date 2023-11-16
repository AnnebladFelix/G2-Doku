import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed", status: 405 });
    }
    const { userId, documentId, content } = await req.json()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const document = await prisma.document.findUnique({
            where: { id: documentId, isPrivate: false, deleted: false },
        });

        if (!user || !document) {
            return NextResponse.json({ error: "User or document not found", status: 404 });
        }

        const newComment = await prisma.comments.create({
            data: {
                user: { connect: { id: userId } },
                document: { connect: { id: documentId } },
                content,
            },
        });

        return NextResponse.json(newComment, { status: 200 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            status: "500",
        });
    }
}

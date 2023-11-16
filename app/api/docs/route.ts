import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { createDocumentSchema } from "../../validationSchema";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = createDocumentSchema.safeParse(body);
        if (!validation.success)
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });
        const newDocument = await prisma.document.create({
            data: {
                title: body.title,
                content: body.content,
                author: { connect: { id: body.author } },
                isPrivate: body.isPrivate || false,
            },
        });

        return NextResponse.json(newDocument, { status: 200 });
    } catch (error) {
        console.error("Error creating Document:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const documents = await prisma.document.findMany({
            where: {
                isPrivate: false,
                deleted: false,
            },
            include: {
                author: true,
                flags: true,
            },
        });

        return NextResponse.json(documents, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching document" },
            { status: 500 }
        );
    }
}

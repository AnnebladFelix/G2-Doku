import { NextRequest, NextResponse } from "next/server";
import { createFlagSchema } from "@/app/validationSchema";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = createFlagSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });
        }

        const existingFlag = await prisma.flag.findFirst({
            where: {
                documentId: body.documentId,
                userId: body.userId,
            },
        });

        if (existingFlag) {
            await prisma.flag.delete({
                where: { id: existingFlag.id },
            });
        } else {
            const newFlag = await prisma.flag.create({
                data: {
                    document: { connect: { id: body.documentId } },
                    user: { connect: { id: body.userId } },
                    flagged: "FLAGGED",
                },
            });
        }

        return NextResponse.json(
            { message: "Flag operation completed successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error handling Flag:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextResponse, { params }: { params: { id: string } }) {
    const id = params.id;
    try {
        const flaggedDocuments = await prisma.user.findUnique({
            where: { id: String(id) },
            include: { flags: true },
        });

        return NextResponse.json(flaggedDocuments, { status: 200 });
    } catch (error) {
        console.error("Error fetching flagged documents:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        if (!userId) {
            return NextResponse.json({ error: "No user id provided" }, { status: 400 });
        }
        const userWithDocuments = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                documents: true,
            },
        });

        if (!userWithDocuments) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(userWithDocuments, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error fetching user and documents" }, { status: 500 });
    }
}
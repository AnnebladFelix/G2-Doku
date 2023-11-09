import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Error fetching document" }, { status: 500 });
    }
}
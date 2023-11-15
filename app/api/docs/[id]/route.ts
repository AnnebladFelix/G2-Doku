import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { editDocumentSchema } from '../../../validationSchema'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = await request.json();
    const validation = editDocumentSchema.safeParse(body);
    console.log("Detta", id, body, validation);

    if (!validation.success) {
        console.error('Validation error:', validation.error.errors);
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const updatedDocument = await prisma.document.update({
            where: { id: Number(id) },
            data: { title: body.title, content: body.content, isPrivate: body.isPrivate }
        });

        return NextResponse.json(updatedDocument, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error updating the document.' }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "No id provided" }, { status: 400 });

    try {
        const document = await prisma.document.findFirst({ where: { id: Number(params?.id) } });
        return NextResponse.json(document, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching document" }, { status: 500 });
    }
}


//* SOFT DELETE
export async function DELETE(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "No id provided" }, { status: 400 });

    try {
        const document = await prisma.document.update({
            where: { id: Number(params?.id)},
            data: { deleted: true },
        });
        return NextResponse.json({ document }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error updating document" }, { status: 500 });
    }
}
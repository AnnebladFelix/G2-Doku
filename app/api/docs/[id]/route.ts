import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { createDocumentSchema } from '../../../validationSchema'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = await request.json();
    const validation = createDocumentSchema.safeParse(body);
    
    if (!validation.success) {
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const updatedDocument = await prisma.document.update({
            where: { id: Number(id) },
            data: { title: body.title, content: body.content }
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


//! Ändra till en softdel istället för hardDel
// export async function DELETE(req: Request, { params }: { params: { id: number } }) {
//     const { id } = params;
//     if (!id) return NextResponse.json({ error: "No id provided" }, { status: 400 });
    
//     try {
//         const document = await prisma.document.delete({
//             where: { id: Number(params?.id)}, 
//         });
//         return NextResponse.json({ document, }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: "Error fetching issue" }, { status: 500 });
//     }
// }
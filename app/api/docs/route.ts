import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { createDocumentSchema } from "../../validationSchema";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Received Data:", body);
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

        console.log("Inserted Document:", newDocument);
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
            },
            include: {
                author: true,
                flags: true,
            },
        });
        // console.log(documents);

        return NextResponse.json(documents, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching document" },
            { status: 500 }
        );
    }
}

//! ------------ remove comments if documents need to be deleted -------------------

// export async function DELETE(request: NextRequest) {
//     try {
//       const deleteResult = await prisma.document.deleteMany();

//       console.log("Deleted documents:", deleteResult);

//       return NextResponse.json({ message: "All documents deleted successfully." }, { status: 200 });
//     } catch (error) {
//       console.error("Error deleting documents:", error);
//       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
//   }

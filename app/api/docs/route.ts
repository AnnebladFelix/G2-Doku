// api/docs/index.ts
import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { documentId, userId } = await request.json();

        const document = await prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const data: any = {
            document: { connect: { id: documentId } },
            user: { connect: { id: userId } },
            flagged: "FLAGGED",
        };

        await prisma.flag.create({
            data,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error flagging document:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const documents = await prisma.document.findMany({
            include: {
                author: true,
                flags: {
                    include: {
                        document: true,
                        user: true,
                    },
                },
            },
        } as Prisma.DocumentFindManyArgs);

        return NextResponse.json(documents, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching document" }, { status: 500 });
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
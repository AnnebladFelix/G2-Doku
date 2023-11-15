// Import necessary modules and schemas
import { NextRequest, NextResponse } from 'next/server';
import { createFlagSchema } from '@/app/validationSchema';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Received Data:", body);
        const validation = createFlagSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });
        }

        // Check if the flag already exists
        const existingFlag = await prisma.flag.findFirst({
            where: {
                documentId: body.documentId,
                userId: body.userId,
            },
        });

        if (existingFlag) {
            // Flag exists, delete it
            await prisma.flag.delete({
                where: { id: existingFlag.id },
            });
            console.log("Deleted Flag:", existingFlag.id);
        } else {
            // Flag doesn't exist, create a new flag
            const newFlag = await prisma.flag.create({
                data: {
                    document: { connect: { id: body.documentId } },
                    user: { connect: { id: body.userId } },
                    flagged: 'FLAGGED',
                },
            });
            console.log("Inserted Flag:", newFlag);
        }

        return NextResponse.json({ message: 'Flag operation completed successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error handling Flag:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}



// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         console.log("Received Data:", body);
//         const validation = createFlagSchema.safeParse(body);
//         if (!validation.success) {
//             return NextResponse.json(validation.error.format(), {
//                 status: 400,
//             });
//         }
//         const newFlag = await prisma.flag.create({
//             data: {
//                 document: { connect: { id: body.documentId } },
//                 user: { connect: { id: body.userId } },
//                 flagged:  'FLAGGED',
//             },
//         });
//         console.log("Inserted Flag:", newFlag);
//         return NextResponse.json(newFlag, { status: 200 });
//     } catch (error) {
//         console.error("Error creating Flag:", error);
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }

export async function GET(req: NextResponse, { params }: { params: { id: string } }) {
  const id = params.id;
    console.log("hej");
  try {
    const flaggedDocuments = await prisma.user.findUnique({
      where: { id: String(id) },
      include: { flags: true },
    });

    return NextResponse.json(flaggedDocuments, {status: 200})
  } catch (error) {
    console.error('Error fetching flagged documents:', error);
    return NextResponse.json({ error: 'Internal Server Error'}, {status: 500});
  }
}

// export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
//   try {
//     const { id } = params;
//       console.log("Received Data for DELETE:", id);

//       // ... (Validation logic if needed)

//       await prisma.flag.delete({
//           where: {
//               id: id
//           },
//       });

//       return NextResponse.json({ message: 'Flag deleted successfully.' }, { status: 200 });
//   } catch (error) {
//       console.error('Error deleting flag:', error);
//       return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

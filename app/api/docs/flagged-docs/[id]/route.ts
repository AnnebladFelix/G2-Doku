import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import { getSession } from 'next-auth/react';
import { Prisma } from '@prisma/client';

export async function POST(request: NextApiRequest, response: NextApiResponse) {
    try {
        const session = await getSession({ req: request });

        if (!session?.user?.sub) {
            return response.status(401).json({ error: 'User not authenticated' });
        }

        const userId = session.user?.sub;

        const { id } = request.query;

        const document = await prisma.document.findUnique({
            where: { id: typeof id === 'string' ? parseInt(id, 10) : undefined },
        });

        if (!document) {
            return response.status(404).json({ error: 'Document not found' });
        }

        const flagCreateInput: Prisma.FlagCreateInput = {
            document: { connect: { id: document.id } },
            user: { connect: { id: userId } } as Prisma.UserCreateNestedOneWithoutFlagsInput,
            flagged: 'FLAGGED',
        };

        return response.status(200).json({ success: true, flag });
    } catch (error) {
        console.error('Error flagging document:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}

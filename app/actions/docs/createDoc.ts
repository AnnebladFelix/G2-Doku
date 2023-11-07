"use server";

import prisma from "@/app/lib/prisma";

export const createDoc = async (title: string, content: string, author: any) => {
    const document = await prisma.document.create({ data: { title, content, author} });

    return "Succesfully created document";
};

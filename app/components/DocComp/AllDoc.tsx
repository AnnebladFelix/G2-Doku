"use client";

import { useCallback, useEffect, useState } from "react";
import { getDocumentSchema } from "@/app/validationSchema";
import z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Table } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";

type Document = z.infer<typeof getDocumentSchema>;

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
    return formattedDate.replace(",", "");
};

const GetAllDocsPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [error, setError] = useState("");
    const [flaggedDocuments, setFlaggedDocuments] = useState<
        Record<number, boolean>
    >({});
    const { data: session, status } = useSession();
    const [isFlagged, setIsFlagged] = useState(false);
    const router = useRouter();

    const fetchInitialData = useCallback(async () => {
        try {
            if (session?.user?.sub && status === "authenticated") {
                const [documentsResponse, flaggedDocumentsResponse] =
                    await Promise.all([
                        axios.get("/api/docs"),
                        axios
                            .get(`/api/flags/${session?.user?.sub}`)
                            .catch((error) => {
                                console.error(
                                    "Error fetching flagged documents:",
                                    error.response?.data || error.message
                                );
                                return { data: [] };
                            }),
                    ]);

                setDocuments(documentsResponse.data);

                const flaggedDocs = flaggedDocumentsResponse.data.flags.reduce(
                    (
                        acc: { [x: string]: boolean },
                        doc: { documentId: string | number }
                    ) => {
                        acc[doc.documentId] = true;
                        return acc;
                    },
                    {} as Record<number, boolean>
                );
                setFlaggedDocuments(flaggedDocs);
            }
        } catch (error) {
            console.error("Error fetching documents or user data:", error);
            setError("Error fetching documents or user data");
        }
    }, [session?.user?.sub, status]);

    useEffect(() => {
        fetchInitialData();
    }, [isFlagged, fetchInitialData]);

    const handleClick = (document: Document) => {
        router.push(`/documents/singleDoc?id=${document.id}`);
    };

    const handleFlagClick = async (
        documentId: number,
        userId: string
    ): Promise<void> => {
        try {
            const response = await axios.post("/api/flags/" + documentId, {
                documentId,
                userId,
            });

            if (response.status === 200) {
                setFlaggedDocuments((prevState) => ({
                    ...prevState,
                    [documentId]: true,
                }));

                setIsFlagged((prevIsFlagged) => !prevIsFlagged);

                setDocuments((prevDocuments) =>
                    prevDocuments.map((doc) => {
                        if (doc.id === documentId) {
                            return {
                                ...doc,
                                isFlagged: true,
                            };
                        }
                        return doc;
                    })
                );
            } else {
                console.error("Error flagging document:", response.statusText);
            }
        } catch (error) {
            console.error("Error flagging document:", error);
        }
    };

    const sortedDocuments = [...documents].sort((a, b) => {
        if (flaggedDocuments[a.id] === flaggedDocuments[b.id]) {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        }
        return flaggedDocuments[b.id] ? 1 : -1;
    });

    const getAuthorName = (authorId: string) => {
        const user = documents.find((doc) => doc.author?.id === authorId);
        return user?.author.name || "Unknown Author";
    };

    const getMyDoc = () => {
        router.push(`/documents/myDoc`);
    };

    if (status === "authenticated") {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center h-full flex-grow rounded-lg bg-[#bcaa9a] p-4">
                    <div>
                        <button className=" mb-2">Alla dokument</button>
                        <span className="mx-2 ">/</span>
                        <button className=" mb-2 " onClick={getMyDoc}>
                            Mina dokument
                        </button>
                    </div>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>
                                    Titel
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Författare
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Skapad
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Ändrad
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Favorit
                                </Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {sortedDocuments.map((document) => (
                                <Table.Row key={document.id}>
                                    <Table.Cell className="max-w-[200px] px-4">
                                        <button
                                            onClick={() =>
                                                handleClick(document)
                                            }
                                        >
                                            {document.title}
                                        </button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span style={{ padding: "0.25rem" }}>
                                            {getAuthorName(document.authorId)}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span style={{ padding: "0.25rem" }}>
                                            {formatDate(document.createdAt)}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span style={{ padding: "0.25rem" }}>
                                            {formatDate(document.updatedAt)}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <button
                                            onClick={() =>
                                                handleFlagClick(
                                                    document.id,
                                                    session?.user?.sub
                                                )
                                            }
                                        >
                                            {flaggedDocuments[document.id] ? (
                                                <StarFilledIcon
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        color: "yellow",
                                                    }}
                                                />
                                            ) : (
                                                <StarIcon
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        color: "gray",
                                                    }}
                                                />
                                            )}
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </div>
            </div>
        );
    } else {
        return <p>Du måste vara inloggad för att se dokumenten.</p>;
    }
};
export default GetAllDocsPage;

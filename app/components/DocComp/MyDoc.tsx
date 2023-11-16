"use client";

import { getDocumentSchema } from "@/app/validationSchema";
import { Table } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import z from "zod";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

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

const MyDocPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const { data: session, status } = useSession();
    const sessionAuthor = session?.user?.sub;
    const [error, setError] = useState("");
    const [author, setAuthor] = useState("");
    const [isFlagged, setIsFlagged] = useState<boolean>(false);
    const [flaggedDocuments, setFlaggedDocuments] = useState<
        Record<number, boolean>
    >({});


    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (status === "authenticated") {
                    const response = await axios.get(
                        "/api/user/" + sessionAuthor
                    );
                    setDocuments(response.data.documents);
                    setAuthor(response.data.name);
                }
            } catch (error) {
                setError("Error fetching documents or user data");
            }
        };
        fetchData();
    }, [sessionAuthor, status]);

    const fetchInitialData = useCallback(async () => {
        try {
            if (sessionAuthor && status === "authenticated") {
                const [documentsResponse, flaggedDocumentsResponse] =
                    await Promise.all([
                        axios.get("/api/user/" + sessionAuthor),
                        axios.get(`/api/flags/${sessionAuthor}`)
                            .catch((error) => {
                                console.error(
                                    "Error fetching flagged documents:",
                                    error.response?.data || error.message
                                );
                                return { data: [] };
                            }),
                    ]);

                setDocuments(documentsResponse.data.documents);

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
    }, [sessionAuthor, status]);

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

    const getAllDoc = () => {
        router.push(`/documents`);
    };

    if (status === "authenticated") {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center h-full flex-grow rounded-lg bg-[#bcaa9a] p-4">
                    <div>
                        <button className=" mb-2" onClick={getAllDoc}>
                            Alla dokument
                        </button>
                        <span className="mx-2 ">/</span>
                        <button className=" mb-2 ">Mina dokument</button>
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
                                            {author}
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
                                                handleFlagClick(document.id, sessionAuthor)
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

export default MyDocPage;

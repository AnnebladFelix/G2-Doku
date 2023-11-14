"use client";

import { getDocumentSchema } from "@/app/validationSchema";
import { Table } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";
import { StarIcon } from "@radix-ui/react-icons";

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

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (status === "authenticated") {
                    const response = await axios.get(
                        "/api/user/" + sessionAuthor
                    );
                    setDocuments(response.data.documents);
                    console.log(response);
                    setAuthor(response.data.name);
                }
            } catch (error) {
                setError("Error fetching documents or user data");
            }
        };
        fetchData();
    }, [sessionAuthor, status]);

    const handleClick = (document: Document) => {
        router.push(`/documents/singleDoc?id=${document.id}`);
    };

    const handleFlagClick = (document: Document) => {
        console.log("Flaggad", document.id);

        setIsFlagged(!document.isFlagged);
    };

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
                            {documents.map((document) => (
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
                                                handleFlagClick(document)
                                            }
                                        >
                                            {document.isFlagged ? (
                                                <StarIcon
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

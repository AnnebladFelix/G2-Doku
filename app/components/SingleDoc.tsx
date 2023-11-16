"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocumentSchema } from "@/app/validationSchema";
import { z } from "zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Box, Card, Text } from "@radix-ui/themes";

type Document = z.infer<typeof getDocumentSchema>;

function SingleDoc() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { data: session, status } = useSession();
    const [singleDocument, setSingleDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchDocument = async () => {
            if (id) {
                try {
                    const response = await axios.get(`/api/docs/${id}`);
                    setSingleDocument(response.data);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    setError("Error fetching doc. Please try again later.");
                }
            } else {
                setError("Fel id");
            }
        };
        fetchDocument();
    }, [id]);

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

    const handleEdit = () => {
        if (singleDocument) {
            router.push(`/documents/editDoc?id=${singleDocument.id}`);
        }
    };
    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);

        if (!singleDocument) {
            setError("No document to delete");
            return;
        }

        try {
            const response = await axios.delete(
                `/api/docs/${singleDocument.id}`
            );
            if (response.status === 200) {
                router.push("/documents/myDoc");
            } else {
                console.error("Error deleting document:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const isAuthor =
        status === "authenticated" &&
        session?.user?.sub === singleDocument?.authorId;

    if (status === "authenticated") {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Card size="3" style={{ width: 500, height: 500 }}>
                    <div className="flex flex-col items-center h-full w-full flex-grow rounded-lg  bg-white">
                        {singleDocument && (
                            <div className="mt-4 w-full flex flex-col items-center">
                                <div className="flex flex-col items-center text-2xl mt-4 underline decoration-solid">
                                    Rubrik: {singleDocument.title}
                                </div>
                                <div
                                    className="flex flex-col items-center mt-4 w-full"
                                    dangerouslySetInnerHTML={{
                                        __html: singleDocument.content,
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>
                </Card>
                {isAuthor && (
                    <div className="flex mt-4">
                        <button
                            className=" w-40 rounded-md shadow-md mb-2 hover:animate-pulse bg-[#5e8170] hover:bg-[#85b49d]"
                            onClick={() => handleEdit()}
                        >
                            Redigera
                        </button>
                        <span className="mx-2 "></span>
                        <button
                            className=" w-40 rounded-md shadow-md mb-2 hover:animate-pulse bg-[#bb3e3e] hover:bg-[#e97f7f]"
                            onClick={() => handleDelete()}
                        >
                            Ta bort
                        </button>
                    </div>
                )}
                {singleDocument && (
                    <div className="mt-4">
                        {<p>Skapad av: {singleDocument.author.name}</p>}
                        <p>Skapad: {formatDate(singleDocument.createdAt)}</p>
                        <p>Ändrad: {formatDate(singleDocument.updatedAt)}</p>
                    </div>
                )}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Card size="2" style={{ width: 300, padding: 20, borderRadius: 10, backgroundColor: "whitesmoke"}}>
                            <Text>
                                Är du säker på att du vill ta bort detta
                                dokument?
                            </Text>
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-[#bb3e3e] text-white px-4 py-2 rounded-md mr-2"
                                    onClick={handleConfirmDelete}
                                >
                                    Ja
                                </button>
                                <button
                                    className="bg-[#5e8170] text-white px-4 py-2 rounded-md"
                                    onClick={handleCancelDelete}
                                >
                                    Avbryt
                                </button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        );
    } else {
        return <p>Du måste vara inloggad för att se dokument.</p>;
    }
}

export default SingleDoc;

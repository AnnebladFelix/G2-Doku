"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { getDocumentSchema } from "@/app/validationSchema";
import { z } from "zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Card, Text } from "@radix-ui/themes";
import { getCommentsSchema } from "@/app/validationSchema";

type Document = z.infer<typeof getDocumentSchema>;
type Comment = z.infer<typeof getCommentsSchema>;

function SingleDoc() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { data: session, status } = useSession();
    const [singleDocument, setSingleDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const [commentContent, setCommentContent] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);

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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/${id}`);

                setComments((prevComments) => [
                    ...prevComments,
                    ...response.data.content,
                ]);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        if (id) {
            fetchComments();
        }
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

    const handleCommentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setCommentContent(event.target.value);
    };

    const handleComment = useCallback(async () => {
        try {
            const response = await axios.post("/api/comments", {
                userId: session?.user?.sub,
                documentId: singleDocument?.id,
                content: commentContent,
            });

            if (response.status === 200) {
                const latestCommentsResponse = await axios.get(
                    `/api/comments/${id}`
                );
                setComments(latestCommentsResponse.data.content);

                setCommentContent("");
            } else {
                console.error("Error creating comment:", response.statusText);
            }
        } catch (error) {
            console.error("Error creating comment:", error);
        }
    }, [id, commentContent, session?.user?.sub, singleDocument?.id]);

    const isAuthor =
        status === "authenticated" &&
        session?.user?.sub === singleDocument?.authorId;

    if (status === "authenticated") {
        return (
            <div className="container flex flex-row min-w-min h-full lg:ml-60">
                <div className="m-2">
                    <p className="text-2xl">Kommentarer:</p>
                    {comments.map((comment, index) => (
                        <div
                            className="flex flex-col mb-4 w-64"
                            key={index}
                        >
                            <p className="bg-secondary pl-2">
                                Avsändare:{" "}
                                {comment.user
                                    ? comment.user.name
                                    : "Okänd användare"}
                            </p>
                            <p className="bg-primary text-text2 p-2">
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center w-full">
                    <div className="ql-editor2 overflow-y-scroll bg-white">
                        <div className="flex flex-col items-center w-full">
                            {singleDocument && (
                                <div className="mt-4 w-full flex flex-col items-center">
                                    <div className="flex flex-col items-center text-2xl mt-4 underline decoration-solid text-black">
                                        Rubrik: {singleDocument.title}
                                    </div>
                                    <div
                                        className="flex flex-col items-center mt-4 w-full text-black"
                                        dangerouslySetInnerHTML={{
                                            __html: singleDocument.content,
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                    {isAuthor && (
                        <div className="flex mt-4 gap-10">
                            <button
                                className="w-36 rounded-md shadow-md mb-2 hover:animate-pulse bg-[#5e8170] hover:bg-[#85b49d]"
                                onClick={() => handleEdit()}
                            >
                                Redigera
                            </button>
                            <button
                                className="w-36 rounded-md shadow-md mb-2 hover:animate-pulse bg-[#bb3e3e] hover:bg-[#e97f7f]"
                                onClick={() => handleDelete()}
                            >
                                Ta bort
                            </button>
                        </div>
                    )}
                    {singleDocument && (
                        <div className="flex flex-row gap-4 m-4">
                            <div className="">
                                <p>Skapad av: {singleDocument.author.name}</p>
                                <p>
                                    Skapad:{" "}
                                    {formatDate(singleDocument.createdAt)}
                                </p>
                                <p>
                                    Ändrad:{" "}
                                    {formatDate(singleDocument.updatedAt)}
                                </p>
                            </div>
                            <div className="flex flex-col m-2 text-black">
                                <textarea
                                    value={commentContent}
                                    onChange={handleCommentChange}
                                    placeholder="Lämna en kommentar här..."
                                />
                                <button
                                    className="w-full rounded-md shadow-md mt-2 hover:animate-pulse bg-[#5e8170] hover:bg-[#85b49d]"
                                    onClick={handleComment}
                                >
                                    Kommentera
                                </button>
                            </div>
                        </div>
                    )}
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Card
                                size="2"
                                style={{
                                    width: 300,
                                    padding: 20,
                                    borderRadius: 10,
                                    backgroundColor: "whitesmoke",
                                    color: "black"
                                }}
                            >
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
            </div>
        );
    } else {
        return <p>Du måste vara inloggad för att se dokument.</p>;
    }
}

export default SingleDoc;

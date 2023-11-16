"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { editDocumentSchema } from "@/app/validationSchema";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSession } from "next-auth/react";

type Document = z.infer<typeof editDocumentSchema>;
function EditForm() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { status } = useSession();

    const [editDocument, setEditDocument] = useState<Document | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            if (id) {
                try {
                    const response = await axios.get(`/api/docs/${id}`);
                    setEditDocument(response.data);
                    setEditTitle(response.data.title);
                    setEditContent(response.data.content);
                    setIsPrivate(response.data.isPrivate);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    setError("Error fetching issue. Please try again later.");
                }
            } else {
                setError("Document ID not provided in the URL.");
                setLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setEditTitle(newTitle);
    };

    const handleContentChange = (value: string) => {
        setEditContent(value);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editTitle || !editContent) {
            console.error("Edit title or content is missing.");
            return;
        }

        try {
            const updatedAt = new Date().toLocaleString();
            await axios.put(
                `/api/docs/${id}`,
                {
                    title: editTitle,
                    content: editContent,
                    updatedAt,
                    isPrivate,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            window.location.href = "/documents";
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };
    if (status === "authenticated") {
        return (
            <div
                className="flex flex-col items-center justify-center"
                key={editDocument?.title}
            >
                <form onSubmit={handleEditSubmit}>
                    <label>
                        Rubrik:
                        <input value={editTitle} onChange={handleTitleChange} />
                    </label>
                    <br />
                    <ReactQuill
                        theme="snow"
                        className="flex flex-col items-center mt-4"
                        value={editContent || ""}
                        onChange={handleContentChange}
                    />

                    <div className="flex space-x-4 justify-center mb-4">
                        <div>
                            Privat:
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={() => setIsPrivate(!isPrivate)}
                            />
                        </div>
                        <br />
                        <button
                            className="flex justify-center w-40 hover:animate-pulse rounded-md shadow-md mb-2 hover:bg-accent2 dark:text-white"
                            type="submit"
                        >
                            Spara
                        </button>
                    </div>
                </form>
            </div>
        );
    } else {
        return <p>Du måste vara inloggad för att redigera dokument.</p>;
    }
}

export default EditForm;

"use client";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { createDocumentSchema } from "@/app/validationSchema";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateNewDocForm() {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const formData = {
                title,
                content,
                author: session?.user?.sub,
                isPrivate,
            };
            const validation = createDocumentSchema.safeParse(formData);

            if (!validation.success) {
                console.error(validation.error.errors);
                return;
            }

            const response = await axios.post("/api/docs", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = response.data;
                console.log("Document created:", data);
                setTitle("");
                setContent("");
                setIsPrivate(false);
                window.location.href = "/documents";
            } else {
                console.error("Error creating document:", response.data);
            }
        } catch (error) {
            console.error("Error creating document:", error);
        }
    };

    if (!session) {
        return <div>Du måste logga in för att skapa ett dokument.</div>;
    }

    if (status === "authenticated") {
        return (
            <>
                <form onSubmit={handleFormSubmit}>
                    <label className="welcome-title">
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <br />
                    <ReactQuill
                        theme="snow"
                        className=" flex flex-col items-center mt-4"
                        value={content}
                        onChange={setContent}
                    />
                    <br />
                    <label>
                        Private:
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={() => setIsPrivate(!isPrivate)}
                        />
                    </label>
                    <br />
                    <button className="create-btn">Create Document</button>
                </form>
            </>
        );
    }
}

export default CreateNewDocForm;

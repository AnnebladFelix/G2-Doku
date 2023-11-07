"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, FormEvent } from "react";
import { createDoc } from "../actions/docs/createDoc";
import { useSession } from "next-auth/react";

function CreateNewDocForm() {
    const router = useRouter();
    const { data: session } = useSession();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage("Skapar dokument...");
        if (session && session.user) {
            const author = session.user.email;

            const message = await createDoc(title, content, author!);
            setMessage(message);
        } else {
            setMessage("Användaren är inte autentiserad");
        }
    };

    useEffect(() => {
        if (message) {
            router.refresh();
            router.push("/documents");
        }
    }, [router, message]);

    return (
        <div className="text-black">
            <form className="flex gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Innehåll"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button className="text-white" onClick={handleSubmit}>
                    Skapa dokument
                </button>
            </form>
        </div>
    );
}

export default CreateNewDocForm;

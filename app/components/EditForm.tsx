"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { editDocumentSchema } from "@/app/validationSchema";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Document = z.infer<typeof editDocumentSchema>;

function EditForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/docs/${id}`);
          setEditDocument(response.data);
          setEditTitle(response.data.title);
          setEditContent(response.data.content);
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
      const updatedAt = new Date().toLocaleString(); // Anpassa detta beroende på hur du vill hantera tidsstämplar
      await axios.put(`/api/docs/${id}`, {
        title: editTitle,
        content: editContent,
        updatedAt,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.href = "/documents";
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <div key={editDocument?.title}>
      <form onSubmit={handleEditSubmit}>
        <label>
          Title:
          <input value={editTitle} onChange={handleTitleChange} />
        </label>
        <br />
        <ReactQuill
          theme="snow"
          className="flex flex-col items-center mt-4"
          value={editContent || ""}
          onChange={handleContentChange}
        />
        <br />
        <button className="dark:text-white" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditForm;

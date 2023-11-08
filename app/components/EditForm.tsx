"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { editDocumentSchema } from "@/app/validationSchema"
import { z } from "zod";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


type Document = z.infer<typeof editDocumentSchema>

function EditForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [editDocument, setEditDocument] = useState<Document | null>(null)
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/docs/${id}`);
          setEditDocument(response.data);
          setLoading(false);
          console.log(response.data);
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

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // onChange={setEditDocument}
  }

  return (
    <div key={editDocument?.title} >
      <form>
        <input value={editDocument?.title}/>
        <ReactQuill theme="snow" className=' flex flex-col items-center mt-4' value={editDocument?.content}  />
      </form>
    </div>
  );
}

export default EditForm;

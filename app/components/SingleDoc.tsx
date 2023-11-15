'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocumentSchema } from '@/app/validationSchema';
import { z } from "zod";
import axios from "axios";
import { useSession } from "next-auth/react";

type Document = z.infer<typeof getDocumentSchema>;

 function SingleDoc() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: session, status } = useSession();
  const [singleDocument, setSingleDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDocument = async () => {
        if(id){
          try {
            const response = await axios.get(`/api/docs/${id}`);
            setSingleDocument(response.data);
            setLoading(false);
          } catch (error) {
            setLoading(false);
            setError("Error fetching doc. Please try again later.");
          }
      } else {
          setError('Fel id')
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
    if(singleDocument){
      router.push(`/documents/editDoc?id=${singleDocument.id}`);
    }
  };

  const handleDelete = () => {
  }

  const isAuthor = status === "authenticated" && session?.user?.sub === singleDocument?.authorId;

  return (
    <div>
{singleDocument &&
<div>
      <h1 className="text-3xl">Titel: {singleDocument.title}</h1>
      <p dangerouslySetInnerHTML={{__html: singleDocument.content}}></p>
      <p>Skapad av: {singleDocument.author.name}</p>
      <p>Skapad:{formatDate(singleDocument.createdAt)}</p>
      <p>Ändrad: {formatDate(singleDocument.updatedAt)}</p>
      {isAuthor && (
            <>
              <button onClick={() => handleEdit()}>Redigera</button>
              <button onClick={() => handleDelete()}>Ta bort</button>
            </>
          )}
      </div>
      }
    </div>
  )
};

export default SingleDoc;

"use client";

import { useEffect, useState } from "react";
import { getDocumentSchema } from "@/app/validationSchema";
import z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Card, Table, TableHeader, TableRow } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

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

const GetAllDocsPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [error, setError] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(status ==="authenticated") {
                  const response = await axios.get("/api/docs");
                  setDocuments(response.data);
                }
            } catch (error) {
                setError("Error fetching documents or user data");
            }
        };
        fetchData();
    }, [status]);

    const handleClick = (document: Document) => {
      router.push(`/documents/singleDoc?id=${document.id}`);
  };

    const getAuthorName = (authorId: string) => {
        const user = documents.find((doc) => doc.author?.id === authorId);
        return user?.author.name || "Unknown Author";
    };

    const getMyDoc = () => {
        router.push(`/documents/myDoc`);
    }

    if (status === "authenticated") {
        return (
          
          <div className="flex flex-col items-center justify-center h-full">

              <div className="flex flex-col items-center h-full flex-grow rounded-lg bg-[#bcaa9a] p-4">
                <div>
                      <button className=" mb-2"  >Alla dokument</button>
                      <span className="mx-2 ">/</span>
                      <button className=" mb-2 " onClick={getMyDoc} >Mina dokument</button>

                </div>
                <Table.Root>
                  <Table.Header>
                      <Table.Row>
                          <Table.ColumnHeaderCell>Titel</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Författare</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Skapad</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Ändrad</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Favorit</Table.ColumnHeaderCell>
                      </Table.Row>
                  </Table.Header>
                  <Table.Body>
                      {documents.map((document) => (
                          <Table.Row  key={document.id}>
                              <Table.Cell className="max-w-[200px] px-4">
                                  <button onClick={() => handleClick(document)}>
                                      {document.title}
                                  </button>
                              </Table.Cell>
                              <Table.Cell >
                                <span style={{ padding: '0.25rem' }}>
                                  {getAuthorName(document.authorId)}
                                </span>
                              </Table.Cell>
                              <Table.Cell>
                                <span style={{ padding: '0.25rem' }}>
                                  {formatDate(document.createdAt)}
                                </span>
                              </Table.Cell>
                              <Table.Cell>
                                <span style={{ padding: '0.25rem' }}>
                                  {formatDate(document.updatedAt)}
                                </span>
                              </Table.Cell>
                          </Table.Row>
                      ))}
                  </Table.Body>
                </Table.Root>
              </div>
          </div>
        );
    }else{
      return (
        <p>Du måste vara inloggad för att se dokumenten.</p>
      )
    }
};
export default GetAllDocsPage;

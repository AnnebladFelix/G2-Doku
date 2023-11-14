'use client';

import { getDocumentSchema } from "@/app/validationSchema";
import { Table } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";

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
    const sessionAuthor = session?.user?.sub
    const [error, setError] = useState("");
    const [author, setAuthor] = useState("");
    const handleFlag = async (document: Document) => {
      console.log('click');
      try {
          await axios.post("/api/docs/", {
              documentId: document.id,
              userId: sessionAuthor,
          });

          // Update the UI to reflect the flagged status of the document
          setDocuments((prevDocuments) => {
              return prevDocuments.map((doc) => {
                  if (doc.id === document.id) {
                      return { ...doc, Flags: [{ flagged: 'FLAGGED' }] };
                  }
                  return doc;
              });
          });
      } catch (error) {
          setError("Error flagging document");
      }
  };

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(status ==="authenticated") {
                  const response = await axios.get("/api/user/" +sessionAuthor);
                  setDocuments(response.data.documents);
                  console.log(response)
                  setAuthor(response.data.name)    
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

    const getAllDoc = () => {
        router.push(`/documents`);
    }

    /*const getAuthorName = (authorId: string) => {
        const user = documents.find((doc) => doc.author?.id === authorId);
        return user?.author.name || "Unknown Author";
    };*/

    if (status === "authenticated") {
        return (
          
          <div className="flex flex-col items-center justify-center h-full">

              <div className="flex flex-col items-center h-full flex-grow rounded-lg bg-[#bcaa9a] p-4">
                <div>
                      <button className=" mb-2" onClick={getAllDoc} >Alla dokument</button>
                      <span className="mx-2 ">/</span>
                      <button className=" mb-2 "  >Mina dokument</button>

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
                                  {author}
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
                              <Table.Cell>
                                  <span style={{ padding: '0.25rem' }}>
                                      {document.flags && document.flags.length > 0 && document.flags[0].flagged === "FLAGGED" ? (
                                          <button onClick={() => handleFlag(document)}>Unflag</button>
                                      ) : (
                                          <button onClick={() => handleFlag(document)}>Flag</button>
                                      )}
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
}

export default MyDocPage
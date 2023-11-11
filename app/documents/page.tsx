'use client';

import { useEffect, useState } from 'react';
import { getDocumentSchema } from "../validationSchema"
import z from "zod";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Table } from '@radix-ui/themes';

type Document = z.infer<typeof getDocumentSchema>


const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formattedDate.replace(',', '');
};

const GetDocumentPage = () =>{
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState('')
  const router = useRouter();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/docs');
        setDocuments(response.data);
      } catch (error) {
        setError('Error fetching documents or user data');
      }
    };
    fetchData();
  },[]);

  const handleEdit = (document: Document) =>{
    router.push(`/documents/editDoc?id=${document.id}`);
  };
  const getAuthorName = (authorId: string) => {
    const user = documents.find((doc) => doc.author.id === authorId);
    return user?.author.name || 'Unknown Author';
  };
  

  return (
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
        <Table.Row key={document.id}>
          <Table.Cell><button onClick={() => handleEdit(document)}>{document.title}</button></Table.Cell>
          <Table.Cell>{getAuthorName(document.authorId)}</Table.Cell>
          <Table.Cell>{formatDate(document.createdAt)}</Table.Cell>
          <Table.Cell>{formatDate(document.updatedAt)}</Table.Cell>
          
        </Table.Row>
      ))}
    </Table.Body>

  </Table.Root>

  )

}
export default GetDocumentPage;
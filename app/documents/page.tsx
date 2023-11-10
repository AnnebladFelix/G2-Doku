'use client';

import { useEffect, useState } from 'react';
import { getDocumentSchema } from "../validationSchema"
import z from "zod";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Button, Card, Flex, Table } from '@radix-ui/themes';
import router from 'next/router';

type Document = z.infer<typeof getDocumentSchema>;

type User = {
  id: number;
  name: string;
  email: string;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', ''); // Remove the comma in the date string
};

const GetDocumentPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/docs');
        setDocuments(response.data);

        const authorIds = response.data.map((doc: Document) => doc.authorId);

        const usersPromises = authorIds.map((authorId: string) => axios.get(`/api/user`));
        const usersResponse = await Promise.all(usersPromises);
        const users = usersResponse.map((res) => res.data);
      } catch (error) {
        console.error('Error fetching documents or user data', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (document: Document) => {
    router.push(`/documents/editDoc?id=${document.id}`);
  };

  const getAuthorName = (authorId: string) => {
    const user = documents.find((doc) => doc.author.id === authorId);
    return user?.author.name || 'Unknown Author';
  };

  return (
    <Table.Root className='text-text ' >
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Titel</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Författare</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Skapad</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Ändrad</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {documents.map((document) => (
          <Table.Row className='text-text ' key={document.id}>
            <Table.Cell>
              <button onClick={() => handleEdit(document)}>{document.title}</button>
            </Table.Cell>
            <Table.Cell>{getAuthorName(document.authorId)}</Table.Cell>
            <Table.Cell>{formatDate(document.createdAt)}</Table.Cell>
            <Table.Cell>{formatDate(document.updatedAt)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default GetDocumentPage;

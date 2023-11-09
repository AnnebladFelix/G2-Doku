'use client';

import { useEffect, useState } from 'react';
import { getDocumentSchema } from "../validationSchema"
import z from "zod";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Button, Card, Flex, Table } from '@radix-ui/themes';

type Document = z.infer<typeof getDocumentSchema>

type User = {
  id: number;
  name: string;
  email: string;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formattedDate.replace(',', ''); // Remove the comma in the date string
};

const GetDocumentPage = () =>{
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState('')
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/docs');
        setDocuments(response.data);

        const authorIds = response.data.map((doc: Document) => doc.authorId);
        
        const usersPromises = authorIds.map((authorId) => axios.get(`/api/user/${authorId.name}`));
        // console.log("Users från:", authorIds);
        
        const usersResponse = await Promise.all(usersPromises);
        setUsers(usersResponse.map((res) => res.data));
        
      } catch (error) {
        setError('Error fetching documents or user data');
      }
    };

    /*const fetchUserDetails = async () => {
      const userPromises =  documents.map((doc) => axios.get(`/api/user/${doc.author}`));
      
      try {
        const userData = await Promise.all(userPromises);
        console.log(userData)
        setUsers(userData.map((res) => res.data));
      } catch (error) {
        setError('Error fetching user data');
      }
    }
    fetchUserDetails();*/
    fetchData();
  },[]);

  const handleEdit = (document: Document) =>{
    router.push(`/documents/editDoc?id=${document.id}`);
  };

  

  return (
    
    /*<div>
      <div className='my-3'><Button><Link href='/'> Back </Link></Button></div>
      <div className='flex flex-wrap justify-items-center gap-4'>
        {documents.map((document) => (
          <Flex className='dark:text-white' key={document.id} gap="3" direction="row">
            <Card onClick={(e) => {handleEdit(document)}}>
              <div className='my-3' >
                <h2>{document.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: document.content }} />

              </div>
            </Card>
          </Flex>

        ))}

      </div>
    </div>*/
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
      {documents.map((document, authorIds) => (
        <Table.Row key={document.id}>
          <Table.Cell><button onClick={() => handleEdit(document)}>{document.title}</button></Table.Cell>
          <Table.Cell>{authorIds}</Table.Cell>
          <Table.Cell>{formatDate(document.createdAt)}</Table.Cell>
          <Table.Cell>{formatDate(document.updatedAt)}</Table.Cell>
          
        </Table.Row>
      ))}
    </Table.Body>

  </Table.Root>

  )

}

export default GetDocumentPage;

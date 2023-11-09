'use client';

import { useEffect, useState } from 'react';
import { getDocumentSchema } from "../validationSchema"
import z from "zod";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Button, Card, Flex, Table } from '@radix-ui/themes';

type Document = z.infer<typeof getDocumentSchema>

const GetDocumentPage = () =>{
  const [documents, setDocuments] = useState<Document[]>([])  
  const [error, setError] = useState('')
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try{
        const response = await axios.get('/api/docs');
        setDocuments(response.data);
      }catch(error){
        setError('error fetching issues')
      }
    };
    fetchDocuments();

  },[])

  return (
    /*<div>
      <div className='my-3'><Button><Link href='/'> Back </Link></Button></div>
      <div className='flex flex-wrap justify-items-center gap-4'>
        {documents.map((document) => (
          <Flex className='dark:text-white' key={document.id} gap="3" direction="row">
            <Card >
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
      {documents.map((document) => (
        <Table.Row key={document.id}>
          <Table.Cell><button /*onClick={handleButtonClick}*/>{document.title}</button></Table.Cell>
          <Table.Cell>{document.author}</Table.Cell>
          <Table.Cell>{document.createdAt}</Table.Cell>
          <Table.Cell>{document.updatedAt}</Table.Cell>
          <Table.Cell>{document.author}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>

  </Table.Root>

  )

}

export default GetDocumentPage;

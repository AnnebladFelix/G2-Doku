'use client';

import { useEffect, useState } from 'react';
import { getDocumentSchema } from "../validationSchema"
import z from "zod";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Button, Card, Flex } from '@radix-ui/themes';

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
    <div>
      <div className='my-3'><Button><Link href='/'> Back </Link></Button></div>
      <div className='flex flex-wrap justify-items-center gap-4'>
        {documents.map((document) => (
          <Flex gap="3" direction="row">
            <Card key={document.id}>
              <div className='my-3' >
                <h2>{document.title}</h2>
                <p>{document.content}</p>

              </div>
            </Card>
          </Flex>
          
        ))}

      </div>
    </div>
  )

}

export default GetDocumentPage;

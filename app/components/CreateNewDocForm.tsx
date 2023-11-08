'use client'
import { FormEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { createDocumentSchema } from '@/app/validationSchema';

function CreateNewDocForm() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formData = { title, content, author: session?.user?.sub };
      const validation = createDocumentSchema.safeParse(formData);

      if (!validation.success) {
        console.error(validation.error.errors);
        return;
      }

      const response = await axios.post('/api/docs', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Document created:', data);
        setTitle('');
        setContent('');
      } else {
        console.error('Error creating document:', response.data);
      }
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  if (!session) {
    return <div>Please sign in to access this page.</div>;
  }

  if (status === 'authenticated') {
    return (
      <div>
        <h1>Welcome, {session.user?.email}!</h1>
        <form onSubmit={handleFormSubmit}>
          <label>
            Title:
            <input type="text" className='text-black' value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <br />
          <label>
            Content:
            <textarea className='text-black' value={content} onChange={(e) => setContent(e.target.value)} />
          </label>
          <br />
          <button type="submit">Create Document</button>
        </form>
      </div>
    );
  }
}

export default CreateNewDocForm;

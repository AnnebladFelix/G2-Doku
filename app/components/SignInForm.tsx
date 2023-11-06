'use client';
import { Spinner } from './Spinner';
import { useEffect, useState } from 'react'
import { signUp } from '../actions/users/signUp';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
    const router = useRouter();

    const {status} = useSession();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [message,setMessage] = useState('');

    const handleSubmit = async () => {
        setMessage("Signing in...");

        try {
            const signinResponse = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })
            if(!signinResponse || signinResponse.ok !== true) {
                setMessage("Invalid Credentials");
            } else {
                router.refresh();
            }
            
        } catch (err) {
            console.log(err);
        }

        setMessage(message);
    };

    useEffect(() => {
        if(status === 'authenticated') {
            router.refresh();
            router.push("/")
        }
    }, [status])

  return (
    <div className='flex flex-col gap-4 bg-gray-400 p-4'>
        <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>

        <button onClick={handleSubmit}>
            Sign In
        </button>
        <p>
            {message}
        </p>
    </div>
  );
};

export default SignInForm


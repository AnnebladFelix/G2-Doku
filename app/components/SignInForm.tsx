'use client';
import { Spinner } from './Spinner';
import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
    const router = useRouter();

    const {status} = useSession();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [message,setMessage] = useState('');
    const [loading,setLoading] = useState(false);

    const handleSubmit = async () => {
        setMessage("Signing in...");

        try {
            setLoading(true)
            const signinResponse = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (!signinResponse || signinResponse.ok !== true) {
                setMessage("Fel inloggning, vargod försök igen");
            } else {
                router.refresh();
            }

        } catch (err) {
            setLoading(false)
        }
    };

    useEffect(() => {
        if(status === 'authenticated') {
            router.refresh();
            router.push("/")
        }
    }, [router, status])

  return (
    <div className="flex justify-center">
        <div className="flex flex-col gap-4 bg-primary p-4 text-text">
        <input className="bg-secondary" type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Epost'/>
        <input className="bg-secondary" type='password' value={password} onChange={(e) => setPassword(e.target.value)}  placeholder='Lösenord'/>

        <button className="rounded-md shadow-md mb-2 hover:animate-pulse bg-accent2 hover:bg-accent2" onClick={handleSubmit} disabled={loading}>
            Logga in{loading && <Spinner />}
        </button>
        <p className="text-2xl text-accent">
            {message}
        </p>
    </div>
    </div>

  );
};

export default SignInForm
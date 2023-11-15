'use client';
import { Spinner } from './Spinner';
import { useEffect, useState } from 'react'
import { signUp } from '../actions/users/signUp';
import {useRouter} from 'next/navigation';

const SignUpForm = () => {

    const router = useRouter();
    
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [name,setName] = useState('')

    const [message,setMessage] = useState('')

    const handleSubmit = async () => {
        setMessage("Signing up...");
        const message = await signUp(email, password, name);
        setMessage(message);
    };
    
    useEffect(() => {
        if(message){
            router.refresh();
            router.push("/")
        }
    }, [router, message])
    
  return (
    <div className='flex flex-col gap-4 bg-gray-400 p-4 text-black'>
        <input type='name' value={name} placeholder="Namn" onChange={(e) => setName(e.target.value)}/>
        <input type='text' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type='password' placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)}/>

        <button onClick={handleSubmit}>
            Sign up
        </button>
        <p>
            {message}
        </p>
    </div>
  )
}

export default SignUpForm


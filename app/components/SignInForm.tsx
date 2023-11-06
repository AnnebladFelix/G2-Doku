'use client';
import { Spinner } from './Spinner';
import { useState } from 'react'
import { signUp } from '../actions/users/signUp';

const SignInForm = () => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const [message,setMessage] = useState('')

    const handleSubmit = async () => {
        setMessage("Signing in...");
        const message = await signUp(email, password);
        setMessage(message);
    };

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
  )
}

export default SignInForm


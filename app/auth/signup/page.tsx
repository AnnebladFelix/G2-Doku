import React from 'react'
import SignUpForm from '@/app/components/SignUpForm'

const SignUpPage = () => {
  return (
    <div className='flex flex-col'>
        <h1 className='text-3xl flex justify-center mb-5'>Skapa ny användare</h1>
        <SignUpForm />
    </div>

  )
}

export default SignUpPage
import React from 'react'
import SignUpForm from '@/app/components/SignUpForm'

const SignUpPage = () => {
  return (
    <div className='flex flex-col gap-4'>
        <h1 className='text-3xl'>Sign Up</h1>
        <SignUpForm />
    </div>
    
  )
}

export default SignUpPage
import React from 'react'
import SignInForm from '@/app/components/SignInForm'

const SignInPage = () => {
  return (
    <div className='flex flex-col gap-4'>
        <h1 className='text-3xl flex justify-center mb-5'>Logga in</h1>
        <SignInForm />
    </div>

  )
}

export default SignInPage
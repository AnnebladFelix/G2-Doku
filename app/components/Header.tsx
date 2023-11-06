import Link from 'next/link'

export default function Header() {
  return (
    <div className='flex gap-4 mt-4 text-xl'>
      <Link href='/auth/signin'>Logga in</Link>
      {/*Om admin är inloggad så visas denna länken*/}
      {/*admin&&<Link href='/auth/signup'>Registrera användare</Link>*/}
      <Link href='/auth/signout'>Logga ut</Link>
    </div>
  )
}

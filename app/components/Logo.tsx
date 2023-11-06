import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <section >
      <Link href='/'>
        <Image
        src="/Images/G2-dark-logo.png"
        width={150}
        height={0}
        alt='G2 Dokument Logo'
        priority={true}
        />
      </Link>
    </section>
  )
}

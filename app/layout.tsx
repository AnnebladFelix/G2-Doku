import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './components/Provider'
import Header from './components/Header'
import '@radix-ui/themes/styles.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'G2-Dookument',
  description: 'G2-dokument för dina dokument!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Header/>
          {children}
        </Provider>
      </body>
    </html>
  )
}

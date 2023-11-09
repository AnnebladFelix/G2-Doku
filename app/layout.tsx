import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './components/Provider'
import Header from './components/Header'
import '@radix-ui/themes/styles.css';
import { Theme, ThemePanel } from '@radix-ui/themes'

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
        <Theme appearance="dark" accentColor="gold" grayColor="mauve" radius="large">
          <Provider>
            <Header/>
            {children}
          </Provider>
          {/* Panel där man kan ändra tema */}
          {/* <ThemePanel></ThemePanel> */}
        </Theme>
      </body>
    </html>
  )
}

import './globals.css'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { Providers } from './providers'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata = {
  title: 'LMS Kampus - Learning Management System',
  description: 'Sistem Manajemen Pembelajaran untuk Kampus dan Sekolah',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmSerif.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

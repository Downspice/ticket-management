import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Awer | Ticket Manager',
  description: 'Ticket manager created by Joseph Awer', 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

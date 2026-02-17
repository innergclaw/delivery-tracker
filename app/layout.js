import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Delivery Tracker',
  description: 'Track your local delivery in real-time',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

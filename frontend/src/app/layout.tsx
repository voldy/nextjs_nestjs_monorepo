import React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSwitch } from '@/components/theme-switch'
import { TrpcProvider } from '@/components/providers/trpc-provider'
import { AuthButton } from '@/components/auth/user-button'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Next.js + NestJS Monorepo',
  description: 'Full-stack TypeScript monorepo with tRPC integration',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <TrpcProvider>
            <ThemeProvider>
              <div className="fixed top-4 right-4 z-50">
                <ThemeSwitch />
              </div>
              <header className="mb-8 flex w-full items-center justify-between border-b px-8 py-4">
                <span className="text-lg font-bold">My App</span>
                <AuthButton />
              </header>
              <main>{children}</main>
              <footer className="text-muted-foreground mt-8 w-full border-t px-8 py-4 text-center text-xs">
                &copy; {new Date().getFullYear()} My App. All rights reserved.
              </footer>
            </ThemeProvider>
          </TrpcProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

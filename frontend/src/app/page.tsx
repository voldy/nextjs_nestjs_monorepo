import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { BellRing, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { PingButton } from '@/components/ping-button'
import { HealthStatus } from '@/components/health-status'
import { AuthStatus } from '@/components/auth-status'

// Import from shared package
import { isBrowser } from '@shared'
import { FrontendEnv } from '../env'

const notifications = [
  {
    title: 'Your call has been confirmed.',
    description: '1 hour ago',
  },
  {
    title: 'You have a new message!',
    description: '1 hour ago',
  },
  {
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago',
  },
]

type CardProps = React.ComponentProps<typeof Card>

function CardDemo({ className, ...props }: CardProps) {
  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm leading-none font-medium">Push Notifications</p>
            <p className="text-muted-foreground text-sm">Send notifications to device.</p>
          </div>
          <Switch />
        </div>
        <div>
          {notifications.map((notification, index) => (
            <div key={index} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm leading-none font-medium">{notification.title}</p>
                <p className="text-muted-foreground text-sm">{notification.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />

        {/* Display shared package integration results */}
        <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Shared Package Integration Test</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Environment:</strong> {FrontendEnv.NODE_ENV}
            </p>
            <p>
              <strong>API URL:</strong> {FrontendEnv.API_URL}
            </p>
            <p>
              <strong>Is SSR:</strong> {(!isBrowser()).toString()}
            </p>
          </div>
        </div>

        {/* tRPC API Demo */}
        <div className="bg-card text-card-foreground w-full max-w-4xl rounded-lg border p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">tRPC API Integration</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            End-to-end type-safe API calls using{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-[family-name:var(--font-geist-mono)] font-semibold dark:bg-white/[.06]">
              AppRouter
            </code>{' '}
            types from the shared package.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Health Status */}
            <div className="flex flex-col items-center">
              <h4 className="text-md mb-4 font-medium">Health Check</h4>
              <HealthStatus />
            </div>

            {/* Ping Test */}
            <div className="flex flex-col items-center">
              <h4 className="text-md mb-4 font-medium">Ping Test</h4>
              <PingButton />
            </div>
          </div>
        </div>

        {/* Authentication Demo */}
        <div className="bg-card text-card-foreground w-full max-w-4xl rounded-lg border p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Authentication with Clerk</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Secure authentication and user management powered by Clerk.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Auth Status */}
            <div className="flex flex-col">
              <AuthStatus />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button variant="default">Go to Dashboard</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>

        <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm/6 sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{' '}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-[family-name:var(--font-geist-mono)] font-semibold dark:bg-white/[.06]">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
        </ol>

        <CardDemo />

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
            Deploy now
          </a>
          <a
            className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}

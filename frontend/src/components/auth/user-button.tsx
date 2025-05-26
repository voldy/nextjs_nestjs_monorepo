'use client'

import { UserButton, useUser, SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function AuthButton() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
  }

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />
  }

  return (
    <SignInButton mode="modal">
      <Button variant="outline" size="sm">
        Sign In
      </Button>
    </SignInButton>
  )
}

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Welcome back!</h2>

        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
          </p>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Last Sign In:</strong>{' '}
            {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>
    </div>
  )
}

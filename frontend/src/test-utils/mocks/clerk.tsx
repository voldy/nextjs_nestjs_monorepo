import React from 'react'

// Mock user data
const mockUser = {
  id: 'test-user-id',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  firstName: 'Test',
  lastName: 'User',
  imageUrl: 'https://example.com/avatar.jpg',
  lastSignInAt: new Date('2024-01-01'),
}

// Mock Clerk hooks
export const useUser = jest.fn(() => ({
  isSignedIn: true,
  user: mockUser,
  isLoaded: true,
}))

export const useAuth = jest.fn(() => ({
  isSignedIn: true,
  isLoaded: true,
  getToken: jest.fn().mockResolvedValue('mock-jwt-token'),
}))

// Mock Clerk components
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="clerk-provider">{children}</div>
}

export const UserButton = () => <div data-testid="user-button">User Button</div>

export const SignInButton = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="sign-in-button">{children}</div>
)

export const SignIn = () => <div data-testid="sign-in">Sign In Component</div>

export const SignUp = () => <div data-testid="sign-up">Sign Up Component</div>

// Mock server-side functions
export const currentUser = jest.fn().mockResolvedValue(mockUser)

// Helper to update mock state
export const setMockUserState = (state: { isSignedIn?: boolean; user?: any; isLoaded?: boolean }) => {
  useUser.mockReturnValue({
    isSignedIn: state.isSignedIn ?? true,
    user: state.user ?? mockUser,
    isLoaded: state.isLoaded ?? true,
  })

  useAuth.mockReturnValue({
    isSignedIn: state.isSignedIn ?? true,
    isLoaded: state.isLoaded ?? true,
    getToken: jest.fn().mockResolvedValue('mock-jwt-token'),
  })
}

// Reset mocks
export const resetClerkMocks = () => {
  setMockUserState({})
}

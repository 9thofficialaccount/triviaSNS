import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      displayName: string
      isAdmin: boolean
    }
  }

  interface User {
    id: string
    email: string
    username: string
    displayName: string
    isAdmin: boolean
    password?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    displayName: string
    isAdmin: boolean
  }
}

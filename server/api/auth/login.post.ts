/**
 * Email/password login handler
 * In production, this would validate against a database
 */

import { createError } from 'h3'

interface LoginBody {
  email: string
  password: string
}

// Demo users for development (in production, use a database)
const DEMO_USERS = [
  {
    id: 'demo-1',
    email: 'demo@vuecraft.dev',
    password: 'demo123',
    name: 'Demo User',
  },
]

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required',
    })
  }

  // Find user (demo implementation)
  const user = DEMO_USERS.find(
    (u) => u.email === body.email && u.password === body.password
  )

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

  // Set session
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: 'email',
      createdAt: Date.now(),
    },
    loggedInAt: Date.now(),
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: 'email',
      createdAt: Date.now(),
    },
  }
})

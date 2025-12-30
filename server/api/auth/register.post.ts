/**
 * Email/password registration handler
 * In production, this would store users in a database
 */

import { createError } from 'h3'

interface RegisterBody {
  email: string
  password: string
  name: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)

  if (!body.email || !body.password || !body.name) {
    throw createError({
      statusCode: 400,
      message: 'Email, password, and name are required',
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format',
    })
  }

  // Validate password strength
  if (body.password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters',
    })
  }

  // Create user (demo implementation - in production, store in database)
  const user = {
    id: `user-${Date.now()}`,
    email: body.email,
    name: body.name,
    provider: 'email' as const,
    createdAt: Date.now(),
  }

  // Set session
  await setUserSession(event, {
    user,
    loggedInAt: Date.now(),
  })

  return { user }
})

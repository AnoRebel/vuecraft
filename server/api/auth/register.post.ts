/**
 * Email/password registration handler
 */

import { createError } from 'h3'
import { findUserByEmail, createUser } from '~/server/utils/auth'

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

  // Check if user already exists
  const existingUser = findUserByEmail(body.email)
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Email already registered',
    })
  }

  // Create user
  const user = createUser({
    email: body.email,
    name: body.name,
    password: body.password,
    provider: 'email',
  })

  // Set session
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      createdAt: user.createdAt,
    },
    loggedInAt: Date.now(),
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      createdAt: user.createdAt,
    },
  }
})

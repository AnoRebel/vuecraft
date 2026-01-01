/**
 * Email/password login handler
 */

import { createError } from 'h3'
import { findUserByEmail } from '~/server/utils/auth'

interface LoginBody {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required',
    })
  }

  // Find user
  const user = findUserByEmail(body.email)

  if (!user || user.password !== body.password) {
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

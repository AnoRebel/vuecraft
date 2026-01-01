/**
 * WebAuthn Passkey Registration Handler
 * Uses nuxt-auth-utils defineWebAuthnRegisterEventHandler
 */

import {
  findUserByEmail,
  createUser,
  getCredentialsByEmail,
  storeCredential,
  storeChallenge,
  consumeChallenge,
} from '~/server/utils/auth'

export default defineWebAuthnRegisterEventHandler({
  // Store the challenge for later verification
  async storeChallenge(event, challenge, attemptId) {
    storeChallenge(attemptId, challenge)
  },

  // Retrieve and consume the challenge
  async getChallenge(event, attemptId) {
    const challenge = consumeChallenge(attemptId)
    if (!challenge) {
      throw createError({
        statusCode: 400,
        message: 'Challenge expired or not found. Please try again.',
      })
    }
    return challenge
  },

  // Validate the user during registration
  async validateUser(userBody, _event) {
    // userBody contains userName which is the email
    const email = userBody.userName as string

    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Email is required',
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid email format',
      })
    }

    return { userName: email }
  },

  // Get existing credentials for the user (excludeCredentials)
  async excludeCredentials(event, userName) {
    const credentials = getCredentialsByEmail(userName)
    return credentials.map((cred) => ({
      id: cred.id,
      transports: cred.transports ? (cred.transports.split(',') as AuthenticatorTransport[]) : [],
    }))
  },

  // Handle successful registration
  async onSuccess(event, { credential, user }) {
    // Find or create the user
    let dbUser = findUserByEmail(user.userName)

    if (!dbUser) {
      // Create new user
      dbUser = createUser({
        email: user.userName,
        name: user.userName.split('@')[0] || 'User', // Use email prefix as name
        provider: 'passkey',
      })
    }

    // Store the credential
    storeCredential({
      id: credential.id,
      userId: dbUser.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp ?? false,
      transports: credential.transports?.join(',') || '',
    })

    // Set the user session
    await setUserSession(event, {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        provider: 'passkey',
        createdAt: dbUser.createdAt,
      },
      loggedInAt: Date.now(),
    })
  },
})

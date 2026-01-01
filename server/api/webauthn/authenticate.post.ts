/**
 * WebAuthn Passkey Authentication Handler
 * Uses nuxt-auth-utils defineWebAuthnAuthenticateEventHandler
 */

import {
  findUserById,
  getCredentialsByEmail,
  getCredentialById,
  updateCredentialCounter,
  storeChallenge,
  consumeChallenge,
} from '~/server/utils/auth'

export default defineWebAuthnAuthenticateEventHandler({
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

  // Get allowed credentials for the user
  async allowCredentials(event, userName) {
    const credentials = getCredentialsByEmail(userName)

    if (!credentials.length) {
      throw createError({
        statusCode: 400,
        message: 'No passkey found for this email. Please register first.',
      })
    }

    return credentials.map((cred) => ({
      id: cred.id,
      transports: cred.transports ? (cred.transports.split(',') as AuthenticatorTransport[]) : [],
    }))
  },

  // Get a specific credential by ID
  async getCredential(event, credentialId) {
    const credential = getCredentialById(credentialId)

    if (!credential) {
      throw createError({
        statusCode: 400,
        message: 'Credential not found',
      })
    }

    return {
      id: credential.id,
      userId: credential.userId,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp,
      transports: credential.transports
        ? (credential.transports.split(',') as AuthenticatorTransport[])
        : [],
    }
  },

  // Handle successful authentication
  async onSuccess(event, { credential, authenticationInfo }) {
    // Get the user associated with this credential
    const dbCredential = getCredentialById(credential.id)
    if (!dbCredential) {
      throw createError({
        statusCode: 400,
        message: 'Credential not found',
      })
    }

    const user = findUserById(dbCredential.userId)
    if (!user) {
      throw createError({
        statusCode: 400,
        message: 'User not found',
      })
    }

    // Update the credential counter for replay attack protection
    updateCredentialCounter(credential.id, authenticationInfo.newCounter)

    // Set the user session
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: 'passkey',
        createdAt: user.createdAt,
      },
      loggedInAt: Date.now(),
    })
  },
})

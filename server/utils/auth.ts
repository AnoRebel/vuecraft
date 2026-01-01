/**
 * In-memory storage for users and WebAuthn credentials
 * In production, use a proper database like Drizzle with D1, PostgreSQL, etc.
 */

export interface User {
  id: string
  email: string
  name: string
  password?: string // For email/password auth
  provider: 'email' | 'google' | 'github' | 'passkey'
  createdAt: number
}

export interface WebAuthnCredential {
  id: string
  userId: string
  publicKey: string
  counter: number
  backedUp: boolean
  transports: string
}

// In-memory storage (demo only - use a database in production)
const users = new Map<string, User>()
const credentialsByUserId = new Map<string, WebAuthnCredential[]>()
const credentialsById = new Map<string, WebAuthnCredential>()
const challenges = new Map<string, string>()

// Seed with demo user
users.set('demo-1', {
  id: 'demo-1',
  email: 'demo@vuecraft.dev',
  name: 'Demo User',
  password: 'demo123',
  provider: 'email',
  createdAt: Date.now(),
})

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email === email) {
      return user
    }
  }
  return undefined
}

/**
 * Find user by ID
 */
export function findUserById(id: string): User | undefined {
  return users.get(id)
}

/**
 * Create a new user
 */
export function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const user: User = {
    ...data,
    id,
    createdAt: Date.now(),
  }
  users.set(id, user)
  return user
}

/**
 * Get credentials for a user by email
 */
export function getCredentialsByEmail(email: string): WebAuthnCredential[] {
  const user = findUserByEmail(email)
  if (!user) return []
  return credentialsByUserId.get(user.id) || []
}

/**
 * Get credential by ID
 */
export function getCredentialById(credentialId: string): WebAuthnCredential | undefined {
  return credentialsById.get(credentialId)
}

/**
 * Store a new credential
 */
export function storeCredential(credential: WebAuthnCredential): void {
  credentialsById.set(credential.id, credential)
  const userCredentials = credentialsByUserId.get(credential.userId) || []
  userCredentials.push(credential)
  credentialsByUserId.set(credential.userId, userCredentials)
}

/**
 * Update credential counter
 */
export function updateCredentialCounter(credentialId: string, counter: number): void {
  const credential = credentialsById.get(credentialId)
  if (credential) {
    credential.counter = counter
  }
}

/**
 * Store challenge for WebAuthn
 */
export function storeChallenge(attemptId: string, challenge: string): void {
  challenges.set(attemptId, challenge)
  // Auto-expire after 5 minutes
  setTimeout(() => challenges.delete(attemptId), 5 * 60 * 1000)
}

/**
 * Get and consume challenge
 */
export function consumeChallenge(attemptId: string): string | undefined {
  const challenge = challenges.get(attemptId)
  challenges.delete(attemptId)
  return challenge
}

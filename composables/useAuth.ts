/**
 * Authentication composable for Vuecraft
 * Wraps nuxt-auth-utils with WebAuthn support
 */

import { ref, computed, onMounted } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: 'google' | 'github' | 'email' | 'passkey'
  createdAt: number
}

// Global state for auth (shared across components)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  // Use nuxt-auth-utils composable for session management
  const { loggedIn, user, fetch: fetchSession, clear } = useUserSession()

  // WebAuthn support
  const webAuthn = useWebAuthn({
    registerEndpoint: '/api/webauthn/register',
    authenticateEndpoint: '/api/webauthn/authenticate',
  })

  /**
   * Is user logged in
   */
  const isLoggedIn = computed(() => loggedIn.value)

  /**
   * Current user
   */
  const currentUser = computed<User | null>(() => {
    if (!user.value) return null
    return {
      id: (user.value as Record<string, unknown>).id as string,
      email: (user.value as Record<string, unknown>).email as string,
      name: (user.value as Record<string, unknown>).name as string,
      avatar: (user.value as Record<string, unknown>).avatar as string | undefined,
      provider: (user.value as Record<string, unknown>).provider as User['provider'],
      createdAt: (user.value as Record<string, unknown>).createdAt as number,
    }
  })

  /**
   * Check if WebAuthn/Passkey is supported
   */
  const passkeySupported = ref(false)

  // Check passkey support on mount
  onMounted(async () => {
    if (
      typeof window !== 'undefined' &&
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    ) {
      try {
        passkeySupported.value =
          await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      } catch {
        passkeySupported.value = false
      }
    }
  })

  /**
   * Login with Google OAuth
   */
  async function loginWithGoogle(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = '/api/auth/google'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to login with Google'
      isLoading.value = false
    }
  }

  /**
   * Login with GitHub OAuth
   */
  async function loginWithGitHub(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // Redirect to GitHub OAuth endpoint
      window.location.href = '/api/auth/github'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to login with GitHub'
      isLoading.value = false
    }
  }

  /**
   * Login with email and password
   */
  async function loginWithEmail(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      // Refresh session
      await fetchSession()
      isLoading.value = false
      return true
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError.data?.message || 'Failed to login'
      isLoading.value = false
      return false
    }
  }

  /**
   * Register with email and password
   */
  async function registerWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password, name },
      })

      // Refresh session
      await fetchSession()
      isLoading.value = false
      return true
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError.data?.message || 'Failed to register'
      isLoading.value = false
      return false
    }
  }

  /**
   * Register a new passkey
   */
  async function registerPasskey(email: string): Promise<boolean> {
    if (!passkeySupported.value) {
      error.value = 'Passkeys are not supported on this device'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      await webAuthn.register({ userName: email })
      // Refresh session
      await fetchSession()
      isLoading.value = false
      return true
    } catch (err: unknown) {
      const webAuthnError = err as { data?: { message?: string }; message?: string }
      error.value = webAuthnError.data?.message || webAuthnError.message || 'Failed to register passkey'
      isLoading.value = false
      return false
    }
  }

  /**
   * Login with passkey
   */
  async function loginWithPasskey(email: string): Promise<boolean> {
    if (!passkeySupported.value) {
      error.value = 'Passkeys are not supported on this device'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      await webAuthn.authenticate(email)
      // Refresh session
      await fetchSession()
      isLoading.value = false
      return true
    } catch (err: unknown) {
      const webAuthnError = err as { data?: { message?: string }; message?: string }
      error.value = webAuthnError.data?.message || webAuthnError.message || 'Failed to authenticate with passkey'
      isLoading.value = false
      return false
    }
  }

  /**
   * Logout
   */
  async function logout(): Promise<void> {
    isLoading.value = true

    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await clear()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear error
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Get user initials for avatar fallback
   */
  function getUserInitials(): string {
    if (!currentUser.value?.name) return '?'
    return currentUser.value.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  /**
   * Get provider icon
   */
  function getProviderIcon(provider: User['provider']): string {
    switch (provider) {
      case 'google':
        return 'logos:google-icon'
      case 'github':
        return 'logos:github-icon'
      case 'email':
        return 'lucide:mail'
      case 'passkey':
        return 'lucide:key'
      default:
        return 'lucide:user'
    }
  }

  return {
    // State
    user: currentUser,
    isLoggedIn,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    passkeySupported,

    // Actions
    loginWithGoogle,
    loginWithGitHub,
    loginWithEmail,
    registerWithEmail,
    registerPasskey,
    loginWithPasskey,
    logout,
    fetchSession,
    clearError,

    // Utilities
    getUserInitials,
    getProviderIcon,
  }
}

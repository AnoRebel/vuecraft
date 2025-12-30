/**
 * Authentication composable for Vuecraft
 * Wraps nuxt-auth-utils with additional utilities
 */

import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: 'google' | 'github' | 'email'
  createdAt: number
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// For demo/development - stores auth state in memory
const authState = ref<AuthState>({
  user: null,
  isLoading: false,
  error: null,
})

export function useAuth() {
  /**
   * Current user
   */
  const user = computed(() => authState.value.user)

  /**
   * Is user logged in
   */
  const isLoggedIn = computed(() => authState.value.user !== null)

  /**
   * Is authentication loading
   */
  const isLoading = computed(() => authState.value.isLoading)

  /**
   * Current error
   */
  const error = computed(() => authState.value.error)

  /**
   * Login with Google OAuth
   */
  async function loginWithGoogle(): Promise<void> {
    authState.value.isLoading = true
    authState.value.error = null

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = '/api/auth/google'
    } catch (err) {
      authState.value.error = err instanceof Error ? err.message : 'Failed to login with Google'
      authState.value.isLoading = false
    }
  }

  /**
   * Login with GitHub OAuth
   */
  async function loginWithGitHub(): Promise<void> {
    authState.value.isLoading = true
    authState.value.error = null

    try {
      // Redirect to GitHub OAuth endpoint
      window.location.href = '/api/auth/github'
    } catch (err) {
      authState.value.error = err instanceof Error ? err.message : 'Failed to login with GitHub'
      authState.value.isLoading = false
    }
  }

  /**
   * Login with email and password
   */
  async function loginWithEmail(email: string, password: string): Promise<boolean> {
    authState.value.isLoading = true
    authState.value.error = null

    try {
      const response = await $fetch<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      authState.value.user = response.user
      authState.value.isLoading = false
      return true
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      authState.value.error = error.data?.message || 'Failed to login'
      authState.value.isLoading = false
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
    authState.value.isLoading = true
    authState.value.error = null

    try {
      const response = await $fetch<{ user: User }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, name },
      })

      authState.value.user = response.user
      authState.value.isLoading = false
      return true
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      authState.value.error = error.data?.message || 'Failed to register'
      authState.value.isLoading = false
      return false
    }
  }

  /**
   * Logout
   */
  async function logout(): Promise<void> {
    authState.value.isLoading = true

    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      authState.value.user = null
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      authState.value.isLoading = false
    }
  }

  /**
   * Fetch current session
   */
  async function fetchSession(): Promise<void> {
    authState.value.isLoading = true

    try {
      const response = await $fetch<{ user: User | null }>('/api/auth/session')
      authState.value.user = response.user
    } catch {
      authState.value.user = null
    } finally {
      authState.value.isLoading = false
    }
  }

  /**
   * Clear error
   */
  function clearError(): void {
    authState.value.error = null
  }

  /**
   * Get user initials for avatar fallback
   */
  function getUserInitials(): string {
    if (!authState.value.user?.name) return '?'
    return authState.value.user.name
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
      default:
        return 'lucide:user'
    }
  }

  return {
    // State
    user,
    isLoggedIn,
    isLoading,
    error,

    // Actions
    loginWithGoogle,
    loginWithGitHub,
    loginWithEmail,
    registerWithEmail,
    logout,
    fetchSession,
    clearError,

    // Utilities
    getUserInitials,
    getProviderIcon,
  }
}

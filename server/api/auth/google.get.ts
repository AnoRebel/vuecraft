/**
 * Google OAuth handler
 * Requires NUXT_OAUTH_GOOGLE_CLIENT_ID and NUXT_OAUTH_GOOGLE_CLIENT_SECRET env vars
 */

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile'],
  },
  async onSuccess(event, { user, tokens }) {
    // Set user session
    await setUserSession(event, {
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        avatar: user.picture,
        provider: 'google',
        createdAt: Date.now(),
      },
      loggedInAt: Date.now(),
    })

    // Redirect to home
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/?error=google_oauth_failed')
  },
})

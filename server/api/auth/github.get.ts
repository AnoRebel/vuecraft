/**
 * GitHub OAuth handler
 * Requires NUXT_OAUTH_GITHUB_CLIENT_ID and NUXT_OAUTH_GITHUB_CLIENT_SECRET env vars
 */

export default defineOAuthGitHubEventHandler({
  config: {
    scope: ['user:email'],
  },
  async onSuccess(event, { user }) {
    // Set user session
    await setUserSession(event, {
      user: {
        id: String(user.id),
        email: user.email || `${user.login}@github.com`,
        name: user.name || user.login,
        avatar: user.avatar_url,
        provider: 'github',
        createdAt: Date.now(),
      },
      loggedInAt: Date.now(),
    })

    // Redirect to home
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/?error=github_oauth_failed')
  },
})

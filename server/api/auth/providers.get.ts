/**
 * Reports which OAuth providers are configured, so the sign-in dialog only
 * offers options that can work.
 */
export default defineEventHandler(() => {
  const { oauth } = useRuntimeConfig()
  return {
    google: Boolean(oauth?.google?.clientId && oauth?.google?.clientSecret),
    github: Boolean(oauth?.github?.clientId && oauth?.github?.clientSecret),
  }
})

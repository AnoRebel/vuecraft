import VueDndKitPlugin from '@vue-dnd-kit/core'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDndKitPlugin)
})

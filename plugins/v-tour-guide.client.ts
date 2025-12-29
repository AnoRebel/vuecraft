import { TourGuideManager, TourGuideTooltip } from 'v-tour-guide'
import 'v-tour-guide/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('TourGuideManager', TourGuideManager)
  nuxtApp.vueApp.component('TourGuideTooltip', TourGuideTooltip)
})

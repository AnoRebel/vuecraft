export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el, binding) {
      el._clickOutside = (event: MouseEvent) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el._clickOutside)
    },
    unmounted(el) {
      document.removeEventListener('click', el._clickOutside)
    }
  })
})

export default defineAppConfig({
  icon: {
    // Inject icon CSS into Tailwind's base layer so size utilities
    // (size-4, h-3 w-3, ...) override the default 1em icon size
    cssLayer: 'base',
  },
})

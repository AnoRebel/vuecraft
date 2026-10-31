<script setup lang="ts">
import { computed } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { resolveTheme, primaryFontFamily } from '~/utils/themeTokens'

const { config } = useDesignSystem()
const fonts = computed(() => {
  const t = resolveTheme(config)
  return {
    sans: primaryFontFamily(t.fontSans) ?? 'System',
    heading: primaryFontFamily(t.fontHeading) ?? 'System',
    mono: primaryFontFamily(t.fontMono) ?? 'System',
  }
})
</script>

<template>
  <article class="mx-auto max-w-3xl space-y-6 p-4 @xl:p-10">
    <div class="flex flex-wrap gap-2 text-xs text-muted-foreground">
      <span class="rounded-md border px-2 py-1"
        >Heading: <b class="text-foreground">{{ fonts.heading }}</b></span
      >
      <span class="rounded-md border px-2 py-1"
        >Body: <b class="text-foreground">{{ fonts.sans }}</b></span
      >
      <span class="rounded-md border px-2 py-1"
        >Mono: <b class="text-foreground">{{ fonts.mono }}</b></span
      >
    </div>

    <h1 class="text-4xl font-extrabold tracking-tight @xl:text-5xl">The Joke Tax Chronicles</h1>
    <p class="text-xl text-muted-foreground">
      Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on
      his throne.
    </p>

    <h2 class="border-b pb-2 text-3xl font-semibold tracking-tight">The King's Plan</h2>
    <p>
      The king thought long and hard, and finally came up with
      <a href="#plan" class="font-medium text-primary underline underline-offset-4" @click.prevent
        >a brilliant plan</a
      >: he would tax the jokes in the kingdom.
    </p>
    <blockquote class="border-l-2 border-primary pl-6 italic">
      “After all,” he said, “everyone enjoys a good joke, so it's only fair that they should pay for
      the privilege.”
    </blockquote>

    <h3 class="text-2xl font-semibold tracking-tight">The Joke Tax</h3>
    <ul class="ml-6 list-disc space-y-2">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners: 20 gold coins</li>
    </ul>

    <h4 class="text-xl font-semibold tracking-tight">People stopped telling jokes</h4>
    <p>
      Install the theme with
      <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
        >npx shadcn-vue@latest init</code
      >
      and you're ready to go.
    </p>
    <pre
      class="overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm"
    ><code>export default defineNuxtConfig({
  modules: ['shadcn-nuxt'],
  css: ['~/assets/css/main.css'],
})</code></pre>

    <div class="overflow-x-auto rounded-lg border">
      <table class="w-full text-sm">
        <thead class="bg-muted/50">
          <tr>
            <th class="px-4 py-2 text-left font-medium">King's Treasury</th>
            <th class="px-4 py-2 text-left font-medium">People's happiness</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t">
            <td class="px-4 py-2">Empty</td>
            <td class="px-4 py-2">Overflowing</td>
          </tr>
          <tr class="border-t">
            <td class="px-4 py-2">Modest</td>
            <td class="px-4 py-2">Satisfied</td>
          </tr>
          <tr class="border-t">
            <td class="px-4 py-2">Full</td>
            <td class="px-4 py-2">Ecstatic</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="space-y-1">
      <p class="text-lg font-semibold">Are you absolutely sure?</p>
      <p class="text-sm font-medium leading-none">Email address</p>
      <p class="text-sm text-muted-foreground">Enter your email address.</p>
    </div>
  </article>
</template>

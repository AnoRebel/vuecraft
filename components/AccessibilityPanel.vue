<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAccessibilityChecker } from '~/composables/useAccessibilityChecker'

const {
  generateReport,
  getContrastBadgeClass,
  getScoreClass,
  formatRatio,
  getLevelLabel,
} = useAccessibilityChecker()

const report = ref<ReturnType<typeof generateReport> | null>(null)
const isLoading = ref(false)

async function runCheck() {
  isLoading.value = true
  // Small delay to let CSS variables update
  await new Promise((resolve) => setTimeout(resolve, 100))
  report.value = generateReport()
  isLoading.value = false
}

onMounted(() => {
  runCheck()
})

// Re-check when theme changes
defineExpose({ runCheck })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium">Accessibility Check</h3>
      <Button variant="outline" size="sm" :disabled="isLoading" @click="runCheck">
        <Icon v-if="isLoading" name="lucide:loader-2" class="h-4 w-4 mr-2 animate-spin" />
        <Icon v-else name="lucide:refresh-cw" class="h-4 w-4 mr-2" />
        Recheck
      </Button>
    </div>

    <div v-if="report" class="space-y-4">
      <!-- Score -->
      <div class="p-4 rounded-lg border bg-card">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Accessibility Score</span>
          <span class="text-2xl font-bold" :class="getScoreClass(report.score)">
            {{ report.score }}%
          </span>
        </div>
        <div class="mt-2 flex gap-4 text-xs">
          <span class="text-green-600 dark:text-green-400">
            {{ report.passCount }} passed
          </span>
          <span v-if="report.warningCount > 0" class="text-yellow-600 dark:text-yellow-400">
            {{ report.warningCount }} warnings
          </span>
          <span v-if="report.failCount > 0" class="text-red-600 dark:text-red-400">
            {{ report.failCount }} failed
          </span>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="report.issues.length > 0" class="space-y-2">
        <h4 class="text-xs font-medium text-muted-foreground uppercase">Issues</h4>
        <div
          v-for="issue in report.issues"
          :key="issue.pair.name"
          class="p-3 rounded-lg border bg-card"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ issue.pair.name }}</span>
            <span
              class="text-xs px-2 py-0.5 rounded"
              :class="getContrastBadgeClass(issue.result.level)"
            >
              {{ getLevelLabel(issue.result.level) }} ({{ formatRatio(issue.result.ratio) }})
            </span>
          </div>
          <p class="text-xs text-muted-foreground mt-1">{{ issue.pair.usage }}</p>
          <p v-if="issue.suggestion" class="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            {{ issue.suggestion }}
          </p>
          <div v-if="issue.suggestedColor" class="mt-2 flex items-center gap-2">
            <span class="text-xs text-muted-foreground">Suggested:</span>
            <code class="text-xs bg-muted px-1.5 py-0.5 rounded">{{ issue.suggestedColor }}</code>
          </div>
        </div>
      </div>

      <div v-else class="p-4 rounded-lg border bg-green-500/10 text-green-700 dark:text-green-300">
        <div class="flex items-center gap-2">
          <Icon name="lucide:check-circle" class="h-4 w-4" />
          <span class="text-sm">All color combinations meet WCAG AA standards!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  useAccessibilityChecker,
  type AccessibilityIssue,
} from '~/composables/useAccessibilityChecker'

const { generateReport, getContrastBadgeClass, getScoreClass, formatRatio, getLevelLabel } =
  useAccessibilityChecker()

const report = ref<ReturnType<typeof generateReport> | null>(null)
const isLoading = ref(false)
const appliedFixes = ref<Set<string>>(new Set())

async function runCheck() {
  isLoading.value = true
  appliedFixes.value.clear()
  // Small delay to let CSS variables update
  await new Promise((resolve) => setTimeout(resolve, 100))
  report.value = generateReport()
  isLoading.value = false
}

// Apply a single accessibility fix
function applyFix(issue: AccessibilityIssue) {
  if (!issue.suggestedColor || typeof document === 'undefined') return

  // Extract CSS variable name from the foreground var
  const match = issue.pair.foreground.match(/var\((--[\w-]+)\)/)
  if (!match?.[1]) return

  const varName = match[1]
  document.documentElement.style.setProperty(varName, issue.suggestedColor)
  appliedFixes.value.add(issue.pair.name)

  // Re-check after applying
  setTimeout(runCheck, 150)
}

// Apply all fixes at once
function applyAllFixes() {
  if (!report.value || typeof document === 'undefined') return

  for (const issue of report.value.issues) {
    if (issue.suggestedColor) {
      const match = issue.pair.foreground.match(/var\((--[\w-]+)\)/)
      if (match?.[1]) {
        document.documentElement.style.setProperty(match[1], issue.suggestedColor)
        appliedFixes.value.add(issue.pair.name)
      }
    }
  }

  // Re-check after applying all
  setTimeout(runCheck, 150)
}

// Reset a fix (remove the override) - available for future use
function _resetFix(issue: AccessibilityIssue) {
  if (typeof document === 'undefined') return

  const match = issue.pair.foreground.match(/var\((--[\w-]+)\)/)
  if (!match?.[1]) return

  document.documentElement.style.removeProperty(match[1])
  appliedFixes.value.delete(issue.pair.name)

  // Re-check after reset
  setTimeout(runCheck, 150)
}

// Reset all fixes
function resetAllFixes() {
  if (!report.value || typeof document === 'undefined') return

  for (const issue of report.value.issues) {
    const match = issue.pair.foreground.match(/var\((--[\w-]+)\)/)
    if (match?.[1]) {
      document.documentElement.style.removeProperty(match[1])
    }
  }
  appliedFixes.value.clear()

  // Re-check after reset
  setTimeout(runCheck, 150)
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
          <span class="text-green-600 dark:text-green-400"> {{ report.passCount }} passed </span>
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
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-medium text-muted-foreground uppercase">Issues</h4>
          <div class="flex gap-2">
            <Button
              v-if="appliedFixes.size > 0"
              variant="ghost"
              size="sm"
              class="h-6 px-2 text-xs"
              @click="resetAllFixes"
            >
              <Icon name="lucide:undo-2" class="h-3 w-3 mr-1" />
              Reset All
            </Button>
            <Button variant="outline" size="sm" class="h-6 px-2 text-xs" @click="applyAllFixes">
              <Icon name="lucide:wand-2" class="h-3 w-3 mr-1" />
              Fix All
            </Button>
          </div>
        </div>
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
          <div v-if="issue.suggestedColor" class="mt-2 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground">Suggested:</span>
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded">{{ issue.suggestedColor }}</code>
            </div>
            <Button variant="outline" size="sm" class="h-6 px-2 text-xs" @click="applyFix(issue)">
              <Icon name="lucide:check" class="h-3 w-3 mr-1" />
              Apply
            </Button>
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

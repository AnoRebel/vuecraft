<script setup lang="ts">
import { computed } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { PREVIEW_ICONS, type PreviewIconName } from '~/config/previewIcons'

const props = defineProps<{ name: PreviewIconName }>()

const { config } = useDesignSystem()

const iconName = computed(() => PREVIEW_ICONS[props.name][config.icons.library])
</script>

<template>
  <Icon :name="iconName" mode="svg" class="vc-icon shrink-0" aria-hidden="true" />
</template>

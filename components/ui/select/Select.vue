<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '~/lib/utils'

interface Option {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface Props {
  class?: string
  modelValue?: string
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Select an option',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLButtonElement>()

const selectedOption = computed(() => props.options.find((opt) => opt.value === props.modelValue))

function toggle() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function select(option: Option) {
  if (!option.disabled) {
    emit('update:modelValue', option.value)
    isOpen.value = false
  }
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <div v-click-outside="close" class="relative">
    <button
      ref="triggerRef"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :disabled="disabled"
      :class="
        cn(
          'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          props.class
        )
      "
      @click="toggle"
    >
      <span :class="{ 'text-muted-foreground': !selectedOption }">
        {{ selectedOption?.label ?? placeholder }}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="opacity-50"
        :class="{ 'rotate-180': isOpen }"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <div
          v-for="option in options"
          :key="option.value"
          role="option"
          :aria-selected="option.value === modelValue"
          :class="
            cn(
              'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
              { 'bg-accent': option.value === modelValue },
              { 'opacity-50 cursor-not-allowed': option.disabled }
            )
          "
          @click="select(option)"
        >
          <span>{{ option.label }}</span>
          <span
            v-if="option.value === modelValue"
            class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

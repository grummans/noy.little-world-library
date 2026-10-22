<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Check, ChevronDown } from 'lucide-vue-next'

interface FilterOption {
  value: string
  label: string
}

const props = defineProps<{
  id: string
  label: string
  modelValue: string
  options: FilterOption[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const open = ref(false)

const selectedIndex = computed(() =>
  Math.max(
    0,
    props.options.findIndex((option) => option.value === props.modelValue),
  ),
)

const selectedLabel = computed(
  () => props.options.find((option) => option.value === props.modelValue)?.label ?? '',
)

const optionId = (index: number) => `${props.id}-option-${index}`

const focusOption = (index: number) => {
  const buttons = menu.value?.querySelectorAll<HTMLButtonElement>('.filter-option')
  buttons?.[index]?.focus()
}

const openMenu = async () => {
  if (open.value) return
  open.value = true
  await nextTick()
  focusOption(selectedIndex.value)
}

const closeMenu = (returnFocus = false) => {
  open.value = false
  if (returnFocus) trigger.value?.focus()
}

const toggleMenu = () => {
  if (open.value) closeMenu(true)
  else void openMenu()
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
  closeMenu(true)
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    void openMenu()
  }
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    closeMenu(true)
  }
}

const onOptionKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusOption((index + 1) % props.options.length)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusOption((index - 1 + props.options.length) % props.options.length)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusOption(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusOption(props.options.length - 1)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  } else if (event.key === 'Tab') {
    closeMenu()
  }
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!open.value) return
  if (!root.value?.contains(event.target as Node)) closeMenu()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<template>
  <div
    ref="root"
    class="filter-wrap"
    :class="{ 'filter-wrap--open': open }"
  >
    <button
      :id="id"
      ref="trigger"
      type="button"
      class="filter"
      :aria-label="`${label}: ${selectedLabel}`"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="`${id}-menu`"
      @click="toggleMenu"
      @keydown="onTriggerKeydown"
    >
      <span class="filter__text">
        <span class="filter__label">{{ label }}</span>
        <span class="filter__value">{{ selectedLabel }}</span>
      </span>
      <ChevronDown class="filter__chevron" :size="20" aria-hidden="true" />
    </button>

    <div
      v-if="open"
      :id="`${id}-menu`"
      ref="menu"
      class="filter-menu"
      role="listbox"
      :aria-label="label"
    >
      <button
        v-for="(option, index) in options"
        :id="optionId(index)"
        :key="option.value"
        type="button"
        class="filter-option"
        :class="{ 'filter-option--selected': option.value === modelValue }"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="selectOption(option.value)"
        @keydown="onOptionKeydown($event, index)"
      >
        <span>{{ option.label }}</span>
        <Check
          v-if="option.value === modelValue"
          class="filter-option__check"
          :size="16"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

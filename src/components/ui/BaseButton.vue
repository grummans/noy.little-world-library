<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to?: string
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'md' | 'lg'
  }>(),
  { to: undefined, variant: 'primary', size: 'lg' },
)

const classes = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes"><slot /></RouterLink>
  <button v-else type="button" :class="classes"><slot /></button>
</template>

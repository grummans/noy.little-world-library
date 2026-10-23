<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <footer class="app-footer">
    <span class="app-footer__strong">Little Wonder Library</span>
    <span>Cùng bé đọc, cùng bé khám phá.</span>
    <span class="app-footer__strong">{{ label }}</span>
  </footer>
</template>

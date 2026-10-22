<script setup lang="ts">
import AppHeader from '../components/app/AppHeader.vue'

defineProps<{ title: string }>()
</script>

<template>
  <div class="soon-page">
    <AppHeader variant="overlay" contrast="dark" />
    <main class="soon">
      <h1>{{ title }}</h1>
      <p>Nội dung đang được hoàn thiện.</p>
      <RouterLink to="/">Về trang chủ</RouterLink>
    </main>
  </div>
</template>

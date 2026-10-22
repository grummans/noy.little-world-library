<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ name: string; image: string; to: string }>()
</script>
<template><RouterLink class="topic" :to="to"><img :src="image" :alt="`Chủ đề ${name}`" /><span>{{ name }}</span></RouterLink></template>

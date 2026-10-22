<script setup lang="ts">
import BookCard from './BookCard.vue'
import type { Book } from '../../data/books'

withDefaults(
  defineProps<{
    books: Book[]
    variant?: 'featured' | 'library'
  }>(),
  { variant: 'featured' },
)
</script>

<template>
  <div class="book-grid" :class="`book-grid--${variant}`">
    <BookCard
      v-for="book in books"
      :key="book.slug"
      :book="book"
      :variant="variant"
    />
  </div>
</template>

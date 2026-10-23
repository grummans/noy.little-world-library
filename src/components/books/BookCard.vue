<script setup lang="ts">
import { RouterLink } from "vue-router";
import { formatPrice, type Book } from "../../data/books";

withDefaults(
  defineProps<{
    book: Book;
    variant?: "featured" | "library";
  }>(),
  { variant: "featured" },
);
</script>

<template>
  <RouterLink
    class="book"
    :class="`book--${variant}`"
    :to="`/books/${book.slug}`"
  >
    <img
      class="book__cover"
      :src="book.cover"
      :alt="`Bìa truyện ${book.title}`"
    />
    <div class="book__text">
      <h3>{{ book.title }}</h3>
      <p>
        {{ book.category }} <span aria-hidden="true">•</span>
        {{ book.ageRange }}
      </p>
    </div>
    <span v-if="!book.isFree" class="book__price">{{ formatPrice(book) }}</span>
    <span v-else-if="variant === 'featured' && book.hasAudio" class="audio"
      >🔊 Có âm thanh</span
    >
  </RouterLink>
</template>

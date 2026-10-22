<script setup lang="ts">
import AppHeader from '../components/app/AppHeader.vue'
import BookGrid from '../components/books/BookGrid.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import TopicCard from '../components/ui/TopicCard.vue'
import { books } from '../data/books'
import { categories } from '../data/categories'
</script>
<template>
  <main class="home">
    <section class="hero" aria-labelledby="home-title"><img class="hero__image" src="/images/homepage-hero.png" alt="Chú thỏ đọc sách giữa khu vườn kỳ diệu" /><div class="hero__wash"></div><AppHeader /><div class="hero__copy"><p class="eyebrow">✦&nbsp; THƯ VIỆN TRUYỆN TƯƠNG TÁC CHO BÉ &nbsp;✦</p><h1 id="home-title">Mở sách ra,<br /><em>phiêu lưu thôi!</em></h1><p>Những câu chuyện kỳ diệu, âm thanh vui nhộn và thế giới nhỏ xinh đang chờ bé khám phá.</p><div class="hero__buttons"><BaseButton to="/library">Khám phá thư viện</BaseButton><BaseButton to="/admin" variant="secondary">Dành cho người lớn</BaseButton></div></div></section>
    <section class="topics" aria-label="Khám phá theo chủ đề"><TopicCard v-for="category in categories" :key="category.slug" :name="category.name" :image="category.image" :to="`/library?category=${category.slug}`" /></section>
    <section class="content" aria-labelledby="fav-title"><div class="section-title"><h2 id="fav-title">Những câu chuyện bé yêu thích</h2><p>Đọc tiếp hoặc khám phá một cuốn mới</p></div><BookGrid :books="books.slice(0, 4)" /></section>
    <aside class="adult content"><span aria-hidden="true">👩‍🏫</span><div><h2>Bạn là phụ huynh hoặc giáo viên?</h2><p>Tìm mục tiêu giáo dục, câu hỏi gợi mở và hoạt động sau khi đọc.</p></div><BaseButton to="/admin" variant="secondary">Khám phá góc người lớn</BaseButton></aside>
  </main>
</template>

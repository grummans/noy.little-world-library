<script setup lang="ts">
import { Heart, Sparkles } from 'lucide-vue-next'
import AppHeader from '../components/app/AppHeader.vue'

const authors = ['Trương Thu Huyền', 'Dương Hoài Thương', 'Bùi Thị Thanh Thảo', 'Vũ Kiều Anh']
</script>

<template>
  <div class="about-page">
    <AppHeader variant="overlay" contrast="dark" />

    <main class="about-shell">
      <section class="about-hero" aria-labelledby="about-title">
        <div class="about-hero__copy">
          <span class="about-eyebrow"><Sparkles :size="17" aria-hidden="true" /> Về Little Wonder Library</span>
          <h1 id="about-title">Những trang sách nhỏ, những điều kỳ diệu thật to</h1>
          <p>
            Little Wonder Library là góc đọc sách dịu dàng dành cho các bé, nơi mỗi câu chuyện
            mở ra niềm vui khám phá, lắng nghe và lớn lên mỗi ngày.
          </p>
        </div>
        <div class="about-hero__art" aria-hidden="true">
          <span>✦</span><span>♥</span><span>✿</span>
          <div class="about-hero__book">Little<br />Wonder</div>
        </div>
      </section>

      <section class="about-authors" aria-labelledby="authors-title">
        <div class="about-section-heading">
          <span class="about-section-heading__icon"><Heart :size="20" fill="currentColor" aria-hidden="true" /></span>
          <div>
            <h2 id="authors-title">Nhóm tác giả</h2>
            <p>Những người cùng chăm chút cho thư viện sách nhỏ xinh này.</p>
          </div>
        </div>
        <ul class="author-list">
          <li v-for="(author, index) in authors" :key="author" class="author-card">
            <span class="author-card__number">0{{ index + 1 }}</span>
            <h3>{{ author }}</h3>
            <span class="author-card__sparkle" aria-hidden="true">✦</span>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

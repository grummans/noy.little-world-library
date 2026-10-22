<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowLeft, BookOpen, Heart, Palette, Play, Volume2 } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '../components/app/AppHeader.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { books } from '../data/books'
import { categories } from '../data/categories'

const route = useRoute()
const savedBooks = ref<string[]>([])
const storageKey = 'little-wonder-saved-books'

const book = computed(() =>
  books.find((entry) => entry.slug === route.params.slug && entry.published),
)
const isSaved = computed(() => Boolean(book.value && savedBooks.value.includes(book.value.slug)))
const categorySlug = computed(() =>
  categories.find((category) => category.name === book.value?.category)?.slug,
)

const toggleSaved = () => {
  if (!book.value) return

  const slug = book.value.slug
  savedBooks.value = isSaved.value
    ? savedBooks.value.filter((savedSlug) => savedSlug !== slug)
    : [...savedBooks.value, slug]
}

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (Array.isArray(stored) && stored.every((item) => typeof item === 'string')) {
      savedBooks.value = stored
    }
  } catch {
    savedBooks.value = []
  }
})

watch(savedBooks, (value) => localStorage.setItem(storageKey, JSON.stringify(value)), { deep: true })
</script>

<template>
  <div class="detail-page">
    <AppHeader variant="overlay" contrast="dark" />

    <main v-if="book" class="detail-content">
      <nav class="breadcrumbs" aria-label="Đường dẫn">
        <RouterLink to="/library">Thư viện sách</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink :to="categorySlug ? `/library?category=${categorySlug}` : '/library'">
          {{ book.category }}
        </RouterLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ book.title }}</span>
      </nav>

      <section class="detail-hero" :aria-labelledby="`book-${book.slug}`">
        <div class="detail-cover-wrap">
          <img class="detail-cover" :src="book.cover" :alt="`Bìa sách ${book.title}`" />
        </div>

        <div class="detail-copy">
          <p class="detail-format">SÁCH EPUB · BOOK CREATOR</p>
          <h1 :id="`book-${book.slug}`">{{ book.title }}</h1>
          <p class="detail-author">Thư viện Little Wonder</p>
          <p class="detail-description">{{ book.description }}</p>

          <ul class="detail-tags" aria-label="Thông tin sách">
            <li class="detail-tag detail-tag--butter">{{ book.ageRange }}</li>
            <li v-if="book.hasAudio" class="detail-tag detail-tag--sky"><Volume2 :size="15" /> Âm thanh</li>
            <li class="detail-tag detail-tag--mint"><BookOpen :size="15" /> EPUB</li>
            <li class="detail-tag detail-tag--butter"><Palette :size="15" /> Minh họa</li>
          </ul>

          <div class="detail-actions">
            <BaseButton :to="`/read/${book.slug}`" class="detail-read">
              <Play :size="18" fill="currentColor" /> Đọc sách ngay
            </BaseButton>
            <button
              type="button"
              class="detail-save"
              :aria-pressed="isSaved"
              @click="toggleSaved"
            >
              <Heart :size="18" :fill="isSaved ? 'currentColor' : 'none'" />
              {{ isSaved ? 'Đã lưu vào tủ sách' : 'Lưu tủ sách' }}
            </button>
          </div>

          <p class="detail-note">Sách mẫu thực tế · Định dạng trang cố định · Hỗ trợ media tích hợp</p>
        </div>
      </section>

      <section class="detail-guidance" aria-labelledby="guidance-title">
        <h2 id="guidance-title">Gợi ý cùng con khám phá</h2>
        <p>Hãy trò chuyện cùng bé về những điều con đã thấy trong sách và khuyến khích bé kể lại theo cách của mình.</p>
        <ul>
          <li v-for="objective in book.learningObjectives" :key="objective">{{ objective }}</li>
        </ul>
        <p class="detail-guidance__note">Phụ huynh có thể quản lý quyền truy cập, sách đã mua và tiến độ đọc trong khu vực riêng.</p>
      </section>
    </main>

    <main v-else class="detail-missing">
      <h1>Không tìm thấy cuốn sách này</h1>
      <p>Cuốn sách có thể đã được di chuyển hoặc chưa được xuất bản.</p>
      <BaseButton to="/library" variant="secondary"><ArrowLeft :size="18" /> Về thư viện</BaseButton>
    </main>
  </div>
</template>

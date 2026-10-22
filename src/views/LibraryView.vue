<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SearchX } from 'lucide-vue-next'
import AppHeader from '../components/app/AppHeader.vue'
import BookFilters from '../components/books/BookFilters.vue'
import BookGrid from '../components/books/BookGrid.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { categories } from '../data/categories'
import {
  createLibraryFilters,
  filterBooks,
  type LibraryFilters,
} from '../composables/useBooks'

const route = useRoute()
const router = useRouter()

const categoryFromQuery = () => {
  const slug = typeof route.query.category === 'string' ? route.query.category : ''
  return categories.find((category) => category.slug === slug)?.name ?? 'all'
}

const filters = ref<LibraryFilters>(createLibraryFilters(categoryFromQuery()))
const visibleCount = ref(4)

const filteredBooks = computed(() => filterBooks(filters.value))
const visibleBooks = computed(() => filteredBooks.value.slice(0, visibleCount.value))
const hasMore = computed(() => filteredBooks.value.length > visibleCount.value)

const updateFilters = (value: LibraryFilters) => {
  const categoryChanged = value.category !== filters.value.category
  filters.value = value

  if (!categoryChanged) return

  const slug =
    value.category === 'all'
      ? undefined
      : categories.find((category) => category.name === value.category)?.slug
  const query = { ...route.query }

  if (slug) query.category = slug
  else delete query.category

  void router.replace({ query })
}

const resetFilters = () => {
  filters.value = createLibraryFilters()
  const query = { ...route.query }
  delete query.category
  void router.replace({ query })
}

watch(
  () => route.query.category,
  () => {
    const category = categoryFromQuery()
    if (category !== filters.value.category) {
      filters.value = { ...filters.value, category }
    }
  },
)
</script>

<template>
  <div class="library-page">
    <AppHeader variant="overlay" contrast="dark" />

    <main class="library-content">
      <section class="library-section" aria-labelledby="library-title">
        <div class="library-heading">
          <div>
            <h1 id="library-title">Một thế giới sách nhỏ xinh</h1>
            <p>Chọn một cuốn sách để xem nội dung và bắt đầu đọc</p>
          </div>
          <BaseButton
            v-if="hasMore"
            variant="secondary"
            @click="visibleCount += 4"
          >
            Xem thêm
          </BaseButton>
        </div>

        <BookFilters
          :model-value="filters"
          :categories="categories"
          @update:model-value="updateFilters"
          @reset="resetFilters"
        />

        <p class="sr-only" aria-live="polite">
          {{ filteredBooks.length }} cuốn sách phù hợp
        </p>

        <BookGrid
          v-if="visibleBooks.length"
          :books="visibleBooks"
          variant="library"
        />

        <div v-else class="library-empty">
          <span class="library-empty__icon" aria-hidden="true">
            <SearchX :size="38" />
          </span>
          <h2>Chưa tìm thấy cuốn sách nào</h2>
          <p>Thử một từ khóa khác hoặc đặt lại bộ lọc để xem tất cả truyện nhé.</p>
          <BaseButton variant="secondary" @click="resetFilters">
            Đặt lại bộ lọc
          </BaseButton>
        </div>
      </section>

      <aside class="adult-banner" aria-labelledby="adult-title">
        <div class="adult-banner__content">
          <p class="adult-banner__eyebrow">DÀNH CHO PHỤ HUYNH &amp; GIÁO VIÊN</p>
          <h2 id="adult-title">Đồng hành cùng mỗi hành trình đọc của bé</h2>
          <p>Quản lý tủ sách, độ tuổi phù hợp và quyền truy cập nội dung trả phí.</p>
          <BaseButton to="/admin">Quản lý tủ sách <span aria-hidden="true">→</span></BaseButton>
        </div>
        <div class="adult-banner__art" aria-hidden="true">
          <span class="flower">
            <i v-for="petal in 5" :key="petal" />
          </span>
        </div>
      </aside>
    </main>
  </div>
</template>

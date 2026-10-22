<script setup lang="ts">
import { computed } from 'vue'
import { RotateCcw, Search } from 'lucide-vue-next'
import FilterSelect from '../ui/FilterSelect.vue'
import type { LibraryFilters } from '../../composables/useBooks'
import type { Category } from '../../data/categories'

const props = defineProps<{
  modelValue: LibraryFilters
  categories: Category[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LibraryFilters]
  reset: []
}>()

const categoryOptions = computed(() => [
  { value: 'all', label: 'Tất cả' },
  ...props.categories.map((category) => ({
    value: category.name,
    label: category.name,
  })),
])

const ageOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: '3-4', label: '3–4 tuổi' },
  { value: '4-5', label: '4–5 tuổi' },
  { value: '5-6', label: '5–6 tuổi' },
]

const optionOptions = [
  { value: 'free-audio', label: 'Miễn phí · Có âm thanh' },
  { value: 'free', label: 'Miễn phí' },
  { value: 'audio', label: 'Có âm thanh' },
  { value: 'all', label: 'Tất cả sách' },
]

const update = <Key extends keyof LibraryFilters>(key: Key, value: LibraryFilters[Key]) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="book-filters" role="search" aria-label="Tìm và lọc sách">
    <label class="search-field">
      <Search class="search-field__icon" :size="20" aria-hidden="true" />
      <span class="sr-only">Tìm tên sách, chủ đề hoặc từ khóa</span>
      <input
        :value="modelValue.search"
        type="search"
        placeholder="Tìm tên sách, chủ đề hoặc từ khóa..."
        autocomplete="off"
        @input="update('search', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <FilterSelect
      id="filter-category"
      class="filter--category"
      label="Chủ đề"
      :model-value="modelValue.category"
      :options="categoryOptions"
      @update:model-value="update('category', $event)"
    />

    <FilterSelect
      id="filter-age"
      class="filter--age"
      label="Lứa tuổi"
      :model-value="modelValue.age"
      :options="ageOptions"
      @update:model-value="update('age', $event)"
    />

    <FilterSelect
      id="filter-option"
      class="filter--options"
      label="Tùy chọn"
      :model-value="modelValue.option"
      :options="optionOptions"
      @update:model-value="update('option', $event)"
    />

    <button type="button" class="filter-reset" @click="emit('reset')">
      <span>Đặt lại bộ lọc</span>
      <RotateCcw :size="17" aria-hidden="true" />
    </button>
  </div>
</template>

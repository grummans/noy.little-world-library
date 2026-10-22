<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Expand, LoaderCircle, Volume2, Video } from 'lucide-vue-next'
import AppHeader from '../components/app/AppHeader.vue'
import { books, type Book } from '../data/books'

type FoliateViewElement = HTMLElement & {
  book?: {
    sections?: Array<{ resolveHref?: (href: string) => string }>
    transformTarget?: EventTarget
    loadBlob?: (href: string) => Promise<Blob>
  }
  open: (source: string) => Promise<void>
  init: (options: { showTextStart: boolean }) => Promise<void>
  close: () => void
  goLeft: () => Promise<void>
  goRight: () => Promise<void>
}

const route = useRoute()
const readerMount = ref<HTMLElement>()
const readerFrame = ref<HTMLElement>()
const reader = ref<FoliateViewElement>()
const isLoading = ref(true)
const errorMessage = ref('')
const currentPage = ref(1)
const pageCount = ref(0)
const isFullscreen = ref(false)
let currentAudio: HTMLAudioElement | undefined
let currentAudioUrl: string | undefined

const book = computed<Book | undefined>(() =>
  books.find((item) => item.slug === route.params.slug && item.published),
)

const pageLabel = computed(() =>
  pageCount.value ? `Trang ${currentPage.value} / ${pageCount.value}` : 'Đang tải trang sách',
)

function updateLocation(event: Event) {
  const location = (event as CustomEvent<{ section?: { current?: number } }>).detail
  if (typeof location?.section?.current === 'number') {
    currentPage.value = location.section.current
  }
}

function removeBookScripts(event: Event) {
  const resource = (event as CustomEvent<{ data?: unknown; type?: string }>).detail
  const type = resource.type?.toLowerCase() ?? ''
  if (type.includes('javascript') || type.includes('ecmascript')) {
    resource.data = ''
    return
  }

  resource.data = Promise.resolve(resource.data).then(async (data) => {
    const source = data instanceof Blob ? await data.text() : data
    if (typeof source !== 'string' || !/(xhtml|html|xml)/.test(type)) return data
    const safeMarkup = source
      .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
      .replace(/<script\b[^>]*\/\s*>/gi, '')
    return data instanceof Blob ? new Blob([safeMarkup], { type: data.type }) : safeMarkup
  })
}

function stopCurrentAudio() {
  currentAudio?.pause()
  currentAudio = undefined
  if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl)
  currentAudioUrl = undefined
}

function attachAudioControls(event: Event) {
  const { doc, index } = (event as CustomEvent<{ doc?: Document; index?: number }>).detail
  const section = typeof index === 'number' ? reader.value?.book?.sections?.[index] : undefined
  const loadBlob = reader.value?.book?.loadBlob
  const resolveHref = section?.resolveHref
  if (!doc || !resolveHref || !loadBlob) return

  doc.querySelectorAll<HTMLElement>('.ibooks-media-audio[data-ibooks-audio-src]').forEach((trigger) => {
    trigger.tabIndex = 0
    trigger.setAttribute('aria-label', 'Phát âm thanh')
    const playAudio = async (clickEvent: Event) => {
      clickEvent.preventDefault()
      clickEvent.stopPropagation()

      if (currentAudio && !currentAudio.paused) {
        stopCurrentAudio()
        return
      }

      try {
        stopCurrentAudio()
        const source = trigger.dataset.ibooksAudioSrc
        if (!source) return
        const audioBlob = await loadBlob(resolveHref(source))
        currentAudioUrl = URL.createObjectURL(audioBlob)
        currentAudio = new Audio(currentAudioUrl)
        currentAudio.addEventListener('ended', stopCurrentAudio, { once: true })
        await currentAudio.play()
      } catch (error) {
        console.error('Không thể phát âm thanh EPUB', error)
        stopCurrentAudio()
      }
    }
    trigger.addEventListener('click', playAudio)
    trigger.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') void playAudio(keyEvent)
    })
  })
}

async function loadBook() {
  reader.value?.close()
  reader.value = undefined
  errorMessage.value = ''
  currentPage.value = 1
  pageCount.value = 0
  stopCurrentAudio()

  if (!book.value || !readerMount.value) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    await import('../vendor/foliate-js/view.js')
    const view = document.createElement('foliate-view') as FoliateViewElement
    view.className = 'reader__foliate'
    view.addEventListener('relocate', updateLocation)
    view.addEventListener('load', attachAudioControls)
    readerMount.value.replaceChildren(view)
    reader.value = view
    await view.open(book.value.epubUrl)
    view.book?.transformTarget?.addEventListener('data', removeBookScripts)
    pageCount.value = view.book?.sections?.length ?? 0
    await view.init({ showTextStart: true })
  } catch (error) {
    console.error('Không thể mở EPUB', error)
    errorMessage.value = 'Không thể mở cuốn sách này. Bé hãy quay lại thư viện và thử lại nhé.'
  } finally {
    isLoading.value = false
  }
}

async function previousPage() {
  await reader.value?.goLeft()
}

async function nextPage() {
  await reader.value?.goRight()
}

async function toggleFullscreen() {
  if (!readerFrame.value) return
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  } else {
    await readerFrame.value.requestFullscreen()
  }
}

function onFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === readerFrame.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return
  if (event.key === 'ArrowLeft') void previousPage()
  if (event.key === 'ArrowRight') void nextPage()
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  window.addEventListener('keydown', onKeydown)
  void nextTick(loadBook)
})

watch(() => route.params.slug, () => void nextTick(loadBook))

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  window.removeEventListener('keydown', onKeydown)
  stopCurrentAudio()
  reader.value?.close()
})
</script>

<template>
  <div class="reader-page">
    <AppHeader variant="overlay" contrast="dark" />

    <main v-if="book" class="reader-shell" aria-labelledby="reader-title">
      <section class="reader-toolbar" aria-label="Thông tin sách đang đọc">
        <RouterLink class="reader-toolbar__back" :to="`/books/${book.slug}`">
          <ArrowLeft :size="18" aria-hidden="true" />
          <span>Thư viện sách</span>
        </RouterLink>
        <h1 id="reader-title">{{ book.title }}</h1>
        <span class="reader-toolbar__mode">Chế độ trẻ em</span>
      </section>

      <section ref="readerFrame" class="reader-stage" :class="{ 'reader-stage--fullscreen': isFullscreen }">
        <aside class="reader-panel reader-panel--help">
          <h2>Cùng bé đọc sách</h2>
          <p>Chạm vào hình, biểu tượng loa hoặc video trong trang sách để khám phá.</p>
          <ul class="reader-feature-list" aria-label="Nội dung sách">
            <li v-if="book.hasAudio" class="reader-feature reader-feature--sound">
              <Volume2 :size="15" aria-hidden="true" /> Âm thanh
            </li>
            <li class="reader-feature reader-feature--video">
              <Video :size="15" aria-hidden="true" /> Video
            </li>
            <li class="reader-feature reader-feature--pages">{{ pageCount || '…' }} trang sách</li>
          </ul>
        </aside>

        <div class="reader-book-wrap" aria-live="polite">
          <button
            type="button"
            class="reader-page-turn reader-page-turn--previous"
            :disabled="isLoading || !!errorMessage"
            aria-label="Trang trước"
            @click="previousPage"
          >
            <ChevronLeft :size="26" aria-hidden="true" />
          </button>
          <div ref="readerMount" class="reader-book" aria-label="Nội dung EPUB" />
          <button
            type="button"
            class="reader-page-turn reader-page-turn--next"
            :disabled="isLoading || !!errorMessage"
            aria-label="Trang sau"
            @click="nextPage"
          >
            <ChevronRight :size="26" aria-hidden="true" />
          </button>
          <div v-if="isLoading" class="reader-loading">
            <LoaderCircle :size="26" aria-hidden="true" />
            <span>Đang mở trang sách…</span>
          </div>
          <div v-else-if="errorMessage" class="reader-error" role="alert">
            <p>{{ errorMessage }}</p>
            <RouterLink class="button button--primary" to="/library">Về thư viện</RouterLink>
          </div>
          <p class="reader-book-wrap__note">Vùng hiển thị EPUB thực tế · tỷ lệ trang được giữ nguyên</p>
        </div>

        <aside class="reader-panel reader-panel--controls" aria-label="Điều khiển đọc sách">
          <h2>Điều khiển</h2>
          <div class="reader-controls">
            <button type="button" class="reader-control" :disabled="isLoading || !!errorMessage" @click="previousPage">
              <ChevronLeft :size="16" aria-hidden="true" /> Trang trước
            </button>
            <output class="reader-control reader-control--current">{{ pageLabel }}</output>
            <button type="button" class="reader-control" :disabled="isLoading || !!errorMessage" @click="nextPage">
              Trang sau <ChevronRight :size="16" aria-hidden="true" />
            </button>
          </div>
          <p class="reader-panel__note">Sách có thể chứa âm thanh, video và vùng tương tác.</p>
          <button type="button" class="reader-fullscreen" @click="toggleFullscreen">
            <Expand :size="17" aria-hidden="true" />
            {{ isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình' }}
          </button>
        </aside>
      </section>
      <p class="reader-design-note">TRÌNH ĐỌC EPUB · Nút điều hướng nằm ngoài vùng trang · Audio/video chỉ hoạt động trong vùng an toàn</p>
    </main>

    <main v-else class="reader-missing">
      <h1>Không tìm thấy cuốn sách</h1>
      <p>Cuốn sách này không còn trong thư viện.</p>
      <RouterLink class="button button--primary" to="/library">Về thư viện</RouterLink>
    </main>
  </div>
</template>

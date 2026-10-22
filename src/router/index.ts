import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import BookDetailView from '../views/BookDetailView.vue'
import ReaderView from '../views/ReaderView.vue'
import AboutView from '../views/AboutView.vue'
import ComingSoonView from '../views/ComingSoonView.vue'
const placeholder = (title: string) => ({ component: ComingSoonView, props: { title } })
export default createRouter({ history: createWebHistory(), scrollBehavior: () => ({ top: 0 }), routes: [
  { path: '/', component: HomeView },
  { path: '/library', component: LibraryView },
  { path: '/books/:slug', component: BookDetailView },
  { path: '/read/:slug', component: ReaderView },
  { path: '/about', component: AboutView },
  { path: '/play', ...placeholder('Góc vui học') },
  { path: '/admin', ...placeholder('Góc người lớn') },
] })

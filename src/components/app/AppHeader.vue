<script setup lang="ts">
import { ref } from "vue";
import { Menu, Search, X } from "lucide-vue-next";
import { RouterLink } from "vue-router";

withDefaults(
  defineProps<{
    variant?: "overlay" | "card";
    contrast?: "light" | "dark";
  }>(),
  { variant: "overlay", contrast: "light" },
);

const open = ref(false);
const links = [
  { label: "Trang chủ", to: "/" },
  { label: "Thư viện sách", to: "/library" },
  { label: "Góc vui học", to: "/play" },
  { label: "Dành cho người lớn", to: "/admin" },
  { label: "Về chúng tôi", to: "/about" },
];
</script>

<template>
  <header
    class="header"
    :class="[`header--${variant}`, `header--${contrast}`]"
    @keydown.esc="open = false"
  >
    <RouterLink
      class="brand"
      to="/"
      aria-label="Little Wonder Library - Trang chủ"
    >
      <img src="/images/brand-mark.svg" alt="" />
      <span>Little<br />Wonder<br />Library</span>
    </RouterLink>

    <nav class="nav" aria-label="Điều hướng chính">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to">
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="header__actions">
      <RouterLink to="/library" aria-label="Tìm sách"
        ><Search :size="21"
      /></RouterLink>
      <RouterLink class="parent" to="/admin">Dành cho phụ huynh</RouterLink>
      <button
        type="button"
        class="menu"
        :aria-expanded="open"
        aria-controls="mobile-navigation"
        @click="open = !open"
      >
        <X v-if="open" :size="26" />
        <Menu v-else :size="26" />
        <span class="sr-only">{{ open ? "Đóng menu" : "Mở menu" }}</span>
      </button>
    </div>

    <nav
      v-show="open"
      id="mobile-navigation"
      class="mobile-nav"
      aria-label="Điều hướng di động"
    >
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        @click="open = false"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>

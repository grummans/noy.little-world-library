import { ref, watch } from "vue";
import type { Book } from "../data/books";

// Demo purchase state: localStorage only. Real entitlements need a backend.
const storageKey = "little-wonder-owned-books";

const readOwned = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(stored) &&
      stored.every((item) => typeof item === "string")
      ? stored
      : [];
  } catch {
    return [];
  }
};

export const ownedBooks = ref<string[]>(readOwned());

watch(
  ownedBooks,
  (value) => localStorage.setItem(storageKey, JSON.stringify(value)),
  {
    deep: true,
  },
);

export const isUnlocked = (book: Book) =>
  book.isFree || ownedBooks.value.includes(book.slug);

export const unlockBook = (slug: string) => {
  if (!ownedBooks.value.includes(slug))
    ownedBooks.value = [...ownedBooks.value, slug];
};

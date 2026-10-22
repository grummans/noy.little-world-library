export interface Category { slug: string; name: string; image: string }

export const categories: Category[] = [
  { slug: 'dong-vat', name: 'Động vật', image: '/images/topic-animals.svg' },
  { slug: 'thien-nhien', name: 'Thiên nhiên', image: '/images/topic-nature.svg' },
  { slug: 'cam-xuc', name: 'Cảm xúc', image: '/images/topic-emotions.svg' },
  { slug: 'ky-nang-song', name: 'Kỹ năng sống', image: '/images/topic-life-skills.svg' },
  { slug: 'gia-dinh', name: 'Gia đình', image: '/images/topic-family.svg' },
]

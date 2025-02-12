<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getBooks } from '../api'
import type { Book } from '../types'

const books = ref<Book[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref<'title' | 'price' | 'stock'>('title')

const filters = ref({
  minPrice: '',
  maxPrice: '',
  inStock: false
})

// 过滤和排序后的书籍列表
const filteredAndSortedBooks = computed(() => {
  let result = [...books.value]

  // 应用价格筛选
  if (filters.value.minPrice) {
    result = result.filter(book => book.price >= Number(filters.value.minPrice))
  }
  if (filters.value.maxPrice) {
    result = result.filter(book => book.price <= Number(filters.value.maxPrice))
  }

  // 仅显示有库存
  if (filters.value.inStock) {
    result = result.filter(book => book.availableStock > 0)
  }

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
    )
  }

  // 排序
  return result.sort((a, b) => {
    switch (sortBy.value) {
      case 'price':
        return a.price - b.price
      case 'stock':
        return b.availableStock - a.availableStock
      default:
        return a.title.localeCompare(b.title)
    }
  })
})

const fetchBooks = async () => {
  try {
    const response = await getBooks()
    books.value = response.data.books
  } catch (e) {
    console.error('Error details:', e)
    error.value = 'Failed to fetch books'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBooks()
})
</script>

<template>
  <div class="container">
    <div class="controls">
      <div class="search-bar">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search books..."
            class="search-input"
        />
      </div>
      <select v-model="sortBy" class="sort-select">
        <option value="title">Sort by Title</option>
        <option value="price">Sort by Price</option>
        <option value="stock">Sort by Stock</option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="book-grid">
      <div
          v-for="book in filteredAndSortedBooks"
          :key="book.id"
          class="book-card"
          @click="$router.push(`/book/${book.id}`)"
      >
        <h3 class="book-title">{{ book.title }}</h3>
        <div class="book-details">
          <p><strong>Author:</strong> {{ book.author }}</p>
          <p><strong>ISBN:</strong> {{ book.isbn }}</p>
          <p class="price"><strong>Price:</strong> ${{ book.price }}</p>
          <p class="stock"><strong>Stock:</strong> {{ book.availableStock }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  margin-bottom: 1px;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.book-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.book-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.book-details p {
  margin: 8px 0;
  color: #666;
}

.price {
  color: #e53e3e;
  font-size: 1.1rem;
}

.stock {
  color: #2f855a;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.search-bar {
  flex: 1;
}

.sort-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  min-width: 150px;
  cursor: pointer;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #4a5568;
}

.error {
  color: #e53e3e;
}
</style>
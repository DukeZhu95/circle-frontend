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

// Books that are filtered and sorted
const filteredAndSortedBooks = computed(() => {
  let result = [...books.value]

  // Apply filters
  if (filters.value.minPrice) {
    result = result.filter(book => book.price >= Number(filters.value.minPrice))
  }
  if (filters.value.maxPrice) {
    result = result.filter(book => book.price <= Number(filters.value.maxPrice))
  }

  // Apply inStock filter
  if (filters.value.inStock) {
    result = result.filter(book => book.availableStock > 0)
  }

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
    )
  }

  // Sort the result
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
        <div class="book-background"></div>
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
  width: 100%;
  min-height: 100%;
  padding: 40px 0 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
}

.controls {
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  padding: 0 20px;
  box-sizing: border-box;
}

.search-bar, .sort-select {
  width: 100%;
}

.search-bar {
  width: 400px;
  flex: unset;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #343434;
  color: white;
}

.search-input::placeholder {
  color: #888;
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  background-color: #343434;
}

.sort-select {
  width: 200px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  color: #333;
  box-sizing: border-box;
}

.sort-select {
  width: 200px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  color: #333;
  box-sizing: border-box;
}

.sort-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.book-grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 80px;
  padding: 0 40px;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Mobile */
@media screen and (max-width: 767px) {
  .container {
    padding: 20px 0;
    background-color: white;
  }

  .controls {
    flex-direction: column;
    align-items: center;
    padding: 0 15px;
  }

  .search-bar {
    width: 100%;
    max-width: 300px;
  }

  .sort-select {
    width: 100%;
    max-width: 300px;
  }

  .book-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 10px;
  }
}

/* Smaller screen */
@media screen and (max-width: 390px) {
  .controls {
    padding: 0 10px;
  }

  .book-grid {
    padding: 0 10px;
    gap: 15px;
  }
}

.book-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.book-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../images/book.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.1;
  z-index: 0;
}

.book-title, .book-details {
  position: relative;
  z-index: 1;
}

.book-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #2c3e50;
  font-weight: 600;
}

.book-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.book-details p {
  margin: 0;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-details p strong {
  color: #4a5568;
}

.price {
  color: #e53e3e;
  font-weight: bold;
  font-size: 1.1rem;
}

.stock {
  color: #2f855a;
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
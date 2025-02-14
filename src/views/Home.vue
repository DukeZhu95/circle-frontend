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
  width: 100%;
  min-height: 100%;
  padding: 40px 0 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 200px; /* 给定一个固定宽度 */
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
  width: 100%;        /* 设置宽度 */
  max-width: 1400px;  /* 设置最大宽度 */
  margin: 0 auto;
  gap: 80px;         /* 调整卡片间距 */
  padding: 0 40px;
  display: grid;
  box-sizing: border-box; /* 添加这行 */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* 移动端样式 */
@media screen and (max-width: 767px) {  /* 添加 screen */
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
    grid-template-columns: 1fr;  /* 强制单列 */
    gap: 20px;
    padding: 0 10px;
  }
}

/* 更小屏幕的优化 */
@media screen and (max-width: 390px) {  /* 添加 screen */
  .controls {
    padding: 0 10px;
  }

  .book-grid {
    padding: 0 10px;
    gap: 15px;
  }
}

.book-card {
  background: white;
  border-radius: 12px;
  padding: 25px;    /* 稍微减小内边距 */
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;       /* 添加内容间距 */
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.book-title {
  font-size: 1.5rem;
  margin-bottom: 20px;  /* 增加标题下方间距 */
  color: #2c3e50;
  font-weight: 600;
}

.book-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;  /* 增加详情项之间的间距 */
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
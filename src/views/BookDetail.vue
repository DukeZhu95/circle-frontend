<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBook, purchaseBook } from '../api'
import type { Book } from '../types'

const route = useRoute()
const router = useRouter()
const book = ref<Book | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const purchaseStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

const fetchBook = async () => {
  const id = route.params.id as string
  try {
    const response = await getBook(id)
    book.value = response.data
  } catch (e) {
    error.value = 'Failed to fetch book details'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handlePurchase = async () => {
  if (!book.value) return
  purchaseStatus.value = 'loading'
  try {
    await purchaseBook(book.value.id)
    purchaseStatus.value = 'success'
    // 重新获取书籍信息以更新库存
    await fetchBook()
  } catch (e) {
    purchaseStatus.value = 'error'
    console.error(e)
  }
}

onMounted(() => {
  fetchBook()
})
</script>

<template>
  <div class="container">
    <button
        class="back-button"
        @click="router.push('/')"
    >
      Back to List
    </button>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="book" class="book-detail">
      <h1 class="book-title">{{ book.title }}</h1>

      <div class="book-info">
        <div class="info-row">
          <strong>Author:</strong>
          <span>{{ book.author }}</span>
        </div>

        <div class="info-row">
          <strong>ISBN:</strong>
          <span>{{ book.isbn }}</span>
        </div>

        <div class="info-row">
          <strong>Price:</strong>
          <span class="price">${{ book.price }}</span>
        </div>

        <div class="info-row">
          <strong>Available Stock:</strong>
          <span :class="{ 'low-stock': book.availableStock < 5 }">
            {{ book.availableStock }}
          </span>
        </div>
      </div>

      <div class="purchase-section">
        <button
            class="purchase-button"
            @click="handlePurchase"
            :disabled="purchaseStatus === 'loading' || book.availableStock === 0"
        >
          {{
            book.availableStock === 0
                ? 'Out of Stock'
                : purchaseStatus === 'loading'
                    ? 'Processing...'
                    : 'Purchase Now'
          }}
        </button>

        <div v-if="purchaseStatus === 'success'" class="success-message">
          Purchase successful!
        </div>

        <div v-if="purchaseStatus === 'error'" class="error-message">
          Purchase failed. Please try again.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  padding: 8px 16px;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #2d3748;
}

.book-detail {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.book-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 30px;
}

.book-info {
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-row strong {
  width: 150px;
  color: #4a5568;
}

.price {
  color: #e53e3e;
  font-weight: 600;
}

.low-stock {
  color: #dd6b20;
}

.purchase-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.purchase-button {
  padding: 12px 24px;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
}

.purchase-button:hover:not(:disabled) {
  background-color: #38a169;
}

.purchase-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.success-message {
  color: #38a169;
  margin-top: 10px;
}

.error-message {
  color: #e53e3e;
  margin-top: 10px;
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
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
const showConfirmDialog = ref(false)

const fetchBook = async () => {
  const id = route.params.id as string
  try {
    console.log('Fetching book with id:', id)
    const response = await getBook(id)
    book.value = response.data.book
  } catch (e) {
    console.error('Error fetching book:', e)
    error.value = 'Failed to fetch book details'
  } finally {
    loading.value = false
  }
}

const handlePurchase = async () => {
  if (!book.value) return
  purchaseStatus.value = 'loading'
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    await purchaseBook(book.value.id.toString())
    purchaseStatus.value = 'success'
    await fetchBook()

    setTimeout(() => {
      purchaseStatus.value = 'idle'
      showConfirmDialog.value = false
    }, 3000)
  } catch (e) {
    purchaseStatus.value = 'error'
    console.error('Purchase failed:', e)
    setTimeout(() => {
      purchaseStatus.value = 'idle'
    }, 3000)
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
      <div class="loading-spinner"></div>
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
          <span>{{ book.author || 'Unknown' }}</span>
        </div>

        <div class="info-row">
          <strong>ISBN:</strong>
          <span>{{ book.isbn || 'N/A' }}</span>
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
        <!-- Purchase button -->
        <button
            class="purchase-button"
            @click="showConfirmDialog = true"
            :disabled="purchaseStatus === 'loading' || book.availableStock === 0"
        >
          <span v-if="purchaseStatus === 'loading'" class="loading-spinner small"></span>
          {{
            book.availableStock === 0
                ? 'Out of Stock'
                : purchaseStatus === 'loading'
                    ? 'Processing...'
                    : 'Purchase Now'
          }}
        </button>

        <!-- Confirmation -->
        <div v-if="showConfirmDialog" class="dialog-overlay">
          <div class="dialog-content">
            <h3>Confirm Purchase</h3>
            <p class="dialog-message">
              Are you sure you want to purchase "{{ book.title }}" for ${{ book.price }}?
            </p>
            <div class="dialog-buttons">
              <button
                  class="cancel-button"
                  @click="showConfirmDialog = false"
                  :disabled="purchaseStatus === 'loading'"
              >
                Cancel
              </button>
              <button
                  class="confirm-button"
                  @click="handlePurchase"
                  :disabled="purchaseStatus === 'loading'"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>

        <!-- Prompt -->
        <div v-if="purchaseStatus === 'success'" class="status-message success">
          Purchase successful!
        </div>

        <div v-if="purchaseStatus === 'error'" class="status-message error">
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
  color: #333;
}

.info-row strong {
  width: 150px;
  color: #4a5568;
}

.info-row span {
  color: #2d3748;
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

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #4a5568;
}

.error {
  color: #e53e3e;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.dialog-content h3 {
  margin-top: 0;
  font-size: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.dialog-message {
  color: #4a5568;
  text-align: center;
  margin: 16px 0;
}

.cancel-button, .confirm-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  min-width: 120px;
}

.cancel-button {
  background-color: #e2e8f0;
  color: #4a5568;
}

.confirm-button {
  background-color: #48bb78;
  color: white;
}

.confirm-button:hover {
  background-color: #38a169;
}

.cancel-button:hover {
  background-color: #cbd5e0;
}

.confirm-button:disabled, .cancel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  text-align: center;

}

.status-message.success {
  background-color: #f0fff4;
  border: 1px solid #48bb78;
  color: #2f855a;
}

.status-message.error {
  background-color: #fff5f5;
  border: 1px solid #e53e3e;
  color: #c53030;
}
</style>
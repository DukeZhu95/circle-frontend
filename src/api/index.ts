import axios from 'axios'
import type { Book, PurchaseResponse } from '../types'

const api = axios.create({
    baseURL: '/books',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.response.use(
    response => response,
    error => {
        const errorMessage = error.response?.data?.message || 'An error occurred'
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: errorMessage
        })
        return Promise.reject(error)
    }
)

export const getBooks = () => api.get<{ books: Book[] }>('/')
export const getBook = (id: string) => api.get<{ book: Book }>(`/${id}`)
export const purchaseBook = (id: string) => api.post<PurchaseResponse>(`/${id}/purchase`)
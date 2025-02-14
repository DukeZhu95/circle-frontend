import axios from 'axios'
import type { Book, PurchaseResponse } from '../types'

const api = axios.create({
    baseURL: '/books',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// 简化的拦截器
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export const getBooks = () => api.get<{ books: Book[] }>('/')
export const getBook = (id: string) => api.get<{ book: Book }>(`/${id}`)
export const purchaseBook = (id: string) => api.post<PurchaseResponse>(`/${id}/purchase`)
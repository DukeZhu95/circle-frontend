import { mockBooks } from '../mock/books'
import type { Book, PurchaseResponse } from '../types'

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取单本书详情
export const getBook = async (id: string): Promise<{ data: Book }> => {
    await delay(300) // 模拟网络延迟
    const book = mockBooks.find(b => b.id === id)
    if (!book) {
        throw new Error('Book not found')
    }
    return { data: book }
}

// 购买书籍
export const purchaseBook = async (id: string): Promise<{ data: PurchaseResponse }> => {
    await delay(500) // 模拟网络延迟
    const book = mockBooks.find(b => b.id === id)
    if (!book) {
        throw new Error('Book not found')
    }
    if (book.availableStock <= 0) {
        throw new Error('Book out of stock')
    }
    // 更新库存
    book.availableStock -= 1
    return {
        data: {
            message: 'Purchase successful',
            book
        }
    }
}

// 获取书籍列表
export const getBooks = async (): Promise<{ data: { books: Book[] } }> => {
    await delay(300)
    return { data: { books: mockBooks } }
}
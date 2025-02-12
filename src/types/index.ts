export interface Book {
    id: string
    title: string
    author: string
    isbn: string
    price: number
    availableStock: number
}

// 添加响应类型
export interface BooksResponse {
    books: Book[]
}
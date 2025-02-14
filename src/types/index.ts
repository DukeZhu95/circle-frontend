export interface Book {
    id: string | number
    title: string
    author: string
    isbn: string
    price: number
    availableStock: number
}

export interface BooksResponse {
    books: Book[]
}

// 添加这个接口
export interface PurchaseResponse {
    message: string
    book: Book
}
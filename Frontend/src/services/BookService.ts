import type { Book } from "../types/Book"
import apiClient from "./apiClient"

export const getAllBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get("/books")
    return response.data
}

export const deleteBook = async (_id: string): Promise<void> => {
    await apiClient.delete(`/books/${_id}`)
}

export const addBook = async (bookData: Omit<Book, "_id">): Promise<Book> => {
    const response = await apiClient.post("/books", bookData)
    return response.data
}

export const updateBook = async (_id: string, bookData: Omit<Book, "_id">) => {
    const response = await apiClient.put(`/books/${_id}`, bookData)
    return response.data
}

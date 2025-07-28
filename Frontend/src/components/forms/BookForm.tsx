import React, { useEffect, useState } from "react"
import type { Book } from "../../types/Book"

interface BookFormProps {
    book?: Book | null
    onSubmit: (bookData: Omit<Book, "_id">) => void
}

interface FormErrors {
    title?: string
    author?: string
    isbn?: string
    publishedDate?: string
    genre?: string
    quantity?: string
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit }) => {
    const [formData, setFormData] = useState<Omit<Book, "_id">>({
        title: "",
        author: "",
        isbn: "",
        publishedDate: "",
        genre: "",
        quantity: 1,
        available: true,
    })

    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                publishedDate: book.publishedDate,
                genre: book.genre,
                quantity: book.quantity,
                available: book.available,
            })
        } else {
            setFormData({
                title: "",
                author: "",
                isbn: "",
                publishedDate: "",
                genre: "",
                quantity: 1,
                available: true,
            })
        }
        setErrors({})
    }, [book])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.author.trim()) newErrors.author = "Author is required"

        if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required"
        else if (!/^[\d\-]{10,17}$/.test(formData.isbn)) newErrors.isbn = "Invalid ISBN"

        if (!formData.publishedDate.trim()) newErrors.publishedDate = "Published date is required"

        if (!formData.genre.trim()) newErrors.genre = "Genre is required"

        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Quantity must be at least 1"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value
        }))
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.title ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter book title"
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Author */}
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.author ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter author name"
                />
                {errors.author && <p className="text-sm text-red-600">{errors.author}</p>}
            </div>

            {/* ISBN */}
            <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.isbn ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter ISBN"
                />
                {errors.isbn && <p className="text-sm text-red-600">{errors.isbn}</p>}
            </div>

            {/* Published Date */}
            <div>
                <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                <input
                    type="date"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.publishedDate ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.publishedDate && <p className="text-sm text-red-600">{errors.publishedDate}</p>}
            </div>

            {/* Genre */}
            <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.genre ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="e.g. Fiction, Non-fiction"
                />
                {errors.genre && <p className="text-sm text-red-600">{errors.genre}</p>}
            </div>

            {/* Quantity */}
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.quantity ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    min={1}
                />
                {errors.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
            </div>
        </form>
    )
}

export default BookForm

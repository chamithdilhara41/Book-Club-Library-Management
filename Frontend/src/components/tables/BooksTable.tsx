import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import type { Book } from '../../types/Book';

interface BooksTableProps {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({ books, onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QTY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {books.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No books found</td>
                    </tr>
                ) : (
                    books.map((book, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{book.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{book.author}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{book.genre}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{book.isbn}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{book.publishedDate}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{book.quantity}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{book.available ? 'Available' : 'Borrowed'}</td>
                            <td className="px-6 py-4 text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(book)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition duration-150"
                                    >
                                        <MdEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(book)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition duration-150"
                                    >
                                        <MdDelete className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default BooksTable;

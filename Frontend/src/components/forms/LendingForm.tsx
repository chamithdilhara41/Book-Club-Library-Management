import React, { useEffect, useState } from "react";
import type { Book } from "../../types/Book";
import type { Reader } from "../../types/Reader";

interface Props {
    books?: Book[];
    readers?: Reader[];
    onSubmit: (data: {
        bookId: string;
        readerId: string;
        dueDate: string;
        returnDate: string;
    }) => void;
}

const LendingForm: React.FC<Props> = ({ books = [], readers = [], onSubmit }) => {
    const getDefaultDueDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 10);
        return today.toISOString().split("T")[0]; // Format as yyyy-mm-dd
    };

    const [formData, setFormData] = useState({
        bookId: "",
        readerId: "",
        dueDate: getDefaultDueDate(),
        returnDate: "",
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            dueDate: getDefaultDueDate(),
        }));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { bookId, readerId, dueDate } = formData;
        if (!bookId || !readerId || !dueDate) {
            alert("Please fill all fields.");
            return;
        }
        onSubmit(formData);
        setFormData({
            bookId: "",
            readerId: "",
            dueDate: getDefaultDueDate(),
            returnDate: "",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <label className="block text-sm font-medium mb-1">Book</label>
                <select
                    name="bookId"
                    value={formData.bookId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Select a book</option>
                    {books.filter(book => book.quantity > 0).map(book => (
                        <option key={book._id} value={book._id}>
                            {book.title} ({book.isbn})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Reader</label>
                <select
                    name="readerId"
                    value={formData.readerId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Select a reader</option>
                    {readers.map(reader => (
                        <option key={reader._id} value={reader._id}>
                            {reader.name} ({reader.email})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Due Date <span className="text-xs text-gray-500">(auto 10 days, or change)</span>
                </label>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

        </form>
    );
};

export default LendingForm;

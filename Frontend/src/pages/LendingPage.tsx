import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import toast from "react-hot-toast";
import axios from "axios";

import type { Lending } from "../types/Lending";
import type { Book } from "../types/Book";
import type { Reader } from "../types/Reader";

import {
    getAllLendings,
    createLending,
    returnLending
} from "../services/LendingService";

import { getAllBooks } from "../services/BookService";
import { getAllReaders } from "../services/ReaderService";

import LendingTable from "../components/tables/LendingTable";
import LendingForm from "../components/forms/LendingForm";

const LendingPage: React.FC = () => {
    const [lendings, setLendings] = useState<Lending[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [readers, setReaders] = useState<Reader[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
    const [selectedLending, setSelectedLending] = useState<Lending | null>(null);

    const fetchAllData = async () => {
        try {
            setIsLoading(true);
            const [lendingData, bookData, readerData] = await Promise.all([
                getAllLendings(),
                getAllBooks(),
                getAllReaders()
            ]);

            setLendings(Array.isArray(lendingData) ? lendingData : []);
            setBooks(bookData);
            setReaders(readerData);
        } catch (error) {
            const msg = axios.isAxiosError(error) ? error.message : "Failed to fetch data.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleAddLending = () => {
        setSelectedLending(null);
        setIsAddDialogOpen(true);
    };

    const handleReturnLending = (lending: Lending) => {
        setSelectedLending(lending);
        setIsReturnDialogOpen(true);
    };

    const handleFormSubmit = async (data: { bookId: string; readerId: string; dueDate:string; returnDate:string }) => {
        try {
            const newLending = await createLending(data);
            setLendings((prev) => [...prev, newLending]);
            setIsAddDialogOpen(false);
        } catch {
            toast.error("Failed to lend book");
        }
    };

    const confirmReturn = async () => {
        if (!selectedLending) return;

        try {
            if (selectedLending._id != null) {
                await returnLending(selectedLending._id);
            }
            await fetchAllData();
        } catch {
            toast.error("Failed to return book");
        } finally {
            setIsReturnDialogOpen(false);
            setSelectedLending(null);
        }
    };

    const cancelDialog = () => {
        setIsAddDialogOpen(false);
        setIsReturnDialogOpen(false);
        setSelectedLending(null);
    };

    if (isLoading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Lending History & Records</h1>
                    <button
                        onClick={handleAddLending}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <MdAdd className="w-5 h-5" />
                        <span>Lend Book</span>
                    </button>
                </div>

                <LendingTable
                    lendings={lendings}
                    books={books}
                    readers={readers}
                    onReturn={handleReturnLending}
                />

                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) form.requestSubmit();
                    }}
                    title="Lend a Book"
                >
                    <LendingForm
                        books={books}
                        readers={readers}
                        onSubmit={handleFormSubmit}
                    />
                </Dialog>

                <Dialog
                    isOpen={isReturnDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmReturn}
                    title="Return Book"
                >
                    <p className="text-gray-700">
                        Are you sure you want to mark{" "}
                        <strong>
                            {
                                books.find((b) => b._id === selectedLending?.bookId)?.title ?? "this book"
                            }
                        </strong>{" "}
                        as returned?
                    </p>
                </Dialog>
            </div>
        </div>
    );
};

export default LendingPage;

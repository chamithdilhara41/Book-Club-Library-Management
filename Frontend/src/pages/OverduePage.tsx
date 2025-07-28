import React, { useEffect, useState } from "react";
import type { Lending } from "../types/Lending.ts";
import apiClient from "../services/apiClient.ts";

const OverduePage: React.FC = () => {
    const [overdues, setOverdues] = useState<Lending[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sendingId, setSendingId] = useState<string | null>(null);

    const fetchOverdue = async () => {
        try {
            const res = await apiClient.get("/overdues");
            setOverdues(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching overdue records", error);
            setError("Failed to load overdue data.");
        } finally {
            setLoading(false);
        }
    };

    const sendNotification = async (readerId: string) => {
        if (!readerId) return alert("Invalid reader ID");

        try {
            setSendingId(readerId);
            await apiClient.post(`/overdues/notify/${readerId}`);
            alert("Reminder email sent!");
        } catch (error) {
            console.error("Error sending email", error);
            alert("Failed to send email. Check server logs.");
        } finally {
            setSendingId(null);
        }
    };

    useEffect(() => {
        fetchOverdue();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Overdue Books</h1>

                {loading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : overdues.length === 0 ? (
                    <p className="text-gray-500">No overdue records found</p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reader</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lend Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returned</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {overdues.map((lend) => {
                                const reader = lend.readerId as any;
                                const book = lend.bookId as any;
                                const readerName = reader?.name ?? reader;
                                const bookTitle = book?.title ?? book;
                                const readerEmail = reader?.email ?? "";
                                const readerRealId = reader?._id ?? reader;

                                return (
                                    <tr key={lend._id} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {readerName} {readerEmail && `(${readerEmail})`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {bookTitle}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(lend.lendDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-red-600 font-semibold">
                                            {new Date(lend.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {lend.returned ? "Yes" : "No"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <button
                                                disabled={sendingId === readerRealId}
                                                onClick={() => sendNotification(readerRealId)}
                                                className={`${
                                                    sendingId === readerRealId
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-indigo-600 hover:bg-indigo-700"
                                                } text-white px-4 py-2 rounded-lg transition`}
                                            >
                                                {sendingId === readerRealId ? "Sending..." : "Send Reminder"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverduePage;

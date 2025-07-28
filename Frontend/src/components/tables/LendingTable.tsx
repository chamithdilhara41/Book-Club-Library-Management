import React, { useState, useRef, useEffect } from 'react';
import { MdAssignmentReturn } from 'react-icons/md';
import type { Lending } from '../../types/Lending';
import type { Book } from '../../types/Book';
import type { Reader } from '../../types/Reader';

interface LendingTableProps {
    lendings: Lending[];
    books: Book[];
    readers: Reader[];
    onReturn: (lending: Lending) => void;
    onEditDueDate?: (lending: Lending) => void;
}

const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'returned', label: 'Returned' },
    { value: 'notReturned', label: 'Not Returned' },
];

const LendingTable: React.FC<LendingTableProps> = ({
                                                       lendings,
                                                       books,
                                                       readers,
                                                       onReturn,
                                                       onEditDueDate,
                                                   }) => {
    const [filter, setFilter] = useState<'all' | 'returned' | 'notReturned'>('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getBookDetails = (bookIdOrObj: string | Book) => {
        let book: Book | undefined;
        if (typeof bookIdOrObj === 'string') {
            book = books.find(b => b._id === bookIdOrObj);
        } else {
            book = bookIdOrObj;
        }
        return book ? `${book.title} (${book.genre})` : 'Unknown Book';
    };

    const getReaderDetails = (readerIdOrObj: string | Reader) => {
        let reader: Reader | undefined;
        if (typeof readerIdOrObj === 'string') {
            reader = readers.find(r => r._id === readerIdOrObj);
        } else {
            reader = readerIdOrObj;
        }
        return reader ? `${reader.name} (${reader.email})` : 'Unknown Reader';
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    const filteredLendings = lendings.filter(lending => {
        if (filter === 'returned') return lending.returned === true;
        if (filter === 'notReturned') return lending.returned === false;
        return true;
    });

    return (
        <div>
            {/* Modern Filter Dropdown */}
            <div className="mb-4 relative inline-block text-left" ref={dropdownRef}>
                <label className="block mb-1 font-semibold text-gray-700">Filter by Book</label>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    type="button"
                    className="inline-flex justify-between items-center w-48 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                >
                    {filterOptions.find(opt => opt.value === filter)?.label}
                    <svg
                        className={`ml-2 h-5 w-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute z-10 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {filterOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setFilter(option.value as 'all' | 'returned' | 'notReturned');
                                        setDropdownOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                        filter === option.value
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-700 hover:bg-indigo-100'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lending Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reader</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lend Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLendings.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                No lending records found.
                            </td>
                        </tr>
                    ) : (
                        filteredLendings.map((lending) => (
                            <tr
                                key={lending._id}
                                className="border-b border-gray-200 hover:bg-indigo-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-sm text-gray-900">{getBookDetails(lending.bookId)}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{getReaderDetails(lending.readerId)}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(lending.lendDate)}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 flex items-center justify-between gap-2">
                                    {formatDate(lending.dueDate)}
                                    {!lending.returned && onEditDueDate && (
                                        <button
                                            onClick={() => onEditDueDate(lending)}
                                            className="text-sm text-blue-500 underline hover:text-blue-700"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {lending.returnDate ? formatDate(lending.returnDate) : '—'}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {lending.returned ? (
                                        <span className="text-green-600 font-medium">Returned</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Not Returned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {!lending.returned && (
                                        <button
                                            onClick={() => onReturn(lending)}
                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <MdAssignmentReturn className="w-5 h-5" />
                                            <span>Mark Returned</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LendingTable;

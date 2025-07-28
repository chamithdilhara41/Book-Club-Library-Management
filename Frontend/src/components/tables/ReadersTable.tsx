import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import type { Reader } from '../../types/Reader';

interface ReadersTableProps {
    readers: Reader[];
    onEdit: (reader: Reader) => void;
    onDelete: (reader: Reader) => void;
}

const ReadersTable: React.FC<ReadersTableProps> = ({ readers, onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {readers.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No readers found</td>
                    </tr>
                ) : (
                    readers.map((reader, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.DOB}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.joinDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(reader)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition duration-150"
                                    >
                                        <MdEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(reader)}
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

export default ReadersTable;

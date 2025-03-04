'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface LostFoundItem {
    _id: string;
    name: string;
    description: string;
    type: 'lost' | 'found';
    currentStatus: string;
    status: boolean;
    owner: {
        _id: string;
        username: string;
    };
    college: {
        _id: string;
        name: string;
    };
    slug: string;
    clickCounts: number;
    location: string;
    imageUrl: string;
    whatsapp: string;
    createdAt: string;
}

export default function LostFoundItemPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filters
    const [searchName, setSearchName] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        if (!collegeName) return;

        const fetchLostFoundItems = async () => {
            try {
                const res = await fetch(
                    `${api.lostfound.allLostFoundItems}/${collegeName}`
                );
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const jsonData: LostFoundItem[] = await res.json();
                setItems(jsonData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLostFoundItems();
    }, [collegeName]);

    // Apply filters
    const filteredItems = items.filter((item) => {
        return (
            (searchName === '' ||
                item.name.toLowerCase().includes(searchName.toLowerCase())) &&
            (filterType === 'all' || item.type === filterType) &&
            (filterStatus === 'all' || item.currentStatus === filterStatus)
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <Spinner size={3} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2">
                Lost & Found Items
            </h1>

            {/* Filter Section */}
            <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                {/* Search by Name */}
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />

                {/* Type Filter */}
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">All Types</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                </select>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="claimed">Claimed</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Current Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Clicks
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentItems.map((item) => (
                            <tr
                                key={item._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {item.type.charAt(0).toUpperCase() +
                                        item.type.slice(1)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {item.location}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {item.currentStatus}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white text-xs ${
                                            item.status
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}
                                    >
                                        {item.status ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {item.clickCounts}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Transaction {
    _id: string;
    user: {
        _id: string;
        username: string;
        email: string;
    };
    type: string;
    points: number;
    resourceType: string;
    resourceId: string;
    createdAt: string;
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterResourceType, setFilterResourceType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 12;

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch(`${api.transactions.transaction}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch transactions');
                const data: Transaction[] = await res.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError('Something went wrong while fetching transactions');
                toast.error('Something went wrong while fetching transactions');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [token]);

    // Filter transactions
    const trimmedSearchQuery = searchQuery.trim().toLowerCase();

    const filteredTransactions = transactions.filter(
        (transaction) =>
            (transaction.user?.email?.toLowerCase() || '').includes(
                searchQuery.trim().toLowerCase()
            ) &&
            (filterType
                ? (transaction.type?.toLowerCase() || '') ===
                  filterType.toLowerCase()
                : true) &&
            (filterResourceType
                ? (transaction.resourceType?.toLowerCase() || '') ===
                  filterResourceType.toLowerCase()
                : true)
    );

    // Pagination logic
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction =
        indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
    );
    const totalPages = Math.ceil(
        filteredTransactions.length / transactionsPerPage
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <Spinner size={3} />
            </div>
        );
    }

    if (error)
        return (
            <div className="text-center text-red-500 min-h-screen flex items-center justify-center">
                {error}
            </div>
        );

    return (
        <div className="p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
                Transactions
            </h1>

            {/* Search & Filters */}
            <div className="mb-8 max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                    <option value="">All Types</option>
                    <option value="earn">Earn</option>
                    <option value="reduction">Reduction</option>
                    <option value="redeem">Redeem</option>
                    <option value="bonus">Bonus</option>
                    <option value="pyq-purchase">Pyq Purchase</option>
                    <option value="note-purchase">Note Purchase</option>
                    <option value="add-point">Add Point</option>
                    <option value="pyq-sale">Pyq Sale</option>
                    <option value="note-sale">Notes Sale</option>
                </select>
                <select
                    value={filterResourceType}
                    onChange={(e) => setFilterResourceType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                    <option value="">All Resource Types</option>
                    <option value="pyq">PYQ</option>
                    <option value="notes">Notes</option>
                    <option value="senior">Senior</option>
                </select>
            </div>

            {/* Transaction Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Points
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Resource Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Resource ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentTransactions.map((transaction) => (
                            <tr
                                key={transaction._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {transaction.user?.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {transaction.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {transaction.points}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {transaction.resourceType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {transaction.resourceId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {new Date(
                                        transaction.createdAt
                                    ).toLocaleDateString()}
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

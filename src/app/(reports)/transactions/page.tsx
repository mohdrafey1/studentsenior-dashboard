'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTransactions } from '@/redux/slices/transactionsSlice';

export default function Transactions() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterResourceType, setFilterResourceType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 12;

    const dispatch = useDispatch<AppDispatch>();

    const { transactions, loading, error } = useSelector(
        (state: RootState) => state.transactions
    );

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    // Filter transactions
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

    return (
        <div className='p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen'>
            <h1 className='text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400  mt-14 mb-2'>
                Transactions
            </h1>

            {/* Search & Filters */}
            <div className='mb-8 max-w-3xl mx-auto flex flex-col md:flex-row gap-4'>
                <input
                    type='text'
                    placeholder='Search by Email...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                >
                    <option value=''>All Types</option>
                    <option value='earn'>Earn</option>
                    <option value='reduction'>Reduction</option>
                    <option value='redeem'>Redeem</option>
                    <option value='bonus'>Bonus</option>
                    <option value='pyq-purchase'>Pyq Purchase</option>
                    <option value='note-purchase'>Note Purchase</option>
                    <option value='add-point'>Add Point</option>
                    <option value='pyq-sale'>Pyq Sale</option>
                    <option value='note-sale'>Notes Sale</option>
                </select>
                <select
                    value={filterResourceType}
                    onChange={(e) => setFilterResourceType(e.target.value)}
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                >
                    <option value=''>All Resource Types</option>
                    <option value='pyq'>PYQ</option>
                    <option value='notes'>Notes</option>
                    <option value='senior'>Senior</option>
                </select>
            </div>

            {currentTransactions.length ? (
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                        <thead>
                            <tr className='bg-indigo-50 dark:bg-gray-700'>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Type
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Points
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Resource Type
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Resource ID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                            {currentTransactions.map((transaction) => (
                                <tr
                                    key={transaction._id}
                                    className='hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {transaction.user?.email}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                transaction.type === 'earn'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : transaction.type ===
                                                      'redeem'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : transaction.type ===
                                                      'reduction'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    : transaction.type ===
                                                      'bonus'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : transaction.type ===
                                                      'pyq-purchase'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : transaction.type ===
                                                      'note-purchase'
                                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                    : transaction.type ===
                                                      'add-point'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : transaction.type ===
                                                      'pyq-sale'
                                                    ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
                                                    : transaction.type ===
                                                      'note-sale'
                                                    ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {transaction.points}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {transaction.resourceType}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {transaction.resourceId}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {new Date(
                                            transaction.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='flex items-center justify-center min-h-screen bg-indigo-50 dark:bg-gray-900'>
                    {loading ? (
                        <Spinner size={2} />
                    ) : (
                        <div className='text-center p-4  rounded-lg shadow-3xl'>
                            <p className='text-xl font-semibold text-red-500 text-center'>
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            )}
            {/* Pagination */}
            <div className=' flex justify-center'>
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

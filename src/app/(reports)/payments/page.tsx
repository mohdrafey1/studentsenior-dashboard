'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchPayments } from '@/redux/slices/paymentListSlice';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';
import { getDateRange } from '@/utils/dateUtils';

export default function AllPayments() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const paymentsPerPage = 12;

    const dispatch = useDispatch<AppDispatch>();

    const { payments, loading, error } = useSelector(
        (state: RootState) => state.paymentList
    );

    const dateFilters = [
        { id: 'all', label: 'All Time' },
        { id: 'last7Days', label: 'Last 7 Days' },
        { id: 'last30Days', label: 'Last 30 Days' },
        { id: 'lastMonth', label: 'Last Month' },
        { id: 'thisMonth', label: 'This Month' },
        { id: 'thisYear', label: 'This Year' },
        { id: 'lastYear', label: 'Last Year' },
        { id: 'last365Days', label: 'Last 365 Days' },
    ];

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    // First filter by date range only
    const getFilteredByDate = (paymentsList: typeof payments) => {
        if (dateFilter === 'all') return paymentsList;

        const dateRange = getDateRange(dateFilter);
        if (!dateRange) return paymentsList;

        const { startDate, endDate } = dateRange;
        return paymentsList.filter((payment) => {
            const paymentDate = new Date(payment.createdAt);
            return paymentDate >= startDate && paymentDate <= endDate;
        });
    };

    // Then apply other filters to the date-filtered payments
    const filteredPayments = getFilteredByDate(payments).filter(
        (payment) =>
            (payment.user?.email?.toLowerCase() || '').includes(
                searchQuery.trim().toLowerCase()
            ) &&
            (filterType
                ? (payment.typeOfPurchase?.toLowerCase() || '') ===
                  filterType.toLowerCase()
                : true) &&
            (filterStatus
                ? (payment.status?.toLowerCase() || '') ===
                  filterStatus.toLowerCase()
                : true)
    );

    // Calculate total amount
    useEffect(() => {
        const total = filteredPayments.reduce((sum, payment) => {
            if (payment.status === 'paid') {
                return sum + (payment.amount || 0);
            }
            return sum;
        }, 0);
        setTotalAmount(total);
    }, [filteredPayments]);

    // Pagination logic
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = filteredPayments.slice(
        indexOfFirstPayment,
        indexOfLastPayment
    );
    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

    return (
        <div className='p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen'>
            <h1 className='text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2'>
                Payment History
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
                    <option value='note_purchase'>Note Purchase</option>
                    <option value='pyq_purchase'>PYQ Purchase</option>
                    <option value='course_purchase'>Course Purchase</option>
                    <option value='add_points'>Add Points</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                >
                    <option value=''>All Statuses</option>
                    <option value='paid'>Paid</option>
                    <option value='pending'>Pending</option>
                    <option value='failed'>Failed</option>
                    <option value='refunded'>Refunded</option>
                </select>
            </div>
            {/* Total Amount Display */}
            <div className='mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-3xl mx-auto'>
                <div className='flex flex-col sm:flex-row justify-between items-center'>
                    <div className='mb-4 sm:mb-0 relative'>
                        <button
                            onClick={() =>
                                setShowDateFilterDropdown(
                                    !showDateFilterDropdown
                                )
                            }
                            className='flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors'
                        >
                            <FiCalendar className='mr-2' />
                            {dateFilters.find((f) => f.id === dateFilter)
                                ?.label || 'All Time'}
                            <FiChevronDown className='ml-2' />
                        </button>

                        {showDateFilterDropdown && (
                            <div className='absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1'>
                                {dateFilters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => {
                                            setDateFilter(filter.id);
                                            setShowDateFilterDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                            dateFilter === filter.id
                                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 rounded-lg flex gap-2 items-center'>
                        <div className='text-sm text-indigo-600 dark:text-indigo-400'>
                            Total Amount (
                            {
                                dateFilters.find((f) => f.id === dateFilter)
                                    ?.label
                            }
                            ) :
                        </div>
                        <div className='text-2xl font-bold text-indigo-800 dark:text-indigo-300'>
                            ₹{totalAmount.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {currentPayments.length ? (
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                        <thead>
                            <tr className='bg-indigo-50 dark:bg-gray-700'>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    View
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    User
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Type
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Amount
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Status
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Transaction ID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                            {currentPayments.map((payment) => (
                                <tr
                                    key={payment._id}
                                    className='hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200'
                                >
                                    <td className='px-2  whitespace-nowrap text-center'>
                                        <Link
                                            href={`payments/${payment._id}`}
                                            className='text-blue-500 ml-4 hover:text-blue-700'
                                        >
                                            <div className='ml-4'>
                                                <div className='text-blue-500 hover:text-blue-700'>
                                                    <FaEye size={20} />
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className='px-2 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            <div className='ml-4'>
                                                <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                                    {payment.user.username}
                                                </div>
                                                <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                    {payment.user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${
                                                    payment.typeOfPurchase ===
                                                    'note_purchase'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : payment.typeOfPurchase ===
                                                          'pyq_purchase'
                                                        ? 'bg-indigo-100 text-indigo-800'
                                                        : payment.typeOfPurchase ===
                                                          'course_purchase'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : payment.typeOfPurchase ===
                                                          'add_points'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {payment.typeOfPurchase.replace(
                                                '_',
                                                ' '
                                            )}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {payment.currency} {payment.amount}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${
                                                payment.status === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : payment.status ===
                                                      'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : payment.status ===
                                                      'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {payment.merchantOrderId}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {new Date(
                                            payment.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='flex items-center justify-center min-h-[50vh]'>
                    {loading ? (
                        <Spinner size={2} />
                    ) : (
                        <div className='text-center p-4 rounded-lg shadow-3xl'>
                            <p className='text-xl font-semibold text-red-500 text-center'>
                                {error ||
                                    'No payments found with current filters'}
                            </p>
                        </div>
                    )}
                </div>
            )}
            {/* Pagination */}
            <div className='flex justify-center mt-6'>
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

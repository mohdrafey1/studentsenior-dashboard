'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { getDateRange } from '@/utils/dateUtils';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUsers } from '@/redux/slices/usersSlice';

interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    college: string;
    phone: string;
    rewardBalance: number;
    rewardPoints: number;
    rewardRedeemed: number;
    createdAt: string;
}

const Users = () => {
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [minPoints, setMinPoints] = useState<number | null>(null);
    const [dateFilter, setDateFilter] = useState<string>('');

    const dispatch = useDispatch<AppDispatch>();

    const { users, loading, error } = useSelector(
        (state: RootState) => state.users
    );

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        let filtered = users;

        if (searchEmail) {
            filtered = filtered.filter((user) =>
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
            );
        }

        if (minPoints !== null) {
            filtered = filtered.filter(
                (user) => user.rewardBalance >= minPoints
            );
        }

        if (dateFilter) {
            const range = getDateRange(dateFilter);
            if (range) {
                const { startDate, endDate } = range;
                filtered = filtered.filter(
                    (user) =>
                        new Date(user.createdAt) >= startDate &&
                        new Date(user.createdAt) <= endDate
                );
            }
        }

        setFilteredData(filtered);
    }, [searchEmail, minPoints, dateFilter, users]);

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 12;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredData.length / usersPerPage);

    return (
        <main className='min-h-screen bg-indigo-50 dark:bg-gray-900 p-6'>
            <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6'>
                <h1 className='text-3xl mt-10 text-center font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
                    All Users
                </h1>

                {/* Filters */}
                <div className='max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
                    <input
                        type='text'
                        placeholder='Search by email...'
                        className='p-2 border rounded-md w-full md:w-1/3 dark:bg-gray-700 dark:text-white'
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />

                    <input
                        type='number'
                        placeholder='Min Reward Points'
                        className='p-2 border rounded-md w-full md:w-1/4 dark:bg-gray-700 dark:text-white'
                        value={minPoints ?? ''}
                        onChange={(e) =>
                            setMinPoints(
                                e.target.value ? Number(e.target.value) : null
                            )
                        }
                    />

                    <select
                        className='p-2 border rounded-md w-full md:w-1/4 dark:bg-gray-700 dark:text-white'
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value=''>Filter by Created Date</option>
                        <option value='thisMonth'>This Month</option>
                        <option value='lastMonth'>Last Month</option>
                        <option value='last3Months'>Last 3 Months</option>
                        <option value='thisYear'>This Year</option>
                        <option value='lastYear'>Last Year</option>
                    </select>
                </div>

                {/* Users Table */}
                {currentUsers.length > 0 ? (
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                            <thead className='bg-gray-50 dark:bg-gray-700'>
                                <tr>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        User
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Contact
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Reward Balance
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Total Earned
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Redeemed
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Joined Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                                {currentUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className='hover:bg-gray-50 dark:hover:bg-gray-700'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10'>
                                                    <Image
                                                        src={
                                                            user.profilePicture
                                                                ? user.profilePicture.replace(
                                                                      '=s96-c',
                                                                      ''
                                                                  )
                                                                : '/default-avatar.png'
                                                        }
                                                        alt={
                                                            user.username ||
                                                            'User Avatar'
                                                        }
                                                        className='rounded-full'
                                                        width={40}
                                                        height={40}
                                                        priority
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                                        {user.username}
                                                    </div>
                                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 dark:text-white'>
                                                {user.college || 'No College'}
                                            </div>
                                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                {user.phone || 'No Phone'}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                                                {user.rewardBalance} Points
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                                            {user.rewardPoints} Points
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                                            {user.rewardRedeemed} Points
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='flex items-center justify-center min-h-[200px]'>
                        {loading ? (
                            <Spinner size={2} />
                        ) : (
                            <div className='text-center p-4 rounded-lg shadow-3xl'>
                                <p className='text-xl font-semibold text-red-500 text-center'>
                                    {error || 'No users found'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                <div className='mt-6'>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </main>
    );
};

export default Users;

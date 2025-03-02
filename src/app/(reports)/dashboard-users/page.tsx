'use client';

import { api } from '@/config/apiUrls';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { getDateRange } from '@/utils/dateUtils';

interface User {
    _id: string;
    username: string;
    email: string;
    college: string;
    role: string;
    createdAt: string;
}

const DashboardUser = () => {
    const [data, setData] = useState<User[]>([]);
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchEmail, setSearchEmail] = useState('');
    const [dateFilter, setDateFilter] = useState<string>('');

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${api.user.allDashboardUser}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error(res.statusText);
                const jsonData: User[] = await res.json();

                setData(jsonData);
                setFilteredData(jsonData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = data;

        if (searchEmail) {
            filtered = filtered.filter((user) =>
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
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
    }, [searchEmail, dateFilter, data]);

    const [currentPage, setCurrentPage] = useState(1);
    const DashboardUserPerPage = 12;
    const indexOfLastUser = currentPage * DashboardUserPerPage;
    const indexOfFirstUser = indexOfLastUser - DashboardUserPerPage;
    const currentDashboardUser = filteredData.slice(
        indexOfFirstUser,
        indexOfLastUser
    );
    const totalPages = Math.ceil(filteredData.length / DashboardUserPerPage);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-700">
                <Spinner size={3} />
            </div>
        );

    if (error)
        return (
            <div className="text-center text-red-500 min-h-screen flex items-center justify-center">
                {error}
            </div>
        );

    return (
        <main className="min-h-screen bg-indigo-50 dark:bg-gray-900 p-6">
            <div className=" bg-indigo-50 dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h1 className="sm:text-3xl mt-10 text-center font-bold mb-6 text-indigo-600 dark:text-indigo-400">
                    All DashboardUser
                </h1>

                {/* Filters */}
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="p-2 border rounded-md w-full md:w-1/3 dark:bg-gray-700 dark:text-white"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />

                    <select
                        className="p-2 border rounded-md w-full md:w-1/4 dark:bg-gray-700 dark:text-white"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="">Filter by Created Date</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="last3Months">Last 3 Months</option>
                        <option value="thisYear">This Year</option>
                        <option value="lastYear">Last Year</option>
                    </select>
                </div>

                {/* DashboardUser List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentDashboardUser.length > 0 ? (
                        currentDashboardUser.map((user) => (
                            <div
                                key={user._id}
                                className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex flex-col justify-center items-center space-x-6">
                                    <div
                                        className={`font-semibold px-3 py-1 rounded-md ${
                                            user.role === 'Admin'
                                                ? 'bg-red-500 text-white'
                                                : user.role === 'Moderator'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-500 text-white' // Default for Visitor or other roles
                                        }`}
                                    >
                                        <h2>{user.role}</h2>
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {user.username}
                                        </h2>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                                            <span className="mr-2">📧</span>
                                            {user.email}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 flex items-center">
                                            <span className="mr-2">🎓</span>
                                            {user.college || 'No College'}
                                        </p>

                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center">
                                            <span className="mr-2">📅</span>
                                            Joined:{' '}
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
                            No DashboardUser found.
                        </p>
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </main>
    );
};

export default DashboardUser;

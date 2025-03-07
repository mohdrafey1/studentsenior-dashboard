'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAddPointsRequests } from '@/redux/slices/addPointSlice';

export default function AddPoints() {
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;

    const dispatch = useDispatch<AppDispatch>();

    const { requests, loading, error } = useSelector(
        (state: RootState) => state.addPoints
    );

    useEffect(() => {
        dispatch(fetchAddPointsRequests());
    }, [dispatch]);

    // Pagination logic
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = requests.slice(
        indexOfFirstRequest,
        indexOfLastRequest
    );
    const totalPages = Math.ceil(requests.length / requestsPerPage);

    return (
        <div className="p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400  mt-14 mb-2">
                Add Points Requests
            </h1>

            {/* Requests Table */}
            {requests.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-indigo-50 dark:bg-gray-700">
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Points Added
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Rupees
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentRequests.map((request) => (
                                <tr
                                    key={request._id}
                                    className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        {request.owner.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        {request.owner.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        {request.pointsAdded}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        ₹{request.rupees}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-xs ${
                                                request.status
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                            }`}
                                        >
                                            {request.status
                                                ? 'Approved'
                                                : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        {new Date(
                                            request.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-indigo-50 dark:bg-gray-900">
                    {loading ? (
                        <Spinner size={2} />
                    ) : (
                        <div className="text-center p-4  rounded-lg shadow-3xl">
                            <p className="text-xl font-semibold text-red-500 text-center">
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

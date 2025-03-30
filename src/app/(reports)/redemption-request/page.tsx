'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchRedemptionRequests } from '@/redux/slices/redemptionSlice';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';

export default function RedemptionRequests() {
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { requests, loading, error } = useSelector(
        (state: RootState) => state.redemption
    );

    useEffect(() => {
        dispatch(fetchRedemptionRequests());
    }, [dispatch]);

    const handleStatusUpdate = async (
        id: string,
        newStatus: 'Pending' | 'Approved' | 'Rejected'
    ) => {
        setUpdatingId(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${api.transactions.redemption}/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            const data: any = response.json();
            toast.success(data.message || 'Request Updated Successfully');
            dispatch(fetchRedemptionRequests());
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Pagination logic
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = requests.slice(
        indexOfFirstRequest,
        indexOfLastRequest
    );
    const totalPages = Math.ceil(requests.length / requestsPerPage);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-500';
            case 'Rejected':
                return 'bg-red-500';
            default:
                return 'bg-yellow-500';
        }
    };

    return (
        <div className='p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen'>
            <h1 className='text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2'>
                Redemption Requests
            </h1>

            {/* Requests Table */}
            {requests.length > 0 ? (
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                        <thead>
                            <tr className='bg-indigo-50 dark:bg-gray-700'>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Username
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    UPI ID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Amount
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Actions
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                            {currentRequests.map((request) => (
                                <tr
                                    key={request._id}
                                    className='hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {request.owner.username}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {request.owner.email}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {request.upiId}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        ₹ {request.rewardBalance / 5}
                                    </td>
                                    <td className='px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(
                                                request.status
                                            )}`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {updatingId === request._id ? (
                                            <Spinner size={0.5} />
                                        ) : (
                                            <div className='flex space-x-2'>
                                                {request.status !==
                                                    'Approved' && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                request._id,
                                                                'Approved'
                                                            )
                                                        }
                                                        className='px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors'
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {request.status !==
                                                    'Rejected' && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                request._id,
                                                                'Rejected'
                                                            )
                                                        }
                                                        className='px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors'
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        {new Date(
                                            request.createdAt
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
                        <div className='text-center p-4 rounded-lg shadow-3xl'>
                            <p className='text-xl font-semibold text-red-500 text-center'>
                                {error || 'No redemption requests found'}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <div className='flex justify-center'>
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

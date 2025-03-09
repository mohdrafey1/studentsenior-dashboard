'use client';

import { useEffect, useState } from 'react';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface ContactRequest {
    _id: string;
    email: string;
    subject: string;
    description: string;
    createdAt: string;
}

export default function ContactUs() {
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [expanded, setExpanded] = useState<{
        [key: string]: { subject: boolean; description: boolean };
    }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${api.report.contactus}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something Error Occured'
                    );
                }
                const data: ContactRequest[] = await res.json();
                setRequests(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [token]);

    // Pagination logic
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = requests.slice(
        indexOfFirstRequest,
        indexOfLastRequest
    );
    const totalPages = Math.ceil(requests.length / requestsPerPage);

    const toggleExpand = (id: string, field: 'subject' | 'description') => {
        setExpanded((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: !prev[id]?.[field] },
        }));
    };

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
            <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400  mt-14 mb-2">
                Contact Us Requests
            </h1>

            {/* Requests Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Email
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
                                {/* Subject with Read More */}
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 max-w-xs">
                                    {expanded[request._id]?.subject ? (
                                        <>
                                            {request.subject}
                                            <button
                                                onClick={() =>
                                                    toggleExpand(
                                                        request._id,
                                                        'subject'
                                                    )
                                                }
                                                className="text-indigo-600 dark:text-indigo-400 font-medium ml-2"
                                            >
                                                Read Less
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {request.subject.length > 15
                                                ? `${request.subject.substring(
                                                      0,
                                                      15
                                                  )}...`
                                                : request.subject}
                                            {request.subject.length > 15 && (
                                                <button
                                                    onClick={() =>
                                                        toggleExpand(
                                                            request._id,
                                                            'subject'
                                                        )
                                                    }
                                                    className="text-indigo-600 dark:text-indigo-400 font-medium ml-2"
                                                >
                                                    Read More
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>

                                {/* Description with Read More */}
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 max-w-xs">
                                    {expanded[request._id]?.description ? (
                                        <>
                                            {request.description}
                                            <button
                                                onClick={() =>
                                                    toggleExpand(
                                                        request._id,
                                                        'description'
                                                    )
                                                }
                                                className="text-indigo-600 dark:text-indigo-400 font-medium ml-2"
                                            >
                                                Read Less
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {request.description.length > 50
                                                ? `${request.description.substring(
                                                      0,
                                                      50
                                                  )}...`
                                                : request.description}
                                            {request.description.length >
                                                50 && (
                                                <button
                                                    onClick={() =>
                                                        toggleExpand(
                                                            request._id,
                                                            'description'
                                                        )
                                                    }
                                                    className="text-indigo-600 dark:text-indigo-400 font-medium ml-2"
                                                >
                                                    Read More
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {request.email}
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
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

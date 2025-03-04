'use client';

import { useEffect, useState } from 'react';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';

interface PyqRequest {
    _id: string;
    subject: string;
    semester: string;
    year: string;
    branch: string;
    examType: string;
    status: boolean;
    whatsapp: number;
    createdAt: string;
}

export default function RequestPyqPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [pyqRequests, setPyqRequests] = useState<PyqRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;

    useEffect(() => {
        if (!collegeName) return;
        const fetchPyqRequests = async () => {
            try {
                const res = await fetch(
                    `${api.pyqs.requestPyq}/${collegeName}`
                );
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const data: PyqRequest[] = await res.json();
                setPyqRequests(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPyqRequests();
    }, [collegeName]);

    // Pagination logic
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = pyqRequests.slice(
        indexOfFirstRequest,
        indexOfLastRequest
    );
    const totalPages = Math.ceil(pyqRequests.length / requestsPerPage);

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
            <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2">
                Requested PYQs
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
                                Semester
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Branch
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Exam Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                WhatsApp
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
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {request.subject}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {request.semester}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {request.year}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {request.branch}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {request.examType}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    <a
                                        href={`https://wa.me/${request.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-500 font-medium hover:underline"
                                    >
                                        {request.whatsapp}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-sm">
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
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
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

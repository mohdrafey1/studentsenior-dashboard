'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Pyq {
    _id: string;
    subject: {
        _id: string;
        subjectName: string;
    };
    slug: string;
    fileUrl: string;
    year: string;
    examType: string;
    owner: {
        _id: string;
        username: string;
    };
    college: string;
    status: boolean;
    rewardPoints: number;
    clickCounts: number;
    solved: boolean;
    isPaid: boolean;
    price: number;
    purchasedBy: string[];
    createdAt: string;
}

export default function PyqPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [pyqs, setPyqs] = useState<Pyq[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [examType, setExamType] = useState('');
    const [year, setYear] = useState('');
    const [status, setStatus] = useState('');
    const [solved, setSolved] = useState('');
    const [minClickCount, setMinClickCount] = useState('');
    const pyqsPerPage = 10;

    useEffect(() => {
        if (!collegeName) return;
        const fetchPyqs = async () => {
            try {
                const res = await fetch(`${api.pyqs.getPyqs}/${collegeName}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const jsonData: Pyq[] = await res.json();
                setPyqs(jsonData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPyqs();
    }, [collegeName]);

    const filteredPyqs = pyqs.filter(
        (pyq) =>
            (searchQuery === '' ||
                pyq.subject.subjectName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) &&
            (examType === '' || pyq.examType === examType) &&
            (year === '' || pyq.year === year) &&
            (status === '' || String(pyq.status) === status) &&
            (solved === '' || String(pyq.solved) === solved) &&
            (minClickCount === '' || pyq.clickCounts >= Number(minClickCount))
    );

    const indexOfLastPyq = currentPage * pyqsPerPage;
    const indexOfFirstPyq = indexOfLastPyq - pyqsPerPage;
    const currentPyqs = filteredPyqs.slice(indexOfFirstPyq, indexOfLastPyq);
    const totalPages = Math.ceil(filteredPyqs.length / pyqsPerPage);

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
            <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
                Previous Year Question Papers
            </h1>

            <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by subject name..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                >
                    <option value="">All Exam Types</option>
                    <option value="midsem1">Midsem 1</option>
                    <option value="midsem2">Midsem 2</option>
                    <option value="endsem">Endsem</option>
                    <option value="improvement">Improvements</option>
                </select>
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">All Years</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2021-22">2021-22</option>
                </select>
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                </select>
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={solved}
                    onChange={(e) => setSolved(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="true">Solved</option>
                    <option value="false">Unsolved</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Click Count"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={minClickCount}
                    onChange={(e) => setMinClickCount(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                View
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Exam Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Uploaded By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Clicks
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentPyqs.map((pyq) => (
                            <tr
                                key={pyq._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    <a
                                        href={pyq.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        View
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {pyq.subject.subjectName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {pyq.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {pyq.examType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {pyq.owner.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {pyq.clickCounts}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

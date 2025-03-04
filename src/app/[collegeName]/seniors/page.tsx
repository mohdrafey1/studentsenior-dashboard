'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Senior {
    _id: string;
    name: string;
    branch: string;
    year: string;
    domain: string;
    profilePicture: string;
    whatsapp: string;
    telegram: string;
    college: {
        _id: string;
        name: string;
    };
    owner: {
        _id: string;
        username: string;
    };
    status: boolean;
    priority: number;
    clickCount: number;
    slug: string;
    createdAt: string;
}

export default function SeniorPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [seniors, setSeniors] = useState<Senior[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const seniorsPerPage = 10;

    // Filter states
    const [searchName, setSearchName] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [minClickCount, setMinClickCount] = useState('');

    useEffect(() => {
        if (!collegeName) return;
        const fetchSeniors = async () => {
            try {
                const res = await fetch(
                    `${api.seniors.getSeniors}/${collegeName}`
                );
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const jsonData: Senior[] = await res.json();
                setSeniors(jsonData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSeniors();
    }, [collegeName]);

    // Apply filters
    const filteredSeniors = seniors.filter((senior) => {
        return (
            (searchName === '' ||
                senior.name.toLowerCase().includes(searchName.toLowerCase())) &&
            (filterStatus === 'all' ||
                senior.status.toString() === filterStatus) &&
            (minClickCount === '' || senior.clickCount >= Number(minClickCount))
        );
    });

    // Pagination logic
    const indexOfLastSenior = currentPage * seniorsPerPage;
    const indexOfFirstSenior = indexOfLastSenior - seniorsPerPage;
    const currentSeniors = filteredSeniors.slice(
        indexOfFirstSenior,
        indexOfLastSenior
    );
    const totalPages = Math.ceil(filteredSeniors.length / seniorsPerPage);

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
            <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2">
                Senior Profiles
            </h1>

            {/* Filter Section */}
            <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                {/* Search by Name */}
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">All Status</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                </select>

                {/* Minimum Click Count */}
                <input
                    type="number"
                    placeholder="Min Clicks"
                    value={minClickCount}
                    onChange={(e) => setMinClickCount(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Profile
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Branch
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Domain
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Clicks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentSeniors.map((senior) => (
                            <tr
                                key={senior._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Image
                                        src={senior.profilePicture}
                                        alt={senior.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                        priority
                                        unoptimized
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {senior.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {senior.branch}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {senior.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {senior.domain}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white text-xs ${
                                            senior.status
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}
                                    >
                                        {senior.status ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {senior.clickCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {new Date(
                                        senior.createdAt
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

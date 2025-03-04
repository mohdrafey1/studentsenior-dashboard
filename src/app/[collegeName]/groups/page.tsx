'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Group {
    _id: string;
    title: string;
    link: string;
    info: string;
    domain: string;
    status: boolean;
    college: string;
    createdAt: string;
}

export default function GroupPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const groupsPerPage = 10;

    useEffect(() => {
        if (!collegeName) return;

        const fetchGroups = async () => {
            try {
                const res = await fetch(
                    `${api.groups.getGroups}/${collegeName}`
                );
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const jsonData: Group[] = await res.json();
                setGroups(jsonData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [collegeName]);

    const filteredGroups = groups.filter(
        (group) =>
            searchQuery === '' ||
            group.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
    const currentGroups = filteredGroups.slice(
        indexOfFirstGroup,
        indexOfLastGroup
    );
    const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

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
            <h1 className="text-3xl mt-14 mb-2 font-bold text-center text-indigo-600 dark:text-indigo-400">
                Groups
            </h1>

            <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by group title..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Group Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Domain
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Join Link
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentGroups.map((group) => (
                            <tr
                                key={group._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 truncate max-w-2.5">
                                    {group.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 truncate max-w-3">
                                    {group.info}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {group.domain}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white text-xs ${
                                            group.status
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}
                                    >
                                        {group.status ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Join Group
                                    </a>
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

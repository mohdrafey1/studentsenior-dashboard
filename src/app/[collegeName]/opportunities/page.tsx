'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Opportunity {
    _id: string;
    name: string;
    description: string;
    owner: {
        _id: string;
        username: string;
    };
    college: string;
    status: boolean;
    whatsapp: string;
    email: string;
    slug: string;
    createdAt: string;
}

export default function OpportunitiesPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const opportunitiesPerPage = 10;

    useEffect(() => {
        if (!collegeName) return;

        const fetchOpportunities = async () => {
            try {
                const res = await fetch(
                    `${api.opportunity.getOpportunities}/${collegeName}`
                );
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const jsonData: Opportunity[] = await res.json();
                setOpportunities(jsonData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOpportunities();
    }, [collegeName]);

    const filteredOpportunities = opportunities.filter(
        (opportunity) =>
            (searchQuery === '' ||
                opportunity.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) &&
            (status === '' || String(opportunity.status) === status)
    );

    const indexOfLastOpportunity = currentPage * opportunitiesPerPage;
    const indexOfFirstOpportunity =
        indexOfLastOpportunity - opportunitiesPerPage;
    const currentOpportunities = filteredOpportunities.slice(
        indexOfFirstOpportunity,
        indexOfLastOpportunity
    );
    const totalPages = Math.ceil(
        filteredOpportunities.length / opportunitiesPerPage
    );

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
                Opportunities
            </h1>

            <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by opportunity title..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Pending</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Posted By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Date Posted
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentOpportunities.map((opportunity) => (
                            <tr
                                key={opportunity._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    <a
                                        href={`/opportunity/${opportunity.slug}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {opportunity.name}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {opportunity.description.length > 50
                                        ? opportunity.description.substring(
                                              0,
                                              50
                                          ) + '...'
                                        : opportunity.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {opportunity.owner.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    <a
                                        href={`mailto:${opportunity.email}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {opportunity.email}
                                    </a>
                                    <br />
                                    <a
                                        href={`https://wa.me/${opportunity.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-500 hover:underline"
                                    >
                                        {opportunity.whatsapp}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white text-xs ${
                                            opportunity.status
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}
                                    >
                                        {opportunity.status
                                            ? 'Approved'
                                            : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {new Date(
                                        opportunity.createdAt
                                    ).toLocaleDateString()}
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

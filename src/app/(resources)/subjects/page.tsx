'use client';

import { useEffect, useState } from 'react';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Subject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
    branch: {
        _id: string;
        branchName: string;
        branchCode: string;
    };
    totalNotes: number;
    totalPyqs: number;
    clickCounts: number;
    createdAt: string;
}

export default function Subjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`${api.resource.subjects}`);
                if (!res.ok) throw new Error('Failed to fetch subjects');
                const data: Subject[] = await res.json();
                setSubjects(data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                setError('Something went wrong while fetching subjects');
                toast.error('Something went wrong while fetching subjects');
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    // Filter subjects based on search query and branch filter
    const filteredSubjects = subjects.filter((subject) => {
        const matchesSearchQuery =
            subject.subjectName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            subject.subjectCode
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesBranchFilter = branchFilter
            ? subject.branch?.branchName.toLowerCase() ===
              branchFilter.toLowerCase()
            : true;
        return matchesSearchQuery && matchesBranchFilter;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentSubjects = filteredSubjects.slice(
        indexOfFirstUser,
        indexOfLastUser
    );
    const totalPages = Math.ceil(filteredSubjects.length / usersPerPage);

    // Get unique branches for the filter dropdown
    const uniqueBranches = Array.from(
        new Set(subjects.map((subject) => subject.branch?.branchName))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-700">
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
            <h1 className="text-3xl font-bold text-center text-indigo-400 mt-14 mb-2">
                Subjects
            </h1>

            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by subject name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                    <option value="">Filter by Branch</option>
                    {uniqueBranches.map((branchName) => (
                        <option key={branchName} value={branchName}>
                            {branchName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subject Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Subject Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Subject Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Semester
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Branch
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Notes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                PYQs
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
                        {currentSubjects.map((subject) => (
                            <tr
                                key={subject._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {subject.subjectName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {subject.subjectCode}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {subject.semester}
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
                                    title={subject.branch?.branchName}
                                >
                                    {subject.branch?.branchCode}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {subject.totalNotes}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {subject.totalPyqs}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {subject.clickCounts}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {new Date(
                                        subject.createdAt
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

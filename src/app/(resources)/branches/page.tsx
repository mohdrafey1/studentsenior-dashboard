'use client';

import { useEffect, useState } from 'react';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Branch {
    _id: string;
    branchName: string;
    branchCode: string;
    course: {
        _id: string;
        courseCode: string;
        courseName: string;
    };
    totalSubject: number;
    totalSenior: number;
    totalNotes: number;
    totalPyqs: number;
    clickCounts: number;
    createdAt: string;
}

export default function Branches() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const branchPerPage = 10;

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await fetch(`${api.resource.branches}`);
                if (!res.ok) throw new Error('Failed to fetch branches');
                const data: Branch[] = await res.json();
                setBranches(data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setError('Something went wrong while fetching branches');
                toast.error('Something went wrong while fetching branches');
            } finally {
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    // Filter branches based on search query and course filter
    const filteredBranches = branches.filter((branch) => {
        const matchesSearchQuery =
            branch.branchName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            branch.branchCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourseFilter = courseFilter
            ? branch.course?.courseName.toLowerCase() ===
              courseFilter.toLowerCase()
            : true;
        return matchesSearchQuery && matchesCourseFilter;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * branchPerPage;
    const indexOfFirstUser = indexOfLastUser - branchPerPage;
    const currentBranches = filteredBranches.slice(
        indexOfFirstUser,
        indexOfLastUser
    );
    const totalPages = Math.ceil(filteredBranches.length / branchPerPage);

    // Get unique courses for the filter dropdown
    const uniqueCourses = Array.from(
        new Set(branches.map((branch) => branch.course?.courseName))
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
            <h1 className="text-3xl font-bold text-center text-indigo-400 mb-8">
                Branches
            </h1>

            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by branch name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                    <option value="">Filter by Course</option>
                    {uniqueCourses.map((courseName) => (
                        <option key={courseName} value={courseName}>
                            {courseName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Branch Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Branch Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Branch Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Subjects
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Seniors
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
                        {currentBranches.map((branch) => (
                            <tr
                                key={branch._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {branch.branchName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {branch.branchCode}
                                </td>
                                <td
                                    title={branch.course?.courseName}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
                                >
                                    {branch.course?.courseCode}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {branch.totalSubject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {branch.totalSenior}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {branch.totalNotes}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {branch.totalPyqs}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {branch.clickCounts}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {new Date(
                                        branch.createdAt
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

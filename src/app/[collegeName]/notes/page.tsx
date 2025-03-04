'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Note {
    _id: string;
    subject: {
        _id: string;
        subjectName: string;
    };
    slug: string;
    title: string;
    fileUrl: string;
    description: string;
    owner: {
        _id: string;
        username: string;
    };
    college: string;
    status: boolean;
    rewardPoints: number;
    clickCounts: number;
    isPaid: boolean;
    price: number;
    purchasedBy: string[];
    createdAt: string;
}

export default function NotesPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('');
    const [isPaid, setIsPaid] = useState('');
    const [minClickCount, setMinClickCount] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 10;

    useEffect(() => {
        if (!collegeName) return;

        const fetchNotes = async () => {
            try {
                const res = await fetch(`${api.notes.getNotes}/${collegeName}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const jsonData: Note[] = await res.json();
                setNotes(jsonData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [collegeName]);

    const filteredNotes = notes.filter(
        (note) =>
            (searchQuery === '' ||
                note.subject.subjectName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) &&
            (status === '' || String(note.status) === status) &&
            (isPaid === '' || String(note.isPaid) === isPaid) &&
            (minClickCount === '' || note.clickCounts >= Number(minClickCount))
    );

    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

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
                Notes Collection
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
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                </select>
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    value={isPaid}
                    onChange={(e) => setIsPaid(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="true">Paid</option>
                    <option value="false">Free</option>
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
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Uploaded By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Clicks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Paid
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentNotes.map((note) => (
                            <tr
                                key={note._id}
                                className="hover:bg-indigo-50 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    <a
                                        href={note.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        View
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {note.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {note.subject.subjectName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {note.owner.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {note.clickCounts}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {note.isPaid
                                        ? `₹${note.price / 5}`
                                        : 'Free'}
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

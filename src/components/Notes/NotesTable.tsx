import React from 'react';
import { FaEdit, FaTrash, FaEye, FaHeart } from 'react-icons/fa';
import { Spinner } from '@/components/ui/Spinner';
import { Note } from '@/redux/slices/notesSlice';

interface NotesTableProps {
    notes: Note[];
    loading: boolean;
    error: string | null;
    onView: (note: Note) => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({
    notes,
    loading,
    error,
    onView,
    onEdit,
    onDelete,
}) => {
    if (notes.length > 0) {
        return (
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
                    <thead>
                        <tr className='bg-indigo-50 dark:bg-gray-700'>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                View
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Title
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Subject
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Status
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Uploaded By
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Likes
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Clicks
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Paid
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {notes.map((note) => (
                            <tr
                                key={note._id}
                                className='hover:bg-indigo-50 dark:hover:bg-gray-700'
                            >
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <button
                                        onClick={() => onView(note)}
                                        className='text-blue-500 hover:text-blue-700 transition-colors'
                                        title='View Details'
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {note.title}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {note.subject.subjectName}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <span
                                        className={`px-3 py-1 rounded-full text-white text-xs ${
                                            note.status
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}
                                    >
                                        {note.status ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {note.owner.username}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <div className='flex items-center'>
                                        <FaHeart className='text-red-500 mr-1' />
                                        {note.likes.length}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {note.clickCounts}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {note.isPaid ? (
                                        <span className='text-red-600'>
                                            ₹{note.price / 5}
                                        </span>
                                    ) : (
                                        <span className='text-green-600'>
                                            Free
                                        </span>
                                    )}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <div className='flex space-x-2'>
                                        <button
                                            onClick={() => onEdit(note)}
                                            className='text-blue-500 hover:text-blue-700 transition-colors'
                                            title='Edit'
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => onDelete(note)}
                                            className='text-red-500 hover:text-red-700 transition-colors'
                                            title='Delete'
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center min-h-[50vh]'>
            {loading ? (
                <Spinner size={2} />
            ) : (
                <div className='text-center p-4 rounded-lg shadow-3xl'>
                    <p className='text-xl font-semibold text-red-500 text-center'>
                        {error || 'No notes found'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotesTable;

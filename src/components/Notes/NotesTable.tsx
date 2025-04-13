import React from 'react';
import {
    FaEdit,
    FaTrash,
    FaEye,
    FaHeart,
    FaFileAlt,
    FaUser,
    FaMousePointer,
    FaTag,
    FaMoneyBillWave,
} from 'react-icons/fa';
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
    // For mobile view
    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (notes.length === 0) {
        return (
            <div className='flex items-center justify-center min-h-[50vh]'>
                {loading ? (
                    <Spinner size={2} />
                ) : (
                    <div className='text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg max-w-md'>
                        <div className='mb-4'>
                            <svg
                                className='w-16 h-16 mx-auto text-gray-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                            </svg>
                        </div>
                        <p className='text-xl font-semibold text-red-500 mb-2'>
                            {error || 'No notes found'}
                        </p>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Try uploading a new note or check back later.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='w-full overflow-x-auto rounded-xl shadow-lg'>
            {/* Desktop view */}
            <div className='hidden md:block'>
                <table className='w-full bg-white dark:bg-gray-800 rounded-xl'>
                    <thead>
                        <tr className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white'>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                View
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Title
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Subject
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Status
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Uploaded By
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Likes
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Clicks
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Paid
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {notes.map((note) => (
                            <tr
                                key={note._id}
                                className='transition-colors hover:bg-indigo-50 dark:hover:bg-gray-700'
                            >
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <button
                                        onClick={() => onView(note)}
                                        className='p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                                        title='View Details'
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>
                                    {note.title}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {note.subject.subjectName}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            note.status
                                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                        }`}
                                    >
                                        {note.status ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {note.owner.username}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <div className='flex items-center'>
                                        <FaHeart className='text-red-500 mr-1' />
                                        {note.likes.length}
                                    </div>
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <span className='inline-flex items-center gap-1'>
                                        <FaMousePointer
                                            className='text-gray-400'
                                            size={12}
                                        />
                                        {note.clickCounts}
                                    </span>
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm font-medium'>
                                    {note.isPaid ? (
                                        <span className='px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 rounded-full text-xs'>
                                            ₹{note.price / 5}
                                        </span>
                                    ) : (
                                        <span className='px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-xs'>
                                            Free
                                        </span>
                                    )}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <div className='flex space-x-2'>
                                        <button
                                            onClick={() => onEdit(note)}
                                            className='p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors'
                                            title='Edit'
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => onDelete(note)}
                                            className='p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors'
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

            {/* Mobile view - card-based layout */}
            <div className='md:hidden space-y-4'>
                {notes.map((note) => (
                    <div
                        key={note._id}
                        className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
                    >
                        <div
                            className='px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer'
                            onClick={() => toggleExpand(note._id)}
                        >
                            <div className='font-medium truncate'>
                                {note.title}
                            </div>
                            <div className='text-xs mt-1 flex justify-between items-center'>
                                <span>{note.subject.subjectName}</span>
                                <span className='flex items-center gap-1'>
                                    <FaHeart size={10} />
                                    {note.likes.length}
                                </span>
                            </div>
                        </div>

                        <div className='px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700'>
                            <div className='flex items-center gap-2'>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        note.status
                                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                    }`}
                                >
                                    {note.status ? 'Approved' : 'Pending'}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        note.isPaid
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                    }`}
                                >
                                    {note.isPaid
                                        ? `₹${note.price / 5}`
                                        : 'Free'}
                                </span>
                            </div>
                            <div className='flex space-x-2'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(note);
                                    }}
                                    className='p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                                    title='View Details'
                                >
                                    <FaEye size={14} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(note);
                                    }}
                                    className='p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors'
                                    title='Edit'
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(note);
                                    }}
                                    className='p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors'
                                    title='Delete'
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>

                        {expandedId === note._id && (
                            <div className='p-4 space-y-2 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <FaFileAlt className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Title:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {note.title}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaTag className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Subject:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {note.subject.subjectName}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaUser className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Uploaded By:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {note.owner.username}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaMousePointer className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Clicks:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {note.clickCounts}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaMoneyBillWave className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Price:
                                    </span>
                                    <span
                                        className={`${
                                            note.isPaid
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        {note.isPaid
                                            ? `₹${note.price / 5}`
                                            : 'Free'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesTable;

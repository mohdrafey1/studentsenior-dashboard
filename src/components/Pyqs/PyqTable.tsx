import React from 'react';
import {
    FaEdit,
    FaTrash,
    FaEye,
    FaFileAlt,
    FaCalendarAlt,
    FaClipboardCheck,
    FaUser,
    FaMousePointer,
} from 'react-icons/fa';
import { Pyq } from '@/redux/slices/pyqSlice';

interface PyqTableProps {
    pyqs: Pyq[];
    onView: (pyq: Pyq) => void;
    onEdit: (pyq: Pyq) => void;
    onDelete: (pyq: Pyq) => void;
}

const PyqTable: React.FC<PyqTableProps> = ({
    pyqs,
    onView,
    onEdit,
    onDelete,
}) => {
    // For mobile view
    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

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
                                Subject
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Year
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Exam Type
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Status
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Uploaded By
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Clicks
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {pyqs.map((pyq) => (
                            <tr
                                key={pyq._id}
                                className='transition-colors hover:bg-indigo-50 dark:hover:bg-gray-700'
                            >
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <button
                                        onClick={() => onView(pyq)}
                                        className='p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                                        title='View Details'
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>
                                    {pyq.subject.subjectName}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {pyq.year}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {pyq.examType}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            pyq.status
                                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                        }`}
                                    >
                                        {pyq.status ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    {pyq.owner.username}
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <span className='inline-flex items-center gap-1'>
                                        <FaMousePointer
                                            className='text-gray-400'
                                            size={12}
                                        />
                                        {pyq.clickCounts}
                                    </span>
                                </td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                    <div className='flex space-x-2'>
                                        <button
                                            onClick={() => onEdit(pyq)}
                                            className='p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors'
                                            title='Edit'
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => onDelete(pyq)}
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
                {pyqs.map((pyq) => (
                    <div
                        key={pyq._id}
                        className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
                    >
                        <div
                            className='px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center cursor-pointer'
                            onClick={() => toggleExpand(pyq._id)}
                        >
                            <div className='font-medium'>
                                {pyq.subject.subjectName}
                            </div>
                            <div className='text-xs'>
                                {pyq.year} • {pyq.examType}
                            </div>
                        </div>

                        <div className='px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700'>
                            <div className='flex items-center gap-2'>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        pyq.status
                                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                    }`}
                                >
                                    {pyq.status ? 'Approved' : 'Pending'}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        pyq.isPaid
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                    }`}
                                >
                                    {pyq.isPaid ? `₹${pyq.price / 5}` : 'Free'}
                                </span>
                                <span className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                                    <FaMousePointer size={10} />
                                    {pyq.clickCounts}
                                </span>
                            </div>
                            <div className='flex space-x-2'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(pyq);
                                    }}
                                    className='p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                                    title='View Details'
                                >
                                    <FaEye size={14} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(pyq);
                                    }}
                                    className='p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors'
                                    title='Edit'
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(pyq);
                                    }}
                                    className='p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors'
                                    title='Delete'
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>

                        {expandedId === pyq._id && (
                            <div className='p-4 space-y-2 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <FaFileAlt className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Subject:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {pyq.subject.subjectName}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaCalendarAlt className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Year:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {pyq.year}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaClipboardCheck className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Exam Type:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {pyq.examType}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaUser className='text-indigo-500' />
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Uploaded By:
                                    </span>
                                    <span className='text-gray-800 dark:text-gray-200'>
                                        {pyq.owner.username}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {pyqs.length === 0 && (
                <div className='py-12 text-center text-gray-500 dark:text-gray-400'>
                    No papers available. Check back later or upload a new one.
                </div>
            )}
        </div>
    );
};

export default PyqTable;

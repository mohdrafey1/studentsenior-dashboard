import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
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
    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
                <thead>
                    <tr className='bg-indigo-50 dark:bg-gray-700'>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            View
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            Subject
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            Year
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            Exam Type
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            Status
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            Uploaded By
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            Clicks
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {pyqs.map((pyq) => (
                        <tr
                            key={pyq._id}
                            className='hover:bg-indigo-50 dark:hover:bg-gray-700'
                        >
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                <button
                                    onClick={() => onView(pyq)}
                                    className='text-blue-500 hover:text-blue-700 transition-colors'
                                    title='View Details'
                                >
                                    <FaEye />
                                </button>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                {pyq.subject.subjectName}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                {pyq.year}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                {pyq.examType}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                <span
                                    className={`px-3 py-1 rounded-full text-white text-xs ${
                                        pyq.status
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                    }`}
                                >
                                    {pyq.status ? 'Approved' : 'Pending'}
                                </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                {pyq.owner.username}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                {pyq.clickCounts}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                <div className='flex space-x-2'>
                                    <button
                                        onClick={() => onEdit(pyq)}
                                        className='text-blue-500 hover:text-blue-700 transition-colors'
                                        title='Edit'
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onDelete(pyq)}
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
};

export default PyqTable;

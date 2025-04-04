'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Modal from '@/components/ui/Modal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import { fetchPyqs, updatePyq, deletePyq, Pyq } from '@/redux/slices/pyqSlice';

export default function PyqPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [searchQuery, setSearchQuery] = useState('');
    const [examTypeFilter, setExamTypeFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [solvedFilter, setSolvedFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPyq, setCurrentPyq] = useState<Pyq | null>(null);
    const [formData, setFormData] = useState({
        year: '',
        examType: '',
        status: '',
        solved: '',
        isPaid: '',
        price: '',
    });

    const dispatch = useDispatch<AppDispatch>();
    const { pyqs, loading, error } = useSelector(
        (state: RootState) => state.pyqs
    );

    const pyqsPerPage = 10;

    useEffect(() => {
        if (collegeName) {
            dispatch(fetchPyqs(collegeName as string));
        }
    }, [collegeName, dispatch]);

    // Filter pyqs
    const filteredPyqs = pyqs.filter((pyq) => {
        const matchesSearchQuery = pyq.subject.subjectName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesExamType = examTypeFilter
            ? pyq.examType === examTypeFilter
            : true;
        const matchesYear = yearFilter ? pyq.year === yearFilter : true;
        const matchesStatus =
            statusFilter !== '' ? String(pyq.status) === statusFilter : true;
        const matchesSolved =
            solvedFilter !== '' ? String(pyq.solved) === solvedFilter : true;

        return (
            matchesSearchQuery &&
            matchesExamType &&
            matchesYear &&
            matchesStatus &&
            matchesSolved
        );
    });

    // Pagination logic
    const indexOfLastPyq = currentPage * pyqsPerPage;
    const indexOfFirstPyq = indexOfLastPyq - pyqsPerPage;
    const currentPyqs = filteredPyqs.slice(indexOfFirstPyq, indexOfLastPyq);
    const totalPages = Math.ceil(filteredPyqs.length / pyqsPerPage);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openViewModal = (pyq: Pyq) => {
        setCurrentPyq(pyq);
        setIsViewModalOpen(true);
    };

    const openEditModal = (pyq: Pyq) => {
        setCurrentPyq(pyq);
        setFormData({
            year: pyq.year,
            examType: pyq.examType,
            status: String(pyq.status),
            solved: String(pyq.solved),
            isPaid: String(pyq.isPaid),
            price: String(pyq.price),
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (pyq: Pyq) => {
        setCurrentPyq(pyq);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPyq) return;

        try {
            const updatedPyq = {
                year: formData.year,
                examType: formData.examType,
                status: formData.status === 'true',
                solved: formData.solved === 'true',
                isPaid: formData.isPaid === 'true',
                price: Number(formData.price),
            };

            await dispatch(
                updatePyq({
                    id: currentPyq._id,
                    pyqData: updatedPyq,
                })
            ).unwrap();
            toast.success('PYQ updated successfully');
            setIsEditModalOpen(false);
            dispatch(fetchPyqs(collegeName as string));
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to update PYQ'
            );
        }
    };

    const handleDelete = async () => {
        if (!currentPyq) return;
        try {
            await dispatch(deletePyq(currentPyq._id)).unwrap();
            toast.success('PYQ deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to delete PYQ'
            );
        }
    };

    return (
        <div className='min-h-screen bg-indigo-50 dark:bg-gray-900 p-6'>
            <h1 className='text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2'>
                Previous Year Question Papers
            </h1>

            <div className='mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4'>
                <input
                    type='text'
                    placeholder='Search by subject name...'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    value={examTypeFilter}
                    onChange={(e) => setExamTypeFilter(e.target.value)}
                >
                    <option value=''>All Exam Types</option>
                    <option value='midsem1'>Midsem 1</option>
                    <option value='midsem2'>Midsem 2</option>
                    <option value='endsem'>Endsem</option>
                    <option value='improvement'>Improvements</option>
                </select>
                <select
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                >
                    <option value=''>All Years</option>
                    <option value='2024-25'>2024-25</option>
                    <option value='2023-24'>2023-24</option>
                    <option value='2022-23'>2022-23</option>
                    <option value='2021-22'>2021-22</option>
                </select>
                <select
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value=''>All Status</option>
                    <option value='true'>Approved</option>
                    <option value='false'>Pending</option>
                </select>
                <select
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    value={solvedFilter}
                    onChange={(e) => setSolvedFilter(e.target.value)}
                >
                    <option value=''>All</option>
                    <option value='true'>Solved</option>
                    <option value='false'>Unsolved</option>
                </select>
            </div>

            {currentPyqs.length > 0 ? (
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
                            {currentPyqs.map((pyq) => (
                                <tr
                                    key={pyq._id}
                                    className='hover:bg-indigo-50 dark:hover:bg-gray-700'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        <button
                                            onClick={() => openViewModal(pyq)}
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
                                            {pyq.status
                                                ? 'Approved'
                                                : 'Pending'}
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
                                                onClick={() =>
                                                    openEditModal(pyq)
                                                }
                                                className='text-blue-500 hover:text-blue-700 transition-colors'
                                                title='Edit'
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openDeleteModal(pyq)
                                                }
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
            ) : (
                <div className='flex items-center justify-center min-h-[50vh]'>
                    {loading ? (
                        <Spinner size={2} />
                    ) : (
                        <div className='text-center p-4 rounded-lg shadow-3xl'>
                            <p className='text-xl font-semibold text-red-500 text-center'>
                                {error || 'No Pyqs found'}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <div className='mt-8 flex justify-center'>
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* View PYQ Details Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title='PYQ Details'
            >
                {currentPyq && (
                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Subject
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.subject.subjectName}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Year
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.year}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Exam Type
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.examType}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Status
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.status ? 'Approved' : 'Pending'}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Uploaded By
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.owner.username}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    College
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.college}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Solved
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.solved ? 'Yes' : 'No'}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Paid
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.isPaid ? 'Yes' : 'No'}
                                </p>
                            </div>
                            {currentPyq.isPaid && (
                                <div>
                                    <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                        Price
                                    </h3>
                                    <p className='text-gray-800 dark:text-gray-200'>
                                        ₹{currentPyq.price}
                                    </p>
                                </div>
                            )}
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Clicks
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {currentPyq.clickCounts}
                                </p>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                    Upload Date
                                </h3>
                                <p className='text-gray-800 dark:text-gray-200'>
                                    {new Date(
                                        currentPyq.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
                                Purchased By ({currentPyq.purchasedBy.length})
                            </h3>
                            {currentPyq.purchasedBy.length > 0 ? (
                                <div className='mt-2 max-h-40 overflow-y-auto'>
                                    {currentPyq.purchasedBy.map(
                                        (userId, index) => (
                                            <div
                                                key={index}
                                                className='py-1 border-b border-gray-200 dark:border-gray-700'
                                            >
                                                User ID: {userId}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className='text-gray-500 dark:text-gray-400'>
                                    No purchases yet
                                </p>
                            )}
                        </div>

                        <div className='flex justify-end pt-4'>
                            <a
                                href={currentPyq.fileUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'
                            >
                                Open PDF
                            </a>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit PYQ Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title='Edit PYQ'
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Year
                        </label>
                        <input
                            type='text'
                            name='year'
                            value={formData.year}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Exam Type
                        </label>
                        <select
                            name='examType'
                            value={formData.examType}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        >
                            <option value='midsem1'>Midsem 1</option>
                            <option value='midsem2'>Midsem 2</option>
                            <option value='endsem'>Endsem</option>
                            <option value='improvement'>Improvements</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Status
                        </label>
                        <select
                            name='status'
                            value={formData.status}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        >
                            <option value='true'>Approved</option>
                            <option value='false'>Pending</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Solved
                        </label>
                        <select
                            name='solved'
                            value={formData.solved}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        >
                            <option value='true'>Solved</option>
                            <option value='false'>Unsolved</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Paid
                        </label>
                        <select
                            name='isPaid'
                            value={formData.isPaid}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        >
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                        </select>
                    </div>
                    {formData.isPaid === 'true' && (
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                Price
                            </label>
                            <input
                                type='number'
                                name='price'
                                value={formData.price}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                                required
                            />
                        </div>
                    )}
                    <div className='flex justify-end space-x-3 pt-4'>
                        <button
                            type='button'
                            onClick={() => setIsEditModalOpen(false)}
                            className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Update PYQ
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title='Delete PYQ'
                message={`Are you sure you want to delete PYQ of ${currentPyq?.subject.subjectName} (${currentPyq?.year}, ${currentPyq?.examType})? This action cannot be undone.`}
            />
        </div>
    );
}

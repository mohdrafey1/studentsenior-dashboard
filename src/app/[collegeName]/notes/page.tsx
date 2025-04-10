'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { FaEdit, FaTrash, FaEye, FaHeart } from 'react-icons/fa';
import Modal from '@/components/ui/Modal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import {
    fetchNotes,
    updateNote,
    deleteNote,
    Note,
} from '@/redux/slices/notesSlice';
import { api, API_KEY } from '@/config/apiUrls';
import {
    FileText,
    User,
    Calendar,
    CheckCircle,
    Heart,
    MousePointer,
    CreditCard,
    IndianRupee,
    UserCircle,
    FileDown,
    Loader2,
} from 'lucide-react';

export default function NotesPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isPaidFilter, setIsPaidFilter] = useState('');
    const [minClickFilter, setMinClickFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        isPaid: '',
        price: '',
    });
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfLoading, setPdfLoading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { notes, loading, error } = useSelector(
        (state: RootState) => state.notes
    );

    const notesPerPage = 10;

    useEffect(() => {
        if (collegeName) {
            dispatch(fetchNotes(collegeName as string));
        }
    }, [collegeName, dispatch]);

    // Filter notes
    const filteredNotes = notes.filter((note) => {
        const matchesSearchQuery =
            note.subject.subjectName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            note.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter !== '' ? String(note.status) === statusFilter : true;
        const matchesIsPaid =
            isPaidFilter !== '' ? String(note.isPaid) === isPaidFilter : true;
        const matchesMinClick =
            minClickFilter !== ''
                ? note.clickCounts >= Number(minClickFilter)
                : true;

        return (
            matchesSearchQuery &&
            matchesStatus &&
            matchesIsPaid &&
            matchesMinClick
        );
    });

    // Pagination logic
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchPdfUrl = async (fileUrl: string) => {
        setPdfLoading(true);
        try {
            const response = await fetch(
                `${api.getSignedUrl}?fileUrl=${encodeURIComponent(fileUrl)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    } as HeadersInit,
                    credentials: 'include',
                }
            );

            const data = await response.json();
            if (response.ok) {
                setPdfUrl(data.signedUrl);
            } else {
                throw new Error('Failed to get signed PDF URL');
            }
        } catch (error) {
            console.error('Error fetching signed PDF URL:', error);
            toast.error('Failed to load PDF');
        } finally {
            setPdfLoading(false);
        }
    };

    const openViewModal = async (note: Note) => {
        setCurrentNote(note);
        setIsViewModalOpen(true);
        await fetchPdfUrl(note.fileUrl);
    };

    const openEditModal = (note: Note) => {
        setCurrentNote(note);
        setFormData({
            title: note.title,
            description: note.description,
            status: String(note.status),
            isPaid: String(note.isPaid),
            price: String(note.price),
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (note: Note) => {
        setCurrentNote(note);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentNote) return;

        try {
            const updatedNote = {
                title: formData.title,
                description: formData.description,
                status: formData.status === 'true',
                isPaid: formData.isPaid === 'true',
                price: Number(formData.price),
            };

            await dispatch(
                updateNote({
                    id: currentNote._id,
                    noteData: updatedNote,
                })
            ).unwrap();
            toast.success('Note updated successfully');
            setIsEditModalOpen(false);
            dispatch(fetchNotes(collegeName as string));
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to update note'
            );
        }
    };

    const handleDelete = async () => {
        if (!currentNote) return;
        try {
            await dispatch(deleteNote(currentNote._id)).unwrap();
            toast.success('Note deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to delete note'
            );
        }
    };

    return (
        <div className='min-h-screen bg-indigo-50 dark:bg-gray-900 p-6'>
            <h1 className='text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2'>
                Notes Collection
            </h1>

            <div className='mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4'>
                <input
                    type='text'
                    placeholder='Search by subject or title...'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                    value={isPaidFilter}
                    onChange={(e) => setIsPaidFilter(e.target.value)}
                >
                    <option value=''>All</option>
                    <option value='true'>Paid</option>
                    <option value='false'>Free</option>
                </select>
                <input
                    type='number'
                    placeholder='Min Clicks'
                    className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    value={minClickFilter}
                    onChange={(e) => setMinClickFilter(e.target.value)}
                />
            </div>

            {currentNotes.length > 0 ? (
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
                            {currentNotes.map((note) => (
                                <tr
                                    key={note._id}
                                    className='hover:bg-indigo-50 dark:hover:bg-gray-700'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                        <button
                                            onClick={() => openViewModal(note)}
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
                                            {note.status
                                                ? 'Approved'
                                                : 'Pending'}
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
                                                onClick={() =>
                                                    openEditModal(note)
                                                }
                                                className='text-blue-500 hover:text-blue-700 transition-colors'
                                                title='Edit'
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openDeleteModal(note)
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
                                {error || 'No notes found'}
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

            {/* View Note Details Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setPdfUrl(null);
                }}
                title='Note Details'
                className='sm:max-w-4xl mx-auto'
            >
                {currentNote && (
                    <div className='space-y-6'>
                        {/* Header with title and quick stats */}
                        <div className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg'>
                            <h2 className='text-2xl font-bold mb-2'>
                                {currentNote.title}
                            </h2>
                            <div className='flex flex-wrap gap-4 items-center text-sm'>
                                <div className='flex items-center'>
                                    <FileText className='h-4 w-4 mr-1' />
                                    <span>
                                        {currentNote.subject.subjectName}
                                    </span>
                                </div>
                                <div className='flex items-center'>
                                    <User className='h-4 w-4 mr-1' />
                                    <span>{currentNote.owner.username}</span>
                                </div>
                                <div className='flex items-center'>
                                    <Calendar className='h-4 w-4 mr-1' />
                                    <span>
                                        {new Date(
                                            currentNote.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className='flex items-center'>
                                    <CheckCircle className='h-4 w-4 mr-1' />
                                    <span>
                                        {currentNote.status
                                            ? 'Approved'
                                            : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main content in a card */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                            {/* Description */}
                            <div className='mb-6'>
                                <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                    Description
                                </h3>
                                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-gray-800 dark:text-gray-200'>
                                    {currentNote.description}
                                </div>
                            </div>

                            {/* Stats in a grid */}
                            <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3'>
                                Note Statistics
                            </h3>
                            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
                                {/* Stats cards inline instead of separate component */}
                                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center'>
                                    <div className='mb-1'>
                                        <Heart className='h-5 w-5 text-pink-500' />
                                    </div>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                                        Likes
                                    </div>
                                    <div className='font-bold text-gray-900 dark:text-white'>
                                        {currentNote.likes.length}
                                    </div>
                                </div>

                                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center'>
                                    <div className='mb-1'>
                                        <MousePointer className='h-5 w-5 text-blue-500' />
                                    </div>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                                        Views
                                    </div>
                                    <div className='font-bold text-gray-900 dark:text-white'>
                                        {currentNote.clickCounts}
                                    </div>
                                </div>

                                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center'>
                                    <div className='mb-1'>
                                        <CreditCard className='h-5 w-5 text-green-500' />
                                    </div>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                                        Paid
                                    </div>
                                    <div className='font-bold text-gray-900 dark:text-white'>
                                        {currentNote.isPaid ? 'Yes' : 'No'}
                                    </div>
                                </div>

                                {currentNote.isPaid && (
                                    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center'>
                                        <div className='mb-1'>
                                            <IndianRupee className='h-5 w-5 text-emerald-500' />
                                        </div>
                                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                                            Price
                                        </div>
                                        <div className='font-bold text-gray-900 dark:text-white'>
                                            ₹{currentNote.price}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Purchases section */}
                            <div className='border-t dark:border-gray-700 pt-4'>
                                <div className='flex items-center justify-between mb-3'>
                                    <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                                        Purchased By
                                    </h3>
                                    <span className='bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                                        {currentNote.purchasedBy.length} users
                                    </span>
                                </div>

                                {currentNote.purchasedBy.length > 0 ? (
                                    <div className='bg-gray-50 dark:bg-gray-700 rounded-md p-2 max-h-40 overflow-y-auto'>
                                        {currentNote.purchasedBy.map(
                                            (userId, index) => (
                                                <div
                                                    key={index}
                                                    className='flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors'
                                                >
                                                    <UserCircle className='h-5 w-5 mr-2 text-gray-500' />
                                                    <span className='text-gray-800 dark:text-gray-200'>
                                                        User ID: {userId}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className='bg-gray-50 dark:bg-gray-700 rounded-md p-4 text-center text-gray-500 dark:text-gray-400'>
                                        No purchases yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className='px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500'
                            >
                                Close
                            </button>

                            {pdfLoading ? (
                                <button
                                    type='button'
                                    className='px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center justify-center disabled:opacity-70'
                                    disabled
                                >
                                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                    Loading PDF...
                                </button>
                            ) : pdfUrl ? (
                                <a
                                    href={pdfUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                >
                                    <FileDown className='h-5 w-5' />
                                    <span>View Note</span>
                                </a>
                            ) : (
                                <button
                                    type='button'
                                    className='px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed opacity-70'
                                    disabled
                                >
                                    Note Not Available
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit Note Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title='Edit Note'
                className='sm:max-w-4xl mx-auto'
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Title
                        </label>
                        <input
                            type='text'
                            name='title'
                            value={formData.title}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Description
                        </label>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            rows={3}
                        />
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
                            Update Note
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title='Delete Note'
                message={`Are you sure you want to delete note "${currentNote?.title}" (${currentNote?.subject.subjectName})? This action cannot be undone.`}
            />
        </div>
    );
}

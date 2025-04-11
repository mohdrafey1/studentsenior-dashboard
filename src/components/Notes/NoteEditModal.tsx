import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { fetchNotes, Note } from '@/redux/slices/notesSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateNote } from '@/redux/slices/notesSlice';
import toast from 'react-hot-toast';

interface NoteEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    collegeName: string;
}

const NoteEditModal: React.FC<NoteEditModalProps> = ({
    isOpen,
    onClose,
    note,
    collegeName,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        isPaid: '',
        price: '',
    });

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title,
                description: note.description,
                status: String(note.status),
                isPaid: String(note.isPaid),
                price: String(note.price),
            });
        }
    }, [note]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!note) return;

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
                    id: note._id,
                    noteData: updatedNote,
                })
            ).unwrap();
            toast.success('Note updated successfully');
            onClose();
            dispatch(fetchNotes(collegeName));
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to update note'
            );
        }
    };

    if (!note) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Edit Note'
            className='sm:max-w-2xl mx-auto'
        >
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl'>
                <div className='flex items-center mb-6 pb-3 border-b border-gray-100 dark:border-gray-700'>
                    <div className='bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6 text-indigo-600 dark:text-indigo-400'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
                            <path
                                fillRule='evenodd'
                                d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                        Edit Study Note
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Title
                        </label>
                        <div className='relative'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 text-gray-400'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </span>
                            <input
                                type='text'
                                name='title'
                                value={formData.title}
                                onChange={handleInputChange}
                                className='w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200'
                                placeholder='Enter note title'
                                required
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Description
                        </label>
                        <div className='relative'>
                            <span className='absolute top-3 left-0 flex items-center pl-3 pointer-events-none'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 text-gray-400'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </span>
                            <textarea
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}
                                className='w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200'
                                placeholder='Enter note description'
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Status
                            </label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5 text-gray-400'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </span>
                                <select
                                    name='status'
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className='w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat transition-all duration-200'
                                    style={{
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                                        backgroundSize: '1.5em 1.5em',
                                        backgroundPosition:
                                            'right 0.5rem center',
                                    }}
                                    required
                                >
                                    <option value='true'>Approved</option>
                                    <option value='false'>Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Paid Resource
                            </label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5 text-gray-400'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </span>
                                <select
                                    name='isPaid'
                                    value={formData.isPaid}
                                    onChange={handleInputChange}
                                    className='w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat transition-all duration-200'
                                    style={{
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                                        backgroundSize: '1.5em 1.5em',
                                        backgroundPosition:
                                            'right 0.5rem center',
                                    }}
                                    required
                                >
                                    <option value='true'>Yes</option>
                                    <option value='false'>No</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {formData.isPaid === 'true' && (
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Price (₹)
                            </label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5 text-gray-400'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                                        <path
                                            fillRule='evenodd'
                                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </span>
                                <input
                                    type='number'
                                    name='price'
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className='w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200'
                                    placeholder='99'
                                    required={formData.isPaid === 'true'}
                                />
                            </div>
                        </div>
                    )}

                    <div className='flex justify-end space-x-4 pt-4 mt-6 border-t border-gray-100 dark:border-gray-700'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg'
                        >
                            Update Note
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default NoteEditModal;

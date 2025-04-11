import React, { useState, useEffect } from 'react';
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
import Modal from '@/components/ui/Modal';
import { Note } from '@/redux/slices/notesSlice';
import { api, API_KEY } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import NoteStatsCards from '@/components/Notes/NoteStatsCards';
import NotePurchasesList from '@/components/Notes/NotePurchasesList';

interface NoteViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
}

const NoteViewModal: React.FC<NoteViewModalProps> = ({
    isOpen,
    onClose,
    note,
}) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfLoading, setPdfLoading] = useState(false);

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

    useEffect(() => {
        if (isOpen && note) {
            fetchPdfUrl(note.fileUrl);
        } else {
            setPdfUrl(null);
        }
    }, [isOpen, note]);

    if (!note) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Note Details'
            className='sm:max-w-4xl mx-auto'
        >
            <div className='space-y-6'>
                {/* Header with title and quick stats */}
                <div className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg'>
                    <h2 className='text-2xl font-bold mb-2'>{note.title}</h2>
                    <div className='flex flex-wrap gap-4 items-center text-sm'>
                        <div className='flex items-center'>
                            <FileText className='h-4 w-4 mr-1' />
                            <span>{note.subject.subjectName}</span>
                        </div>
                        <div className='flex items-center'>
                            <User className='h-4 w-4 mr-1' />
                            <span>{note.owner.username}</span>
                        </div>
                        <div className='flex items-center'>
                            <Calendar className='h-4 w-4 mr-1' />
                            <span>
                                {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className='flex items-center'>
                            <CheckCircle className='h-4 w-4 mr-1' />
                            <span>{note.status ? 'Approved' : 'Pending'}</span>
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
                            {note.description}
                        </div>
                    </div>

                    <NoteStatsCards note={note} />

                    <NotePurchasesList note={note} />
                </div>

                {/* Action buttons */}
                <div className='flex justify-end gap-3'>
                    <button
                        onClick={onClose}
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
        </Modal>
    );
};

export default NoteViewModal;

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Pyq } from '@/redux/slices/pyqSlice';
import { api, API_KEY } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import {
    FileText,
    User,
    Calendar,
    CheckCircle,
    MousePointer,
    CreditCard,
    IndianRupee,
    UserCircle,
    FileDown,
    Loader2,
    GraduationCap,
    CheckSquare,
} from 'lucide-react';
import PyqStatsCard from '@/components/Pyqs/PyqStatsCard';

interface PyqViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    pyq: Pyq;
}

const PyqViewModal: React.FC<PyqViewModalProps> = ({
    isOpen,
    onClose,
    pyq,
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
        if (isOpen && pyq) {
            fetchPdfUrl(pyq.fileUrl);
        } else {
            setPdfUrl(null);
        }
    }, [isOpen, pyq]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='PYQ Details'
            className='max-w-4xl mx-auto'
        >
            <div className='space-y-6'>
                {/* Header with quick stats */}
                <div className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg'>
                    <h2 className='text-2xl font-bold mb-2'>
                        {pyq.subject.subjectName} ({pyq.year})
                    </h2>
                    <div className='flex flex-wrap gap-4 items-center text-sm'>
                        <div className='flex items-center'>
                            <GraduationCap className='h-4 w-4 mr-1' />
                            <span>{pyq.college}</span>
                        </div>
                        <div className='flex items-center'>
                            <FileText className='h-4 w-4 mr-1' />
                            <span>{pyq.examType}</span>
                        </div>
                        <div className='flex items-center'>
                            <User className='h-4 w-4 mr-1' />
                            <span>{pyq.owner.username}</span>
                        </div>
                        <div className='flex items-center'>
                            <CheckCircle className='h-4 w-4 mr-1' />
                            <span>{pyq.status ? 'Approved' : 'Pending'}</span>
                        </div>
                    </div>
                </div>

                {/* Main content in a card */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                    {/* Stats in a grid */}
                    <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3'>
                        PYQ Information
                    </h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
                        <PyqStatsCard
                            icon={
                                <MousePointer className='h-5 w-5 text-blue-500' />
                            }
                            label='Views'
                            value={pyq.clickCounts}
                        />

                        <PyqStatsCard
                            icon={
                                <CheckSquare className='h-5 w-5 text-green-500' />
                            }
                            label='Solved'
                            value={pyq.solved ? 'Yes' : 'No'}
                        />

                        <PyqStatsCard
                            icon={
                                <CreditCard className='h-5 w-5 text-purple-500' />
                            }
                            label='Paid'
                            value={pyq.isPaid ? 'Yes' : 'No'}
                        />

                        {pyq.isPaid && (
                            <PyqStatsCard
                                icon={
                                    <IndianRupee className='h-5 w-5 text-emerald-500' />
                                }
                                label='Price'
                                value={`₹${pyq.price}`}
                            />
                        )}

                        <PyqStatsCard
                            icon={
                                <Calendar className='h-5 w-5 text-orange-500' />
                            }
                            label='Upload Date'
                            value={new Date(pyq.createdAt).toLocaleDateString()}
                        />
                    </div>

                    {/* Purchases section */}
                    <div className='border-t dark:border-gray-700 pt-4'>
                        <div className='flex items-center justify-between mb-3'>
                            <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                                Purchased By
                            </h3>
                            <span className='bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                                {pyq.purchasedBy.length} users
                            </span>
                        </div>

                        {pyq.purchasedBy.length > 0 ? (
                            <div className='bg-gray-50 dark:bg-gray-700 rounded-md p-2 max-h-40 overflow-y-auto'>
                                {pyq.purchasedBy.map((userId, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors'
                                    >
                                        <UserCircle className='h-5 w-5 mr-2 text-gray-500' />
                                        <span className='text-gray-800 dark:text-gray-200'>
                                            User ID: {userId}
                                        </span>
                                    </div>
                                ))}
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
                            <span>Open PDF</span>
                        </a>
                    ) : (
                        <button
                            type='button'
                            className='px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed opacity-70'
                            disabled
                        >
                            PDF Not Available
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PyqViewModal;

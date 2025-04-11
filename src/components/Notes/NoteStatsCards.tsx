import React from 'react';
import { Heart, MousePointer, CreditCard, IndianRupee } from 'lucide-react';
import { Note } from '@/redux/slices/notesSlice';

interface NoteStatsCardsProps {
    note: Note;
}

const NoteStatsCards: React.FC<NoteStatsCardsProps> = ({ note }) => {
    return (
        <>
            <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3'>
                Note Statistics
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center'>
                    <div className='mb-1'>
                        <Heart className='h-5 w-5 text-pink-500' />
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                        Likes
                    </div>
                    <div className='font-bold text-gray-900 dark:text-white'>
                        {note.likes.length}
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
                        {note.clickCounts}
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
                        {note.isPaid ? 'Yes' : 'No'}
                    </div>
                </div>

                {note.isPaid && (
                    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center'>
                        <div className='mb-1'>
                            <IndianRupee className='h-5 w-5 text-emerald-500' />
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                            Price
                        </div>
                        <div className='font-bold text-gray-900 dark:text-white'>
                            ₹{note.price}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NoteStatsCards;

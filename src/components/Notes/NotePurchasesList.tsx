import React from 'react';
import { UserCircle } from 'lucide-react';
import { Note } from '@/redux/slices/notesSlice';

interface NotePurchasesListProps {
    note: Note;
}

const NotePurchasesList: React.FC<NotePurchasesListProps> = ({ note }) => {
    return (
        <div className='border-t dark:border-gray-700 pt-4'>
            <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                    Purchased By
                </h3>
                <span className='bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {note.purchasedBy.length} users
                </span>
            </div>

            {note.purchasedBy.length > 0 ? (
                <div className='bg-gray-50 dark:bg-gray-700 rounded-md p-2 max-h-40 overflow-y-auto'>
                    {note.purchasedBy.map((userId, index) => (
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
    );
};

export default NotePurchasesList;

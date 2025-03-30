import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50'>
            <div className='bg-white p-6 rounded-md shadow-lg w-96'>
                <h2 className='text-2xl font-bold mb-4'>{title}</h2>
                <p className='mb-4'>{message}</p>
                <div className='flex justify-end gap-4'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

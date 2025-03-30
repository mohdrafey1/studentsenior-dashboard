import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-40 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <div
                    className='fixed inset-0 transition-opacity'
                    onClick={onClose}
                >
                    <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                </div>
                <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
                    &#8203;
                </span>
                <div className='inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-lg '>
                    <div className='bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                        <div className='sm:flex sm:items-start'>
                            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                                <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>
                                    {title}
                                </h3>
                                <div className='mt-2 '>{children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;

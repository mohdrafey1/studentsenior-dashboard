import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Pyq } from '@/redux/slices/pyqSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updatePyq, fetchPyqs } from '@/redux/slices/pyqSlice';
import toast from 'react-hot-toast';

interface PyqEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    pyq: Pyq;
    collegeName: string;
}

interface FormData {
    year: string;
    examType: string;
    status: boolean;
    solved: boolean;
    isPaid: boolean;
    price: string;
    slug: string;
}

interface CustomToggleProps {
    label: string;
    isOn: boolean;
    onToggle: () => void;
    description?: string;
}

const PyqEditModal: React.FC<PyqEditModalProps> = ({
    isOpen,
    onClose,
    pyq,
    collegeName,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<FormData>({
        year: pyq.year,
        examType: pyq.examType,
        status: pyq.status,
        solved: pyq.solved,
        isPaid: pyq.isPaid,
        price: String(pyq.price),
        slug: String(pyq.slug),
    });

    const academicYears = ['2021-22', '2022-23', '2023-24', '2024-25'];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (name: keyof FormData) => {
        if (typeof formData[name] === 'boolean') {
            setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const updatedPyq = {
                year: formData.year,
                examType: formData.examType,
                status: formData.status,
                solved: formData.solved,
                isPaid: formData.isPaid,
                price: Number(formData.price),
            };

            await dispatch(
                updatePyq({
                    id: pyq._id,
                    pyqData: updatedPyq,
                })
            ).unwrap();
            toast.success('PYQ updated successfully');
            onClose();
            dispatch(fetchPyqs(collegeName));
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to update PYQ'
            );
        }
    };

    // Enhanced toggle component with improved styling
    const CustomToggle: React.FC<CustomToggleProps> = ({
        label,
        isOn,
        onToggle,
        description,
    }) => {
        return (
            <div className='flex items-center justify-between py-2'>
                <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                        {label}
                    </span>
                    {description && (
                        <span className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            {description}
                        </span>
                    )}
                </div>
                <button
                    type='button'
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
                        isOn ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    aria-pressed={isOn}
                >
                    <span className='sr-only'>Toggle {label}</span>
                    <span
                        className={`${
                            isOn ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out`}
                    />
                </button>
            </div>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Edit PYQ'
            className='max-w-2xl'
        >
            <div className='bg-white dark:bg-gray-800 p-2 sm:p-6 rounded-xl shadow-xl'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Paper Identifier
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
                                            d='M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </span>
                                <input
                                    type='text'
                                    name='slug'
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className='w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200'
                                    placeholder='example-slug-202324'
                                    required
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Academic Year
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
                                            d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </span>
                                <select
                                    name='year'
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className='w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat transition-all duration-200'
                                    style={{
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                                        backgroundSize: '1.5em 1.5em',
                                        backgroundPosition:
                                            'right 0.5rem center',
                                    }}
                                    required
                                >
                                    {academicYears.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Exam Type
                            </label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5 text-gray-400'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                                        <path
                                            fillRule='evenodd'
                                            d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </span>
                                <select
                                    name='examType'
                                    value={formData.examType}
                                    onChange={handleInputChange}
                                    className='w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat transition-all duration-200'
                                    style={{
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                                        backgroundSize: '1.5em 1.5em',
                                        backgroundPosition:
                                            'right 0.5rem center',
                                    }}
                                    required
                                >
                                    <option value='midsem1'>
                                        Mid Semester 1
                                    </option>
                                    <option value='midsem2'>
                                        Mid Semester 2
                                    </option>
                                    <option value='endsem'>End Semester</option>
                                    <option value='improvement'>
                                        Improvement
                                    </option>
                                </select>
                            </div>
                        </div>

                        {formData.isPaid && (
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
                                        className='w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200'
                                        placeholder='99'
                                        required={formData.isPaid}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-750 sm:p-5 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700 space-y-4 m-2 sm:my-6'>
                        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-gray-700 mt-1'>
                            Paper Properties
                        </h3>

                        <CustomToggle
                            label='Solved Paper'
                            description='Paper includes solutions for all questions'
                            isOn={formData.solved}
                            onToggle={() => handleToggleChange('solved')}
                        />

                        <CustomToggle
                            label='Paid Resource'
                            description='Students will need to purchase this paper'
                            isOn={formData.isPaid}
                            onToggle={() => handleToggleChange('isPaid')}
                        />

                        <CustomToggle
                            label='Approve Status'
                            description='Make this paper available to students'
                            isOn={formData.status}
                            onToggle={() => handleToggleChange('status')}
                        />
                    </div>

                    <div className='flex justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-5 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg'
                        >
                            Update PYQ
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default PyqEditModal;

'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';

export default function CoursePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [courseId, setCourseId] = useState('67e67ff76f83d9b05085549f');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    // Close modal on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') setIsOpen(false);
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    const handleEnroll = async () => {
        if (!courseId.trim() || !userId.trim()) {
            toast.error('Both fields are required!');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(api.course.enrollCourse, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId, userId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Successfully enrolled in the course!');
                setIsOpen(false);
                setCourseId('');
                setUserId('');
            } else {
                toast.error(data.message || 'Failed to add enrollment');
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-indigo-50 dark:bg-gray-900 p-6'>
            <h1 className='text-3xl mt-14 mb-6 font-bold text-center text-indigo-600 dark:text-indigo-400'>
                Courses
            </h1>

            <div className='flex justify-end mb-6'>
                <button
                    onClick={handleOpen}
                    className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition'
                >
                    Add Enrollment
                </button>
            </div>

            {isOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'
                    role='dialog'
                    aria-modal='true'
                >
                    <div
                        ref={modalRef}
                        className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg'
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200'>
                                Add Enrollment
                            </h2>
                            <button
                                onClick={handleClose}
                                className='text-gray-600 hover:text-gray-800 dark:text-gray-300'
                                aria-label='Close modal'
                            >
                                <X className='w-6 h-6' />
                            </button>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <div>
                                <label
                                    htmlFor='courseId'
                                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                                >
                                    Course ID
                                </label>
                                <input
                                    type='text'
                                    id='courseId'
                                    className='w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-gray-200'
                                    value={courseId}
                                    onChange={(e) =>
                                        setCourseId(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='userId'
                                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                                >
                                    User ID
                                </label>
                                <input
                                    type='text'
                                    id='userId'
                                    className='w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-gray-200'
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>

                            <div className='flex justify-end mt-4'>
                                <button
                                    onClick={handleEnroll}
                                    disabled={loading}
                                    className={`bg-indigo-500 text-white px-4 py-2 rounded-md transition ${
                                        loading
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-indigo-600'
                                    }`}
                                >
                                    {loading ? 'Enrolling...' : 'Enroll'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

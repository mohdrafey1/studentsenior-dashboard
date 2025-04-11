'use client';

import { useEffect, useState } from 'react';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import CollegeCard from '@/components/College/CollegeCard';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import EditCollegeModal from '@/components/College/EditCollegeModal';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { checkTokenExpiration } from '@/redux/slices/authSlice';
import { fetchColleges } from '@/redux/slices/collegesSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    School,
    Filter,
} from 'lucide-react';
import Link from 'next/link';

interface College {
    _id: string;
    name: string;
    description: string;
    location: string;
    slug: string;
    status: boolean;
}

const Home = () => {
    const [showInactive, setShowInactive] = useState(false);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);
    const [collegeToDelete, setCollegeToDelete] = useState<College | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!checkTokenExpiration()) {
            dispatch(logout());
        }
    }, [dispatch]);

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const { colleges, loading, error } = useSelector(
        (state: RootState) => state.colleges
    );

    useEffect(() => {
        dispatch(fetchColleges());
    }, [dispatch]);

    const handleDelete = async () => {
        if (!collegeToDelete) return;

        try {
            const res = await fetch(
                `${api.college.deleteCollege}/${collegeToDelete._id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.ok) {
                toast.success('College deleted successfully!');
                setCollegeToDelete(null);
                dispatch(fetchColleges());
            } else {
                toast.error(
                    'Access Denied, You are not allowed to do this operation'
                );
            }
        } catch (error) {
            console.error('Error deleting college:', error);
            toast.error('Error deleting college');
        }
    };

    const handleSaveCollege = async (updatedCollege: College) => {
        try {
            const res = await fetch(
                `${api.college.editCollege}/${updatedCollege._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedCollege),
                }
            );

            if (res.ok) {
                toast.success('College updated successfully!');
                setEditingCollege(null);
                dispatch(fetchColleges());
            } else {
                toast.error(
                    'Access Denied, You are not allowed to do this operation'
                );
            }
        } catch (error) {
            console.error('Error updating college:', error);
            toast.error('Error updating college');
        }
    };

    const filteredColleges = colleges
        .filter((college) => (showInactive ? true : college.status))
        .filter(
            (college) =>
                college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                college.location
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );

    return (
        <div className='p-6 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                <div className='mt-14 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8'>
                    <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                        {/* Search Bar */}
                        <div className='relative w-full md:w-96'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Search className='h-5 w-5 text-gray-400' />
                            </div>
                            <input
                                type='text'
                                placeholder='Search colleges by name or location...'
                                className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className='flex justify-between gap-2 w-full md:w-auto'>
                            {/* Toggle Button for Inactive Colleges */}
                            <button
                                onClick={() => setShowInactive(!showInactive)}
                                className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
                                    showInactive
                                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                            >
                                {showInactive ? (
                                    <>
                                        <EyeOff className='w-4 h-4' />
                                        <span className=' sm:inline'>
                                            Hide Inactive
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className='w-4 h-4' />
                                        <span className=' sm:inline'>
                                            Show Inactive
                                        </span>
                                    </>
                                )}
                            </button>
                            <Link
                                href={'/reports'}
                                className='md:hidden px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                            >
                                Reports
                            </Link>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6'>
                        <div className='flex'>
                            <div className='py-1'>
                                <svg
                                    className='h-6 w-6 text-red-500 mr-4'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className='font-medium'>
                                    Failed to load Colleges
                                </p>
                                <p className='text-sm'>{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* College Cards Grid */}
                {loading ? (
                    <div className='flex justify-center items-center py-20'>
                        <Spinner size={2} />
                    </div>
                ) : filteredColleges.length > 0 ? (
                    <>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                            Showing {filteredColleges.length}{' '}
                            {filteredColleges.length === 1
                                ? 'college'
                                : 'colleges'}
                        </p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {filteredColleges.map((college) => (
                                <div
                                    key={college._id}
                                    className='group relative'
                                >
                                    <div
                                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                                            !college.status
                                                ? 'ring-2 ring-amber-400 dark:ring-amber-600'
                                                : ''
                                        }`}
                                    >
                                        {/* Status Badge */}
                                        {!college.status && (
                                            <div className='absolute top-3 left-3 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                                                Inactive
                                            </div>
                                        )}

                                        {/* Replace with custom CollegeCard if needed */}
                                        <CollegeCard college={college} />

                                        {/* Edit and Delete Buttons - Now shows on hover with a nice animation */}
                                        <div className='absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                            <button
                                                onClick={() =>
                                                    setEditingCollege(college)
                                                }
                                                className='bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md'
                                                aria-label='Edit College'
                                            >
                                                <Edit2 className='w-4 h-4' />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setCollegeToDelete(college)
                                                }
                                                className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors shadow-md'
                                                aria-label='Delete College'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center'>
                        <div className='mx-auto max-w-md'>
                            <School className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                            <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
                                No Colleges Found
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 mb-6'>
                                {searchTerm
                                    ? `No colleges match your search for "${searchTerm}".`
                                    : 'There are no colleges available to display.'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className='inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors'
                                >
                                    <Filter className='mr-2 h-4 w-4' />
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {collegeToDelete && (
                <DeleteConfirmationModal
                    isOpen={!!collegeToDelete}
                    onClose={() => setCollegeToDelete(null)}
                    onConfirm={handleDelete}
                    title='Delete College'
                    message={`Are you sure you want to delete ${collegeToDelete.name}? This action cannot be undone.`}
                />
            )}

            {editingCollege && (
                <EditCollegeModal
                    college={editingCollege}
                    onClose={() => setEditingCollege(null)}
                    onSave={handleSaveCollege}
                />
            )}
        </div>
    );
};

export default Home;

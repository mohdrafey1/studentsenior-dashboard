'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    Course,
} from '@/redux/slices/courseSlice';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Modal from '@/components/ui/Modal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import toast from 'react-hot-toast';

interface FormData {
    courseName: string;
    courseCode: string;
}

export default function Courses() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<FormData>({
        courseName: '',
        courseCode: '',
    });
    const coursePerPage = 10;

    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading, error } = useSelector(
        (state: RootState) => state.courses
    );

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    // Filter courses
    const filteredCourses = courses.filter((course) => {
        return (
            course.courseName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Pagination logic
    const indexOfLastUser = currentPage * coursePerPage;
    const indexOfFirstUser = indexOfLastUser - coursePerPage;
    const currentCourses = filteredCourses.slice(
        indexOfFirstUser,
        indexOfLastUser
    );
    const totalPages = Math.ceil(filteredCourses.length / coursePerPage);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setCurrentCourse(null);
        setFormData({
            courseName: '',
            courseCode: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (course: Course) => {
        setCurrentCourse(course);
        setFormData({
            courseName: course.courseName,
            courseCode: course.courseCode,
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (course: Course) => {
        setCurrentCourse(course);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentCourse) {
                await dispatch(
                    updateCourse({
                        id: currentCourse._id,
                        courseData: formData,
                    })
                ).unwrap();
                toast.success('Course updated successfully');
            } else {
                await dispatch(addCourse(formData)).unwrap();
                toast.success('Course added successfully');
            }

            // Refresh data
            dispatch(fetchCourses());
            setIsModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to update course'
            );
        }
    };

    const handleDelete = async () => {
        if (!currentCourse) return;
        try {
            await dispatch(deleteCourse(currentCourse._id)).unwrap();
            toast.success('Course deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to delete course'
            );
        }
    };

    return (
        <div className='p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen'>
            <h1 className='text-3xl font-bold text-center text-indigo-400 mt-14 mb-2'>
                Courses
            </h1>

            {/* Header with Add button */}
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
                {/* Search Container */}
                <div className='flex-1 min-w-[200px]'>
                    <input
                        type='text'
                        placeholder='Search by course name or code...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                    />
                </div>

                {/* Add Button */}
                <div className='w-full md:w-auto'>
                    <button
                        onClick={openAddModal}
                        className='w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                        <FaPlus className='mr-2' />
                        Add Course
                    </button>
                </div>
            </div>

            {courses.length > 0 ? (
                <>
                    {/* Course Table */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <thead>
                                <tr className='bg-indigo-50 dark:bg-gray-700'>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Course Name
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Course Code
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Branches
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Notes
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        PYQs
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Clicks
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Created At
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                {currentCourses.map((course) => (
                                    <tr
                                        key={course._id}
                                        className='hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {course.courseName}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {course.courseCode}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {course.totalBranch}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {course.totalNotes}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {course.totalPyqs}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {course.clickCounts}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {new Date(
                                                course.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            <div className='flex space-x-2'>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(course)
                                                    }
                                                    className='text-blue-500 hover:text-blue-700 transition-colors'
                                                    title='Edit'
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(course)
                                                    }
                                                    className='text-red-500 hover:text-red-700 transition-colors'
                                                    title='Delete'
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className='flex items-center justify-center min-h-[50vh]'>
                    {loading ? (
                        <Spinner size={2} />
                    ) : (
                        <div className='text-center p-4 rounded-lg shadow-3xl'>
                            <p className='text-xl font-semibold text-red-500 text-center'>
                                {error || 'No courses found'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            <div className='flex justify-center mt-6'>
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Add/Edit Course Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentCourse ? 'Edit Course' : 'Add New Course'}
                className='max-w-2xl'
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <input
                            type='text'
                            name='courseName'
                            placeholder='Course Name'
                            value={formData.courseName}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    <div>
                        <input
                            type='text'
                            placeholder='Course Code'
                            name='courseCode'
                            value={formData.courseCode}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    <div className='flex justify-end space-x-3 pt-4'>
                        <button
                            type='button'
                            onClick={() => setIsModalOpen(false)}
                            className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            {currentCourse ? 'Update' : 'Add'} Course
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title='Delete Course'
                message={`Are you sure you want to delete "${currentCourse?.courseName}"? This action cannot be undone.`}
            />
        </div>
    );
}

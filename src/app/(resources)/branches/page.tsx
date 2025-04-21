'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
    fetchBranches,
    addBranch,
    updateBranch,
    deleteBranch,
    Branch,
    Course,
} from '@/redux/slices/branchSlice';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Modal from '@/components/ui/Modal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';

interface FormData {
    branchName: string;
    branchCode: string;
    course: string;
}

export default function Branches() {
    const [searchQuery, setSearchQuery] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [formData, setFormData] = useState<FormData>({
        branchName: '',
        branchCode: '',
        course: '',
    });
    const branchPerPage = 10;
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [courseSearchQuery, setCourseSearchQuery] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const { branches, loading, error } = useSelector(
        (state: RootState) => state.branches
    );

    useEffect(() => {
        dispatch(fetchBranches());
        fetchCourses();
    }, [dispatch]);

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${api.resource.courses}`);
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            toast.error('Failed to fetch courses');
            console.error('Error fetching courses:', error);
        }
    };

    const filteredCourses = courses.filter(
        (course) =>
            course.courseName
                .toLowerCase()
                .includes(courseSearchQuery.toLowerCase()) ||
            course.courseCode
                .toLowerCase()
                .includes(courseSearchQuery.toLowerCase())
    );

    // Filter branches
    const filteredBranches = branches.filter((branch) => {
        const matchesSearchQuery =
            branch.branchName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            branch.branchCode
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesCourseFilter = courseFilter
            ? branch.course?.courseName.toLowerCase() ===
              courseFilter.toLowerCase()
            : true;
        return matchesSearchQuery && matchesCourseFilter;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * branchPerPage;
    const indexOfFirstUser = indexOfLastUser - branchPerPage;
    const currentBranches = filteredBranches.slice(
        indexOfFirstUser,
        indexOfLastUser
    );
    const totalPages = Math.ceil(filteredBranches.length / branchPerPage);

    const uniqueCourses = Array.from(
        new Set(
            branches
                .map((branch) => branch.course?.courseName)
                .filter((courseName): courseName is string => !!courseName)
        )
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setCurrentBranch(null);
        setFormData({
            branchName: '',
            branchCode: '',
            course: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (branch: Branch) => {
        setCurrentBranch(branch);
        setFormData({
            branchName: branch.branchName,
            branchCode: branch.branchCode,
            course: branch.course?._id || '',
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (branch: Branch) => {
        setCurrentBranch(branch);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const branchData = {
                branchName: formData.branchName,
                branchCode: formData.branchCode,
                course: courses.find((c) => c._id === formData.course) || null,
            };

            if (currentBranch) {
                await dispatch(
                    updateBranch({
                        id: currentBranch._id,
                        branchData: {
                            branchName: formData.branchName,
                            branchCode: formData.branchCode,
                        },
                    })
                ).unwrap();
                toast.success('Branch updated successfully');
            } else {
                await dispatch(addBranch(branchData)).unwrap();
                toast.success('Branch added successfully');
            }

            // Refresh data
            dispatch(fetchBranches());
            setIsModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to update branch'
            );
        }
    };

    const handleDelete = async () => {
        if (!currentBranch) return;
        try {
            await dispatch(deleteBranch(currentBranch._id)).unwrap();
            toast.success('Branch deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to delete branch'
            );
        }
    };

    return (
        <div className='p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen'>
            <h1 className='text-3xl font-bold text-center text-indigo-400 mt-14 mb-2'>
                Branches
            </h1>

            {/* Header with Add button */}
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
                {/* Search and Filter Container */}
                <div className='flex flex-col sm:flex-row gap-4 w-full md:w-3/4'>
                    {/* Search Input */}
                    <div className='flex-1 min-w-[200px]'>
                        <input
                            type='text'
                            placeholder='Search by branch name or code...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                        />
                    </div>

                    {/* Course Filter */}
                    <div className='flex-1 min-w-[200px]'>
                        <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className='w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                        >
                            <option value=''>Filter by Course</option>
                            {uniqueCourses.map((courseName, index) => (
                                <option key={index} value={courseName}>
                                    {courseName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Add Button */}
                <div className='w-full md:w-auto'>
                    <button
                        onClick={openAddModal}
                        className='w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                        <FaPlus className='mr-2' />
                        Add Branch
                    </button>
                </div>
            </div>

            {branches.length > 0 ? (
                <>
                    {/* Branch Table */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <thead>
                                <tr className='bg-indigo-50 dark:bg-gray-700'>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Branch Name
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Branch Code
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Course
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Subjects
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Seniors
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                {currentBranches.map((branch) => (
                                    <tr
                                        key={branch._id}
                                        className='hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.branchName}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.branchCode}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.course?.courseCode}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.totalSubject}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.totalSenior}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.totalNotes}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.totalPyqs}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {branch.clickCounts}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            <div className='flex space-x-2'>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(branch)
                                                    }
                                                    className='text-blue-500 hover:text-blue-700 transition-colors'
                                                    title='Edit'
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(branch)
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
                                {error || 'No branches found'}
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

            {/* Add/Edit Branch Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentBranch ? 'Edit Branch' : 'Add New Branch'}
                className='max-w-2xl'
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <input
                            type='text'
                            name='branchName'
                            placeholder='Branch Name'
                            value={formData.branchName}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    <div>
                        <input
                            type='text'
                            placeholder='Branch Code'
                            name='branchCode'
                            value={formData.branchCode}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    {!currentBranch && (
                        <div
                            className={`relative ${
                                showCourseDropdown && 'h-60'
                            }`}
                        >
                            <div className='relative'>
                                <div
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white cursor-pointer'
                                    onClick={() =>
                                        setShowCourseDropdown(
                                            !showCourseDropdown
                                        )
                                    }
                                >
                                    {formData.course
                                        ? `${
                                              courses.find(
                                                  (c) =>
                                                      c._id === formData.course
                                              )?.courseName
                                          } (${
                                              courses.find(
                                                  (c) =>
                                                      c._id === formData.course
                                              )?.courseCode
                                          })`
                                        : 'Select a course'}
                                </div>
                                {showCourseDropdown && (
                                    <div className='absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700'>
                                        <div className='p-2 border-b border-gray-200 dark:border-gray-700'>
                                            <input
                                                type='text'
                                                className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded'
                                                placeholder='Search courses...'
                                                value={courseSearchQuery}
                                                onChange={(e) =>
                                                    setCourseSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                autoFocus
                                            />
                                        </div>
                                        <div className='max-h-60 overflow-auto'>
                                            {filteredCourses.length > 0 ? (
                                                filteredCourses.map(
                                                    (course) => (
                                                        <div
                                                            key={course._id}
                                                            className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-700 ${
                                                                formData.course ===
                                                                course._id
                                                                    ? 'bg-indigo-100 dark:bg-gray-700'
                                                                    : ''
                                                            }`}
                                                            onClick={() => {
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        course: course._id,
                                                                    })
                                                                );
                                                                setShowCourseDropdown(
                                                                    false
                                                                );
                                                            }}
                                                        >
                                                            {course.courseName}{' '}
                                                            ({course.courseCode}
                                                            )
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className='px-4 py-2 text-gray-500 dark:text-gray-400'>
                                                    No courses found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type='hidden'
                                name='course'
                                value={formData.course}
                            />
                        </div>
                    )}
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
                            {currentBranch ? 'Update' : 'Add'} Branch
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title='Delete Branch'
                message={`Are you sure you want to delete "${currentBranch?.branchName}"? This action cannot be undone.`}
            />
        </div>
    );
}

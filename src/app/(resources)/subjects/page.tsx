'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
    fetchSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    Subject,
    Branch,
} from '@/redux/slices/subjectSlice';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Modal from '@/components/ui/Modal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';

interface FormData {
    subjectName: string;
    subjectCode: string;
    semester: string;
    branch: string;
}

interface ApiError {
    message: string;
    status?: number;
}

export default function Subjects() {
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [formData, setFormData] = useState<FormData>({
        subjectName: '',
        subjectCode: '',
        semester: '',
        branch: '',
    });
    const subjectPerPage = 10;
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);
    const [branchSearchQuery, setBranchSearchQuery] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const { subjects, loading, error } = useSelector(
        (state: RootState) => state.subjects
    );

    useEffect(() => {
        dispatch(fetchSubjects());
        fetchBranches();
    }, [dispatch]);

    const fetchBranches = async () => {
        try {
            const response = await fetch(`${api.resource.branches}`);
            if (!response.ok) {
                throw new Error('Failed to fetch branches');
            }
            const data = await response.json();
            setBranches(data);
        } catch (error) {
            toast.error('Failed to fetch branches');
            console.error('Error fetching branches:', error);
        }
    };

    const filteredBranches = branches.filter(
        (branch) =>
            branch.branchName
                .toLowerCase()
                .includes(branchSearchQuery.toLowerCase()) ||
            branch.branchCode
                .toLowerCase()
                .includes(branchSearchQuery.toLowerCase())
    );

    // Filter subjects
    const filteredSubjects = subjects.filter((subject) => {
        const matchesSearchQuery =
            subject.subjectName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            subject.subjectCode
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesBranchFilter = branchFilter
            ? subject.branch?.branchName.toLowerCase() ===
              branchFilter.toLowerCase()
            : true;
        return matchesSearchQuery && matchesBranchFilter;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * subjectPerPage;
    const indexOfFirstUser = indexOfLastUser - subjectPerPage;
    const currentSubjects = filteredSubjects.slice(
        indexOfFirstUser,
        indexOfLastUser
    );
    const totalPages = Math.ceil(filteredSubjects.length / subjectPerPage);

    const uniqueBranches = Array.from(
        new Set(
            subjects
                .map((subject) => subject.branch?.branchName)
                .filter((branchName): branchName is string => !!branchName)
        )
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setCurrentSubject(null);
        setFormData({
            subjectName: '',
            subjectCode: '',
            semester: '',
            branch: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (subject: Subject) => {
        setCurrentSubject(subject);
        setFormData({
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode,
            semester: subject.semester.toString(),
            branch: subject.branch?._id || '',
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (subject: Subject) => {
        setCurrentSubject(subject);
        setIsDeleteModalOpen(true);
    };

    // Update the handleSubmit function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const subjectData = {
                subjectName: formData.subjectName,
                subjectCode: formData.subjectCode,
                semester: formData.semester,
                // Only include branch for new subjects
                ...(!currentSubject && {
                    branch:
                        branches.find((b) => b._id === formData.branch) || null,
                }),
            };

            if (currentSubject) {
                await dispatch(
                    updateSubject({
                        id: currentSubject._id,
                        subjectData,
                    })
                ).unwrap();
                toast.success('Subject updated successfully');
            } else {
                await dispatch(
                    addSubject({
                        ...subjectData,

                        branch:
                            branches.find((b) => b._id === formData.branch) ||
                            null,
                    })
                ).unwrap();
                toast.success('Subject added successfully');
            }

            // Refresh data
            dispatch(fetchSubjects());
            setIsModalOpen(false);
        } catch (error) {
            const err = error as ApiError;
            toast.error(err.message || 'Failed to Update subject');
        }
    };

    const handleDelete = async () => {
        if (!currentSubject) return;
        try {
            await dispatch(deleteSubject(currentSubject._id)).unwrap();
            toast.success('Subject deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            const err = error as ApiError;
            toast.error(err.message || 'Failed to Update subject');
        }
    };

    return (
        <div className='p-6 bg-indigo-50 dark:bg-gray-900 min-h-screen'>
            <h1 className='text-3xl font-bold text-center text-indigo-400 mt-14 mb-2'>
                Subjects
            </h1>

            {/* Header with Add button */}
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
                {/* Search and Filter Container - Takes full width on mobile, 3/4 on desktop */}
                <div className='flex flex-col sm:flex-row gap-4 w-full md:w-3/4'>
                    {/* Search Input - Full width on mobile, grows to fill space on desktop */}
                    <div className='flex-1 min-w-[200px]'>
                        <input
                            type='text'
                            placeholder='Search by subject name or code...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                        />
                    </div>

                    {/* Branch Filter - Full width on mobile, reasonable width on desktop */}
                    <div className='flex-1 min-w-[200px]'>
                        <select
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className='w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                        >
                            <option value=''>Filter by Branch</option>
                            {uniqueBranches.map((branchName, index) => (
                                <option key={index} value={branchName}>
                                    {branchName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Add Button - Full width on mobile, auto width on desktop */}
                <div className='w-full md:w-auto'>
                    <button
                        onClick={openAddModal}
                        className='w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                        <FaPlus className='mr-2' />
                        Add Subject
                    </button>
                </div>
            </div>

            {subjects.length > 0 ? (
                <>
                    {/* Subject Table */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <thead>
                                <tr className='bg-indigo-50 dark:bg-gray-700'>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Subject Name
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Subject Code
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Semester
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
                                        Branch
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
                                {currentSubjects.map((subject) => (
                                    <tr
                                        key={subject._id}
                                        className='hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {subject.subjectName}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {subject.subjectCode}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {subject.semester}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {subject.branch?.branchName} (
                                            {subject.branch?.branchCode})
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {subject.totalNotes}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {subject.totalPyqs}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            {subject.clickCounts}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
                                            <div className='flex space-x-2'>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(subject)
                                                    }
                                                    className='text-blue-500 hover:text-blue-700 transition-colors'
                                                    title='Edit'
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(subject)
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
                                {error || 'No subjects found'}
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

            {/* Add/Edit Subject Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentSubject ? 'Edit Subject' : 'Add New Subject'}
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <input
                            type='text'
                            name='subjectName'
                            placeholder='Subject Name'
                            value={formData.subjectName}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    <div>
                        <input
                            type='text'
                            placeholder='Subject Code'
                            name='subjectCode'
                            value={formData.subjectCode}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        />
                    </div>
                    <div>
                        <select
                            name='semester'
                            value={formData.semester}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white'
                            required
                        >
                            <option value=''>Select Semester</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Semester {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                    {!currentSubject && (
                        <div
                            className={`relative ${
                                showBranchDropdown && 'h-60'
                            }`}
                        >
                            <div className='relative'>
                                <div
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white cursor-pointer'
                                    onClick={() =>
                                        setShowBranchDropdown(
                                            !showBranchDropdown
                                        )
                                    }
                                >
                                    {formData.branch
                                        ? `${
                                              branches.find(
                                                  (b) =>
                                                      b._id === formData.branch
                                              )?.branchName
                                          } (${
                                              branches.find(
                                                  (b) =>
                                                      b._id === formData.branch
                                              )?.branchCode
                                          })`
                                        : 'Select a branch'}
                                </div>
                                {showBranchDropdown && (
                                    <div className='absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700'>
                                        <div className='p-2 border-b border-gray-200 dark:border-gray-700'>
                                            <input
                                                type='text'
                                                className='w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded'
                                                placeholder='Search branches...'
                                                value={branchSearchQuery}
                                                onChange={(e) =>
                                                    setBranchSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                autoFocus
                                            />
                                        </div>
                                        <div className='max-h-60 overflow-auto'>
                                            {filteredBranches.length > 0 ? (
                                                filteredBranches.map(
                                                    (branch) => (
                                                        <div
                                                            key={branch._id}
                                                            className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-700 ${
                                                                formData.branch ===
                                                                branch._id
                                                                    ? 'bg-indigo-100 dark:bg-gray-700'
                                                                    : ''
                                                            }`}
                                                            onClick={() => {
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        branch: branch._id,
                                                                    })
                                                                );
                                                                setShowBranchDropdown(
                                                                    false
                                                                );
                                                            }}
                                                        >
                                                            {branch.branchName}{' '}
                                                            ({branch.branchCode}
                                                            )
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className='px-4 py-2 text-gray-500 dark:text-gray-400'>
                                                    No branches found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type='hidden'
                                name='branch'
                                value={formData.branch}
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
                            {currentSubject ? 'Update' : 'Add'} Subject
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title='Delete Subject'
                message={`Are you sure you want to delete "${currentSubject?.subjectName}"? This action cannot be undone.`}
            />
        </div>
    );
}

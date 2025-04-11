'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { deletePyq, fetchPyqs } from '@/redux/slices/pyqSlice';
import PyqFilters from '@/components/Pyqs/PyqFilters';
import PyqTable from '@/components/Pyqs/PyqTable';
import PyqViewModal from '@/components/Pyqs/PyqViewModal';
import PyqEditModal from '@/components/Pyqs/PyqEditModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import Pagination from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { Pyq } from '@/redux/slices/pyqSlice';
import toast from 'react-hot-toast';

export default function PyqPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [searchQuery, setSearchQuery] = useState('');
    const [examTypeFilter, setExamTypeFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [solvedFilter, setSolvedFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPyq, setCurrentPyq] = useState<Pyq | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { pyqs, loading, error } = useSelector(
        (state: RootState) => state.pyqs
    );

    const pyqsPerPage = 10;

    useEffect(() => {
        if (collegeName) {
            dispatch(fetchPyqs(collegeName as string));
        }
    }, [collegeName, dispatch]);

    // Filter pyqs
    const filteredPyqs = pyqs.filter((pyq) => {
        const matchesSearchQuery = pyq.subject.subjectName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesExamType = examTypeFilter
            ? pyq.examType === examTypeFilter
            : true;
        const matchesYear = yearFilter ? pyq.year === yearFilter : true;
        const matchesStatus =
            statusFilter !== '' ? String(pyq.status) === statusFilter : true;
        const matchesSolved =
            solvedFilter !== '' ? String(pyq.solved) === solvedFilter : true;

        return (
            matchesSearchQuery &&
            matchesExamType &&
            matchesYear &&
            matchesStatus &&
            matchesSolved
        );
    });

    // Pagination logic
    const indexOfLastPyq = currentPage * pyqsPerPage;
    const indexOfFirstPyq = indexOfLastPyq - pyqsPerPage;
    const currentPyqs = filteredPyqs.slice(indexOfFirstPyq, indexOfLastPyq);
    const totalPages = Math.ceil(filteredPyqs.length / pyqsPerPage);

    const openViewModal = (pyq: Pyq) => {
        setCurrentPyq(pyq);
        setIsViewModalOpen(true);
    };

    const openEditModal = (pyq: Pyq) => {
        setCurrentPyq(pyq);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (pyq: Pyq) => {
        setCurrentPyq(pyq);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!currentPyq) return;
        try {
            await dispatch(deletePyq(currentPyq._id)).unwrap();
            toast.success('PYQ deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to delete PYQ'
            );
        }
    };

    return (
        <div className='min-h-screen bg-indigo-50 dark:bg-gray-900 p-6'>
            <h1 className='text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2'>
                Previous Year Question Papers
            </h1>

            <PyqFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                examTypeFilter={examTypeFilter}
                setExamTypeFilter={setExamTypeFilter}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                solvedFilter={solvedFilter}
                setSolvedFilter={setSolvedFilter}
            />

            {currentPyqs.length > 0 ? (
                <>
                    <PyqTable
                        pyqs={currentPyqs}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />
                    <div className='mt-8 flex justify-center'>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            ) : (
                <div className='flex items-center justify-center min-h-[50vh]'>
                    {loading ? (
                        <Spinner size={2} />
                    ) : (
                        <div className='text-center p-4 rounded-lg shadow-3xl'>
                            <p className='text-xl font-semibold text-red-500 text-center'>
                                {error || 'No Pyqs found'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {currentPyq && (
                <>
                    <PyqViewModal
                        isOpen={isViewModalOpen}
                        onClose={() => setIsViewModalOpen(false)}
                        pyq={currentPyq}
                    />

                    <PyqEditModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        pyq={currentPyq}
                        collegeName={collegeName as string}
                    />

                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                        title='Delete PYQ'
                        message={`Are you sure you want to delete PYQ of ${currentPyq.subject.subjectName} (${currentPyq.year}, ${currentPyq.examType})? This action cannot be undone.`}
                    />
                </>
            )}
        </div>
    );
}

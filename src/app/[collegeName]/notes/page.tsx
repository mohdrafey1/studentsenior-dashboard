'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { deleteNote, fetchNotes } from '@/redux/slices/notesSlice';
import Pagination from '@/components/ui/Pagination';
import NoteFilters from '@/components/Notes/NoteFilters';
import NotesTable from '@/components/Notes/NotesTable';
import NoteViewModal from '@/components/Notes/NoteViewModal';
import NoteEditModal from '@/components/Notes/NoteEditModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { Note } from '@/redux/slices/notesSlice';
import toast from 'react-hot-toast';

export default function NotesPage() {
    const params = useParams();
    const collegeName = params?.collegeName;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isPaidFilter, setIsPaidFilter] = useState('');
    const [minClickFilter, setMinClickFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { notes, loading, error } = useSelector(
        (state: RootState) => state.notes
    );

    const notesPerPage = 10;

    useEffect(() => {
        if (collegeName) {
            dispatch(fetchNotes(collegeName as string));
        }
    }, [collegeName, dispatch]);

    // Filter notes
    const filteredNotes = notes.filter((note) => {
        const matchesSearchQuery =
            note.subject.subjectName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            note.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter !== '' ? String(note.status) === statusFilter : true;
        const matchesIsPaid =
            isPaidFilter !== '' ? String(note.isPaid) === isPaidFilter : true;
        const matchesMinClick =
            minClickFilter !== ''
                ? note.clickCounts >= Number(minClickFilter)
                : true;

        return (
            matchesSearchQuery &&
            matchesStatus &&
            matchesIsPaid &&
            matchesMinClick
        );
    });

    // Pagination logic
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

    const openViewModal = (note: Note) => {
        setCurrentNote(note);
        setIsViewModalOpen(true);
    };

    const openEditModal = (note: Note) => {
        setCurrentNote(note);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (note: Note) => {
        setCurrentNote(note);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!currentNote) return;
        try {
            await dispatch(deleteNote(currentNote._id)).unwrap();
            toast.success('Note deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(
                typeof error === 'string' ? error : 'Failed to delete note'
            );
        }
    };

    return (
        <div className='min-h-screen bg-indigo-50 dark:bg-gray-900 p-6'>
            <h1 className='text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mt-14 mb-2'>
                Notes Collection
            </h1>

            <NoteFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                isPaidFilter={isPaidFilter}
                setIsPaidFilter={setIsPaidFilter}
                minClickFilter={minClickFilter}
                setMinClickFilter={setMinClickFilter}
            />

            <NotesTable
                notes={currentNotes}
                loading={loading}
                error={error}
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

            <NoteViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                note={currentNote}
            />

            <NoteEditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setCurrentNote(null);
                }}
                note={currentNote}
                collegeName={collegeName as string}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title='Delete Note'
                message={`Are you sure you want to delete note "${currentNote?.title}" (${currentNote?.subject.subjectName})? This action cannot be undone.`}
            />
        </div>
    );
}

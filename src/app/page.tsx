'use client';

import { useEffect, useState } from 'react';
import { api } from '@/config/apiUrls';
import { Spinner } from '@/components/ui/Spinner';
import CollegeCard from '@/components/College/CollegeCard';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import EditCollegeModal from '@/components/College/EditCollegeModal';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { checkTokenExpiration } from '@/redux/slices/authSlice';

interface College {
    _id: string;
    name: string;
    description: string;
    location: string;
    slug: string;
    status: boolean;
}

const Home = () => {
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);
    const [collegeToDelete, setCollegeToDelete] = useState<College | null>(
        null
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (!checkTokenExpiration()) {
            dispatch(logout());
        }
    }, [dispatch]);

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await fetch(`${api.college.getColleges}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                setColleges(data);
            } catch (error) {
                console.error('Error fetching colleges:', error);
                toast.error('Something error occured fetching colleges');
            } finally {
                setLoading(false);
            }
        };
        fetchColleges();
    }, [token]);

    const handleDelete = async () => {
        if (!collegeToDelete || !token) return;

        try {
            const res = await fetch(
                `${api.college.deleteCollege}/${collegeToDelete._id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.ok) {
                setColleges(
                    colleges.filter(
                        (college) => college._id !== collegeToDelete._id
                    )
                );
                toast.success('College deleted successfully!');
                setCollegeToDelete(null);
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
        if (!token) return;

        try {
            const res = await fetch(
                `${api.college.deleteCollege}/${updatedCollege._id}`,
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
                setColleges(
                    colleges.map((college) =>
                        college._id === updatedCollege._id
                            ? updatedCollege
                            : college
                    )
                );
                toast.success('College updated successfully!');
                setEditingCollege(null);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size={3} />
            </div>
        );
    }

    const filteredColleges = showInactive
        ? colleges
        : colleges.filter((college) => college.status);

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-indigo-400 mb-8">
                Colleges
            </h1>

            {/* Toggle Button to Show/Hide Inactive Colleges */}
            <div className="flex justify-center mb-8">
                <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="px-4 py-2 bg-indigo-400 text-white rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-2"
                >
                    {showInactive ? (
                        <>
                            <span>Hide Inactive Colleges</span>
                        </>
                    ) : (
                        <>
                            <span>Show Inactive Colleges</span>
                        </>
                    )}
                </button>
            </div>

            {/* College Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredColleges.map((college) => (
                    <div key={college._id} className="relative">
                        {/* College Card */}
                        <CollegeCard college={college} />

                        {/* Edit and Delete Buttons */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                                onClick={() => setEditingCollege(college)}
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                                aria-label="Edit College"
                            >
                                <FaEdit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCollegeToDelete(college)}
                                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                                aria-label="Delete College"
                            >
                                <FaTrash className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {collegeToDelete && (
                <DeleteConfirmationModal
                    isOpen={!!collegeToDelete}
                    onClose={() => setCollegeToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete College"
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

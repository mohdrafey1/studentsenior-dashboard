'use client';

import { useState } from 'react';
import { X, Save, MapPin, FileText, Building2, Tag } from 'lucide-react';

interface College {
    _id: string;
    name: string;
    description: string;
    location: string;
    slug: string;
    status: boolean;
}

interface EditCollegeModalProps {
    college: College;
    onClose: () => void;
    onSave: (updatedCollege: College) => void;
}

const EditCollegeModal = ({
    college,
    onClose,
    onSave,
}: EditCollegeModalProps) => {
    const [editedCollege, setEditedCollege] = useState<College>(college);

    const handleSave = () => {
        onSave(editedCollege);
        onClose();
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-60 backdrop-blur-sm z-50'>
            <div className='bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-bold text-slate-800 dark:text-white'>
                        Edit College
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors'
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <Building2 size={18} className='text-indigo-500' />
                            <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                                College Name
                            </label>
                        </div>
                        <input
                            type='text'
                            value={editedCollege.name}
                            onChange={(e) =>
                                setEditedCollege({
                                    ...editedCollege,
                                    name: e.target.value,
                                })
                            }
                            className='w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                            placeholder='Enter college name'
                        />
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <FileText size={18} className='text-indigo-500' />
                            <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                                Description
                            </label>
                        </div>
                        <textarea
                            value={editedCollege.description}
                            onChange={(e) =>
                                setEditedCollege({
                                    ...editedCollege,
                                    description: e.target.value,
                                })
                            }
                            className='w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-24 transition-all'
                            placeholder='Enter description'
                        />
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <MapPin size={18} className='text-indigo-500' />
                            <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                                Location
                            </label>
                        </div>
                        <input
                            type='text'
                            value={editedCollege.location}
                            onChange={(e) =>
                                setEditedCollege({
                                    ...editedCollege,
                                    location: e.target.value,
                                })
                            }
                            className='w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                            placeholder='Enter location'
                        />
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <Tag size={18} className='text-indigo-500' />
                            <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                                URL Slug
                            </label>
                        </div>
                        <input
                            type='text'
                            value={editedCollege.slug}
                            onChange={(e) =>
                                setEditedCollege({
                                    ...editedCollege,
                                    slug: e.target.value,
                                })
                            }
                            className='w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                            placeholder='Enter slug'
                        />
                    </div>

                    <label className='flex items-center py-2 cursor-pointer'>
                        <div className='relative'>
                            <input
                                type='checkbox'
                                checked={editedCollege.status}
                                onChange={(e) =>
                                    setEditedCollege({
                                        ...editedCollege,
                                        status: e.target.checked,
                                    })
                                }
                                className='sr-only'
                            />
                            <div
                                className={`block w-14 h-8 rounded-full transition-colors ${
                                    editedCollege.status
                                        ? 'bg-indigo-500'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                            ></div>
                            <div
                                className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${
                                    editedCollege.status ? 'translate-x-6' : ''
                                }`}
                            ></div>
                        </div>
                        <span className='ml-3 text-slate-700 dark:text-slate-300 font-medium'>
                            {editedCollege.status ? 'Active' : 'Inactive'}
                        </span>
                    </label>
                </div>

                <div className='flex justify-end gap-3 mt-6'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className='px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2'
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCollegeModal;

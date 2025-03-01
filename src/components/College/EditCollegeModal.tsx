'use client';

import { useState } from 'react';

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Edit College</h2>

                <label className="block mb-2">
                    Name:
                    <input
                        type="text"
                        value={editedCollege.name}
                        onChange={(e) =>
                            setEditedCollege({
                                ...editedCollege,
                                name: e.target.value,
                            })
                        }
                        className="w-full border p-2 rounded"
                    />
                </label>

                <label className="block mb-2">
                    Description:
                    <textarea
                        value={editedCollege.description}
                        onChange={(e) =>
                            setEditedCollege({
                                ...editedCollege,
                                description: e.target.value,
                            })
                        }
                        className="w-full border p-2 rounded"
                    />
                </label>

                <label className="block mb-2">
                    Location:
                    <input
                        type="text"
                        value={editedCollege.location}
                        onChange={(e) =>
                            setEditedCollege({
                                ...editedCollege,
                                location: e.target.value,
                            })
                        }
                        className="w-full border p-2 rounded"
                    />
                </label>

                <label className="block mb-2">
                    Slug:
                    <input
                        type="text"
                        value={editedCollege.slug}
                        onChange={(e) =>
                            setEditedCollege({
                                ...editedCollege,
                                slug: e.target.value,
                            })
                        }
                        className="w-full border p-2 rounded"
                    />
                </label>

                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={editedCollege.status}
                        onChange={(e) =>
                            setEditedCollege({
                                ...editedCollege,
                                status: e.target.checked,
                            })
                        }
                        className="mr-2"
                    />
                    Active
                </label>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCollegeModal;

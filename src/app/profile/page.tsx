'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { checkTokenExpiration } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';

export default function Users() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!checkTokenExpiration()) {
            dispatch(logout());
        }
    }, [dispatch]);

    const { email, role } = useSelector((state: RootState) => state.auth);

    return (
        <main className="h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all hover:scale-105">
                <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
                    Welcome to Your Profile
                </h2>
                <div className="space-y-4">
                    <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                            Role
                        </p>
                        <p className="text-lg font-medium text-green-600 dark:text-green-300">
                            {role}
                        </p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                            Email
                        </p>
                        <p className="text-lg font-medium text-blue-600 dark:text-blue-300">
                            {email}
                        </p>
                    </div>
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
                    Manage your account settings and preferences here.
                </p>
            </div>
        </main>
    );
}

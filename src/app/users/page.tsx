'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { checkTokenExpiration } from '@/redux/slices/authSlice';

export default function Users() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!checkTokenExpiration()) {
            dispatch(logout());
        }
    }, [dispatch]);

    return <div>Welcome to New User</div>;
}

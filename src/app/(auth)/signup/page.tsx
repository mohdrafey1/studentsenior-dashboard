'use client';

import { api } from '@/config/apiUrls';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaUniversity,
    FaKey,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slices/authSlice';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [college, setCollege] = useState('');
    const [secretCode, setSecretCode] = useState('');

    const dispatch = useDispatch();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`${api.auth.signup}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                name,
                college,
                password,
                secretCode,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success(`Signup successful! Your role: ${data.role}`);

            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            const expirationTime = tokenPayload.exp * 1000;

            dispatch(login({ token: data.token, expirationTime }));

            window.location.href = '/';
        } else {
            toast.error(data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-indigo-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-indigo-400">
                    Sign Up
                </h2>
                <form className="space-y-4" onSubmit={handleSignup}>
                    {/* Full Name */}
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 pl-10 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 pl-10 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 pl-10 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {/* College */}
                    <div className="relative">
                        <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                        <input
                            type="text"
                            placeholder="College"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="w-full p-3 pl-10 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Secret Code */}
                    <div className="relative">
                        <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                        <input
                            type="text"
                            placeholder="Secret Code for Admin and Moderator (Optional)"
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            className="w-full p-3 pl-10 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="w-full p-3 text-white bg-indigo-400 rounded-md hover:bg-indigo-500 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md fixed w-full top-0 left-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <Link href="/" className="text-2xl font-bold text-indigo-500">
                    StudentSenior
                </Link>

                <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="hover:text-indigo-500">
                        Home
                    </Link>
                    <Link href="/add-college" className="hover:text-indigo-500">
                        Add College
                    </Link>
                    <Link href="/users" className="hover:text-indigo-500">
                        Users
                    </Link>
                </nav>

                {/* Right Section: Theme Toggle & Auth */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? (
                            <FaSun className="w-6 h-6 text-yellow-400" />
                        ) : (
                            <FaMoon className="w-6 h-6 text-indigo-500" />
                        )}
                    </button>

                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="hidden md:flex space-x-4">
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? (
                        <FaTimes className="w-6 h-6 text-indigo-500" />
                    ) : (
                        <FaBars className="w-6 h-6 text-indigo-500" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <div
                className={`fixed inset-0 bg-white bg-opacity-50 transition-opacity ${
                    isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } md:hidden`}
                onClick={toggleMenu}
            ></div>

            <nav
                className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform md:hidden flex flex-col items-start p-6 space-y-6`}
            >
                <button
                    onClick={toggleMenu}
                    className="self-end p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Close Menu"
                >
                    <FaTimes className="w-6 h-6" />
                </button>

                <Link
                    href="/"
                    className="text-lg hover:text-indigo-500"
                    onClick={toggleMenu}
                >
                    Home
                </Link>
                <Link
                    href="/add-college"
                    className="text-lg hover:text-indigo-500"
                    onClick={toggleMenu}
                >
                    Add College
                </Link>
                <Link
                    href="/users"
                    className="text-lg hover:text-indigo-500"
                    onClick={toggleMenu}
                >
                    Users
                </Link>

                <div className="border-t w-full pt-4">
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                handleLogout();
                                toggleMenu();
                            }}
                            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <Link
                                href="/login"
                                className="block text-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                                onClick={toggleMenu}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="block text-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                onClick={toggleMenu}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;

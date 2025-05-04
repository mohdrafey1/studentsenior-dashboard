'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import {
    Sun,
    Moon,
    Menu,
    X,
    Home,
    BarChart3,
    User,
    LogOut,
    BookOpen,
} from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const navigationLinks = [
        { name: 'Home', href: '/', icon: <Home className='w-5 h-5' /> },
        {
            name: 'Reports',
            href: '/reports',
            icon: <BarChart3 className='w-5 h-5' />,
        },
        {
            name: 'Resources',
            href: '/',
            icon: <BookOpen className='w-5 h-5' />,
        },
        // {
        //     name: 'Notifications',
        //     href: '/',
        //     icon: <Bell className='w-5 h-5' />,
        // },
        {
            name: 'Profile',
            href: '/profile',
            icon: <User className='w-5 h-5' />,
        },
    ];

    return (
        <header className='bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md fixed w-full top-0 left-0 z-39'>
            <div className='container mx-auto flex justify-between items-center py-3 px-6'>
                <Link href='/' className='flex items-center gap-2'>
                    <div className='bg-indigo-600 text-white p-2 rounded-lg'>
                        <BookOpen className='w-5 h-5' />
                    </div>
                    <span className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                        StudentSenior
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden md:flex space-x-1'>
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className='px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5'
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right Section: Theme Toggle & Auth */}
                <div className='flex items-center gap-3'>
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                        aria-label='Toggle Dark Mode'
                    >
                        {isDarkMode ? (
                            <Sun className='w-5 h-5 text-amber-400' />
                        ) : (
                            <Moon className='w-5 h-5 text-indigo-500' />
                        )}
                    </button>

                    <div className='h-6 w-px bg-gray-300 dark:bg-gray-700 hidden md:block'></div>

                    {isAuthenticated ? (
                        <div className='hidden md:flex items-center gap-3'>
                            {/* <button
                                onClick={handleSetting}
                                className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                            >
                                <Settings className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                            </button> */}

                            <div className='h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium'>
                                R
                            </div>

                            <button
                                onClick={handleLogout}
                                className='flex items-center gap-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors'
                            >
                                <LogOut className='w-5 h-5' />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className='hidden md:flex items-center gap-3'>
                            <Link
                                href='/login'
                                className='px-4 py-2 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors'
                            >
                                Login
                            </Link>
                            <Link
                                href='/signup'
                                className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors'
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                        aria-label='Toggle Menu'
                    >
                        {isMenuOpen ? (
                            <X className='w-5 h-5 text-indigo-500' />
                        ) : (
                            <Menu className='w-5 h-5 text-indigo-500' />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {isMenuOpen && (
                <div
                    className='fixed inset-0 bg-black/20 dark:bg-black/50 z-40 backdrop-blur-sm'
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Navigation Drawer */}
            <nav
                className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl transform ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out md:hidden flex flex-col z-50`}
            >
                <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center gap-2'>
                        <div className='bg-indigo-600 text-white p-2 rounded-lg'>
                            <BookOpen className='w-5 h-5' />
                        </div>
                        <span className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                            StudentSenior
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                        aria-label='Close Menu'
                    >
                        <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto py-4 px-4'>
                    <div className='space-y-2'>
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className='flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.icon}
                                <span className='font-medium'>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                            Theme
                        </span>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                            aria-label='Toggle Dark Mode'
                        >
                            {isDarkMode ? (
                                <Sun className='w-5 h-5 text-amber-400' />
                            ) : (
                                <Moon className='w-5 h-5 text-indigo-500' />
                            )}
                        </button>
                    </div>

                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className='w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors'
                        >
                            <LogOut className='w-5 h-5' />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <div className='space-y-3'>
                            <Link
                                href='/login'
                                className='block text-center w-full px-4 py-3 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href='/signup'
                                className='block text-center w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors'
                                onClick={() => setIsMenuOpen(false)}
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

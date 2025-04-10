'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCollegeData,
    selectCollegeData,
} from '@/redux/slices/collegeDataSlice';
import { AppDispatch } from '@/redux/store';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { capitalizeWords } from '@/utils/Capitalize';
import {
    BarChart3,
    Book,
    Users,
    ShoppingBag,
    MessageSquare,
    Search,
    UserPlus,
    Lightbulb,
    ClipboardList,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';

const CollegeDataPage = () => {
    const { collegeName } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { data, previousData, loading, error } =
        useSelector(selectCollegeData);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (collegeName) {
            dispatch(fetchCollegeData(collegeName as string));
        }
    }, [collegeName, dispatch]);

    const refreshData = async () => {
        setIsRefreshing(true);
        if (collegeName) {
            await dispatch(fetchCollegeData(collegeName as string));
        }
        setTimeout(() => {
            setIsRefreshing(false);
        }, 600);
    };

    // Define stats categories for better organization
    const statsCategories = [
        {
            title: 'Academic Resources',
            stats: [
                {
                    id: 'pyqs',
                    title: 'Total PYQs',
                    value: data?.totalNewPyqs || 0,
                    previousValue: previousData?.totalNewPyqs || 0,
                    icon: <ClipboardList className='w-6 h-6' />,
                    href: `${collegeName}/pyqs`,
                    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
                    textColor: 'text-indigo-600 dark:text-indigo-400',
                    iconColor: 'text-indigo-500 dark:text-indigo-300',
                },
                {
                    id: 'notes',
                    title: 'Total Notes',
                    value: data?.totalNotes || 0,
                    previousValue: previousData?.totalNotes || 0,
                    icon: <Book className='w-6 h-6' />,
                    href: `${collegeName}/notes`,
                    bgColor: 'bg-blue-100 dark:bg-blue-900',
                    textColor: 'text-blue-600 dark:text-blue-400',
                    iconColor: 'text-blue-500 dark:text-blue-300',
                },
                {
                    id: 'requestedPyqs',
                    title: 'Requested PYQs',
                    value: data?.totalRequestedPyqs || 0,
                    previousValue: previousData?.totalRequestedPyqs || 0,
                    icon: <Search className='w-6 h-6' />,
                    href: `${collegeName}/requested-pyq`,
                    bgColor: 'bg-amber-100 dark:bg-amber-900',
                    textColor: 'text-amber-600 dark:text-amber-400',
                    iconColor: 'text-amber-500 dark:text-amber-300',
                },
            ],
        },
        {
            title: 'Community',
            stats: [
                {
                    id: 'seniors',
                    title: 'Total Seniors',
                    value: data?.totalSeniors || 0,
                    previousValue: previousData?.totalSeniors || 0,
                    icon: <UserPlus className='w-6 h-6' />,
                    href: `${collegeName}/seniors`,
                    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
                    textColor: 'text-emerald-600 dark:text-emerald-400',
                    iconColor: 'text-emerald-500 dark:text-emerald-300',
                },
                {
                    id: 'posts',
                    title: 'Total Posts',
                    value: data?.totalPost || 0,
                    previousValue: previousData?.totalPost || 0,
                    icon: <MessageSquare className='w-6 h-6' />,
                    href: `${collegeName}/posts`,
                    bgColor: 'bg-purple-100 dark:bg-purple-900',
                    textColor: 'text-purple-600 dark:text-purple-400',
                    iconColor: 'text-purple-500 dark:text-purple-300',
                },
                {
                    id: 'groups',
                    title: 'Total Groups',
                    value: data?.totalGroups || 0,
                    previousValue: previousData?.totalGroups || 0,
                    icon: <Users className='w-6 h-6' />,
                    href: `${collegeName}/groups`,
                    bgColor: 'bg-cyan-100 dark:bg-cyan-900',
                    textColor: 'text-cyan-600 dark:text-cyan-400',
                    iconColor: 'text-cyan-500 dark:text-cyan-300',
                },
            ],
        },
        {
            title: 'Resources & Opportunities',
            stats: [
                {
                    id: 'products',
                    title: 'Total Products',
                    value: data?.totalProduct || 0,
                    previousValue: previousData?.totalProduct || 0,
                    icon: <ShoppingBag className='w-6 h-6' />,
                    href: `${collegeName}/products`,
                    bgColor: 'bg-rose-100 dark:bg-rose-900',
                    textColor: 'text-rose-600 dark:text-rose-400',
                    iconColor: 'text-rose-500 dark:text-rose-300',
                },
                {
                    id: 'lostFound',
                    title: 'Lost & Found Items',
                    value: data?.totalLostFound || 0,
                    previousValue: previousData?.totalLostFound || 0,
                    icon: <Search className='w-6 h-6' />,
                    href: `${collegeName}/lost-found`,
                    bgColor: 'bg-red-100 dark:bg-red-900',
                    textColor: 'text-red-600 dark:text-red-400',
                    iconColor: 'text-red-500 dark:text-red-300',
                },
                {
                    id: 'opportunities',
                    title: 'Opportunities',
                    value: data?.totalGiveOpportunity || 0,
                    previousValue: previousData?.totalGiveOpportunity || 0,
                    icon: <Lightbulb className='w-6 h-6' />,
                    href: `${collegeName}/opportunities`,
                    bgColor: 'bg-green-100 dark:bg-green-900',
                    textColor: 'text-green-600 dark:text-green-400',
                    iconColor: 'text-green-500 dark:text-green-300',
                },
            ],
        },
    ];

    return (
        <main className='mt-14 min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <div className='p-6 max-w-7xl mx-auto'>
                <div className='flex flex-col md:flex-row items-center justify-between mb-6'>
                    <div className='flex items-center mb-4 md:mb-0'>
                        <div className='bg-indigo-600 text-white p-3 rounded-lg mr-4'>
                            <BarChart3 className='w-6 h-6' />
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
                                {capitalizeWords(collegeName as string)}{' '}
                                Statistics
                            </h1>
                            <p className='text-gray-500 dark:text-gray-400'>
                                College resources and activity insights
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={refreshData}
                        className='px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${
                                isRefreshing ? 'animate-spin' : ''
                            }`}
                        />
                        Refresh Data
                    </button>
                </div>

                {error && (
                    <div className='bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-8'>
                        <div className='flex items-center'>
                            <AlertCircle className='w-5 h-5 mr-2' />
                            <span>
                                Failed to load college statistics: {error}
                            </span>
                        </div>
                    </div>
                )}

                {loading && !data ? (
                    <div className='flex items-center justify-center py-20'>
                        <Spinner size={2} />
                    </div>
                ) : data ? (
                    <div className='space-y-8'>
                        {statsCategories.map((category, index) => (
                            <div
                                key={index}
                                className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden'
                            >
                                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                                    <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                                        {category.title}
                                    </h2>
                                </div>
                                <div className='p-6'>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                        {category.stats.map((stat) => (
                                            <a
                                                href={stat.href}
                                                key={stat.id}
                                                className='block group'
                                            >
                                                <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
                                                    <div
                                                        className={`p-6 ${stat.bgColor} bg-opacity-20 dark:bg-opacity-20`}
                                                    >
                                                        <div className='flex justify-between items-start mb-4'>
                                                            <div>
                                                                <h3
                                                                    className={`text-lg font-medium ${stat.textColor}`}
                                                                >
                                                                    {stat.title}
                                                                </h3>
                                                                <div className='mt-1 flex items-baseline'>
                                                                    <p className='text-3xl font-semibold text-gray-900 dark:text-white'>
                                                                        {stat.value.toLocaleString()}
                                                                    </p>

                                                                    {/* Percentage change indicator */}
                                                                    {stat.previousValue >
                                                                        0 && (
                                                                        <span
                                                                            className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full flex items-center ${
                                                                                stat.value >
                                                                                stat.previousValue
                                                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                                                                    : stat.value <
                                                                                      stat.previousValue
                                                                                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                                                            }`}
                                                                        >
                                                                            {stat.previousValue >
                                                                            0 ? (
                                                                                <span>
                                                                                    {stat.value >
                                                                                    stat.previousValue
                                                                                        ? '+'
                                                                                        : ''}
                                                                                    {Math.round(
                                                                                        ((stat.value -
                                                                                            stat.previousValue) /
                                                                                            stat.previousValue) *
                                                                                            100
                                                                                    )}

                                                                                    %
                                                                                </span>
                                                                            ) : (
                                                                                'New'
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`p-3 rounded-lg ${stat.bgColor} bg-opacity-60 dark:bg-opacity-40 ${stat.iconColor}`}
                                                            >
                                                                {stat.icon}
                                                            </div>
                                                        </div>

                                                        {stat.previousValue >
                                                            0 && (
                                                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                                Previous:{' '}
                                                                {stat.previousValue.toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className='px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700'>
                                                        <div className='text-sm text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center'>
                                                            <span>
                                                                View details
                                                            </span>
                                                            <svg
                                                                className='ml-1 w-4 h-4 transition-transform group-hover:translate-x-1'
                                                                fill='none'
                                                                stroke='currentColor'
                                                                viewBox='0 0 24 24'
                                                                xmlns='http://www.w3.org/2000/svg'
                                                            >
                                                                <path
                                                                    strokeLinecap='round'
                                                                    strokeLinejoin='round'
                                                                    strokeWidth='2'
                                                                    d='M9 5l7 7-7 7'
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md text-center p-10'>
                        <div className='mx-auto max-w-md'>
                            <BarChart3 className='w-16 h-16 mx-auto text-gray-400 mb-4' />
                            <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
                                No College Data Available
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 mb-6'>
                                There are no statistics available for this
                                college at this time.
                            </p>
                            <button
                                onClick={refreshData}
                                className='inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors'
                            >
                                <RefreshCw className='mr-2 h-4 w-4' />
                                Refresh Data
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default CollegeDataPage;

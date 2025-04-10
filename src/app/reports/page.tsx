'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchReportStats } from '@/redux/slices/reportStatsSlice';
import { Spinner } from '@/components/ui/Spinner';
import {
    BarChart3,
    Users,
    Book,
    Building,
    GraduationCap,
    ShoppingBag,
    Gift,
    CreditCard,
    PhoneCall,
    LayoutDashboard,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';

const ReportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentData, previousData, loading, error } = useSelector(
        (state: RootState) => state.reportStats
    );
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchReportStats());
    }, [dispatch]);

    const refreshData = async () => {
        setIsRefreshing(true);
        await dispatch(fetchReportStats());
        setTimeout(() => {
            setIsRefreshing(false);
        }, 600);
    };

    // Define stats categories for better organization
    const statsCategories = [
        {
            title: 'Financial',
            stats: [
                {
                    id: 'payments',
                    title: 'Total Payments',
                    value: currentData?.totalPayments || 0,
                    previousValue: previousData?.totalPayments || 0,
                    icon: <CreditCard className='w-6 h-6' />,
                    href: '/payments',
                    bgColor: 'bg-green-100 dark:bg-green-900',
                    textColor: 'text-green-600 dark:text-green-400',
                    iconColor: 'text-green-500 dark:text-green-300',
                },
                {
                    id: 'redemption',
                    title: 'Total Redemptions',
                    value: currentData?.totalRedemptionRequest || 0,
                    previousValue: previousData?.totalRedemptionRequest || 0,
                    icon: <Gift className='w-6 h-6' />,
                    href: '/redemption-request',
                    bgColor: 'bg-purple-100 dark:bg-purple-900',
                    textColor: 'text-purple-600 dark:text-purple-400',
                    iconColor: 'text-purple-500 dark:text-purple-300',
                },
                {
                    id: 'transactions',
                    title: 'Total Transactions',
                    value: currentData?.totalTransactions || 0,
                    previousValue: previousData?.totalTransactions || 0,
                    icon: <BarChart3 className='w-6 h-6' />,
                    href: '/transactions',
                    bgColor: 'bg-blue-100 dark:bg-blue-900',
                    textColor: 'text-blue-600 dark:text-blue-400',
                    iconColor: 'text-blue-500 dark:text-blue-300',
                },
            ],
        },
        {
            title: 'Users',
            stats: [
                {
                    id: 'users',
                    title: 'Total Users',
                    value: currentData?.totalClient || 0,
                    previousValue: previousData?.totalClient || 0,
                    icon: <Users className='w-6 h-6' />,
                    href: '/users',
                    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
                    textColor: 'text-indigo-600 dark:text-indigo-400',
                    iconColor: 'text-indigo-500 dark:text-indigo-300',
                },
                {
                    id: 'dashboardUsers',
                    title: 'Dashboard Users',
                    value: currentData?.totalDashboardUser || 0,
                    previousValue: previousData?.totalDashboardUser || 0,
                    icon: <LayoutDashboard className='w-6 h-6' />,
                    href: '/dashboard-users',
                    bgColor: 'bg-amber-100 dark:bg-amber-900',
                    textColor: 'text-amber-600 dark:text-amber-400',
                    iconColor: 'text-amber-500 dark:text-amber-300',
                },
                {
                    id: 'contactUs',
                    title: 'Contact Requests',
                    value: currentData?.totalContactUs || 0,
                    previousValue: previousData?.totalContactUs || 0,
                    icon: <PhoneCall className='w-6 h-6' />,
                    href: '/contactus',
                    bgColor: 'bg-pink-100 dark:bg-pink-900',
                    textColor: 'text-pink-600 dark:text-pink-400',
                    iconColor: 'text-pink-500 dark:text-pink-300',
                },
            ],
        },
        {
            title: 'Education',
            stats: [
                {
                    id: 'subjects',
                    title: 'Total Subjects',
                    value: currentData?.totalSubjects || 0,
                    previousValue: previousData?.totalSubjects || 0,
                    icon: <Book className='w-6 h-6' />,
                    href: '/subjects',
                    bgColor: 'bg-cyan-100 dark:bg-cyan-900',
                    textColor: 'text-cyan-600 dark:text-cyan-400',
                    iconColor: 'text-cyan-500 dark:text-cyan-300',
                },
                {
                    id: 'branches',
                    title: 'Total Branches',
                    value: currentData?.totalBranch || 0,
                    previousValue: previousData?.totalBranch || 0,
                    icon: <Building className='w-6 h-6' />,
                    href: '/branches',
                    bgColor: 'bg-teal-100 dark:bg-teal-900',
                    textColor: 'text-teal-600 dark:text-teal-400',
                    iconColor: 'text-teal-500 dark:text-teal-300',
                },
                {
                    id: 'courses',
                    title: 'Total Courses',
                    value: currentData?.totalCourse || 0,
                    previousValue: previousData?.totalCourse || 0,
                    icon: <GraduationCap className='w-6 h-6' />,
                    href: '/courses',
                    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
                    textColor: 'text-emerald-600 dark:text-emerald-400',
                    iconColor: 'text-emerald-500 dark:text-emerald-300',
                },
                {
                    id: 'affiliateProducts',
                    title: 'Affiliate Products',
                    value: currentData?.totalAffiliateProduct || 0,
                    previousValue: previousData?.totalAffiliateProduct || 0,
                    icon: <ShoppingBag className='w-6 h-6' />,
                    href: '/affiliate-products',
                    bgColor: 'bg-rose-100 dark:bg-rose-900',
                    textColor: 'text-rose-600 dark:text-rose-400',
                    iconColor: 'text-rose-500 dark:text-rose-300',
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
                                Dashboard Analytics
                            </h1>
                            <p className='text-gray-500 dark:text-gray-400'>
                                Platform statistics and insights
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
                            <span>Failed to load statistics: {error}</span>
                        </div>
                    </div>
                )}

                {loading && !currentData ? (
                    <div className='flex items-center justify-center py-20'>
                        <Spinner size={2} />
                    </div>
                ) : currentData ? (
                    <div className='space-y-8'>
                        {statsCategories.map((category, index) => (
                            <div
                                key={index}
                                className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden'
                            >
                                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                                    <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                                        {category.title} Statistics
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
                                No Statistics Available
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 mb-6'>
                                There are no statistics available to display at
                                this time.
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

export default ReportPage;

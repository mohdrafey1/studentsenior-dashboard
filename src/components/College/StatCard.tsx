import Link from 'next/link';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    previousValue: number;
    icon: ReactNode;
    href?: string;
    bgColor?: string;
    textColor?: string;
    iconColor?: string;
}

const StatCard = ({
    title,
    value,
    previousValue,
    icon,
    href,
    bgColor = 'bg-indigo-100 dark:bg-indigo-900',
    textColor = 'text-indigo-600 dark:text-indigo-400',
    iconColor = 'text-indigo-500 dark:text-indigo-300',
}: StatCardProps) => {
    const percentageChange =
        previousValue > 0
            ? Math.round(((value - previousValue) / previousValue) * 100)
            : 0;

    const isPositiveChange = value > previousValue;
    const isNegativeChange = value < previousValue;
    const hasChange = previousValue > 0;

    const cardContent = (
        <div className='block group'>
            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
                <div
                    className={`p-6 ${bgColor} bg-opacity-20 dark:bg-opacity-20`}
                >
                    <div className='flex justify-between items-start mb-4'>
                        <div>
                            <h3 className={`text-lg font-medium ${textColor}`}>
                                {title}
                            </h3>
                            <div className='mt-1 flex items-baseline'>
                                <p className='text-3xl font-semibold text-gray-900 dark:text-white'>
                                    {value.toLocaleString()}
                                </p>

                                {/* Percentage change indicator */}
                                {hasChange && (
                                    <span
                                        className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full flex items-center ${
                                            isPositiveChange
                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                                : isNegativeChange
                                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                        }`}
                                    >
                                        {hasChange ? (
                                            <span>
                                                {isPositiveChange ? '+' : ''}
                                                {percentageChange}%
                                            </span>
                                        ) : (
                                            'New'
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-lg ${bgColor} bg-opacity-60 dark:bg-opacity-40 ${iconColor}`}
                        >
                            {icon}
                        </div>
                    </div>

                    {hasChange && (
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            Previous: {previousValue.toLocaleString()}
                        </p>
                    )}
                </div>

                <div className='px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700'>
                    <div className='text-sm text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center'>
                        <span>View details</span>
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
        </div>
    );

    if (href) {
        return <Link href={href}>{cardContent}</Link>;
    }

    return cardContent;
};

export default StatCard;

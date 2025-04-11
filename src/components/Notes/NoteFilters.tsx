import React from 'react';

interface NoteFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    isPaidFilter: string;
    setIsPaidFilter: (value: string) => void;
    minClickFilter: string;
    setMinClickFilter: (value: string) => void;
}

const NoteFilters: React.FC<NoteFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isPaidFilter,
    setIsPaidFilter,
    minClickFilter,
    setMinClickFilter,
}) => {
    return (
        <div className='mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4'>
            <input
                type='text'
                placeholder='Search by subject or title...'
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value=''>All Status</option>
                <option value='true'>Approved</option>
                <option value='false'>Pending</option>
            </select>
            <select
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                value={isPaidFilter}
                onChange={(e) => setIsPaidFilter(e.target.value)}
            >
                <option value=''>All</option>
                <option value='true'>Paid</option>
                <option value='false'>Free</option>
            </select>
            <input
                type='number'
                placeholder='Min Clicks'
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                value={minClickFilter}
                onChange={(e) => setMinClickFilter(e.target.value)}
            />
        </div>
    );
};

export default NoteFilters;

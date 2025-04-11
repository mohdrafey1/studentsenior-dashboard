import React from 'react';

interface PyqFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    examTypeFilter: string;
    setExamTypeFilter: (value: string) => void;
    yearFilter: string;
    setYearFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    solvedFilter: string;
    setSolvedFilter: (value: string) => void;
}

const PyqFilters: React.FC<PyqFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    examTypeFilter,
    setExamTypeFilter,
    yearFilter,
    setYearFilter,
    statusFilter,
    setStatusFilter,
    solvedFilter,
    setSolvedFilter,
}) => {
    return (
        <div className='mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4'>
            <input
                type='text'
                placeholder='Search by subject name...'
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                value={examTypeFilter}
                onChange={(e) => setExamTypeFilter(e.target.value)}
            >
                <option value=''>All Exam Types</option>
                <option value='midsem1'>Midsem 1</option>
                <option value='midsem2'>Midsem 2</option>
                <option value='endsem'>Endsem</option>
                <option value='improvement'>Improvements</option>
            </select>
            <select
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white'
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
            >
                <option value=''>All Years</option>
                <option value='2024-25'>2024-25</option>
                <option value='2023-24'>2023-24</option>
                <option value='2022-23'>2022-23</option>
                <option value='2021-22'>2021-22</option>
            </select>
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
                value={solvedFilter}
                onChange={(e) => setSolvedFilter(e.target.value)}
            >
                <option value=''>All</option>
                <option value='true'>Solved</option>
                <option value='false'>Unsolved</option>
            </select>
        </div>
    );
};

export default PyqFilters;

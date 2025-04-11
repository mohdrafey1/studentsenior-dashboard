import React, { ReactNode } from 'react';

interface PyqStatsCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
}

const PyqStatsCard: React.FC<PyqStatsCardProps> = ({ icon, label, value }) => {
    return (
        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center'>
            <div className='mb-1'>{icon}</div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
                {label}
            </div>
            <div className='font-bold text-gray-900 dark:text-white'>
                {value}
            </div>
        </div>
    );
};

export default PyqStatsCard;

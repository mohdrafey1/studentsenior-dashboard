'use client';

import { api } from '@/config/apiUrls';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/Spinner';
import StatCard from '@/components/College/StatCard';
import { capitalizeWords } from '@/utils/Capitalize';

interface CollegeData {
    totalPYQs: number;
    totalNotes: number;
    totalSeniors: number;
    totalProduct: number;
    totalPost: number;
    totalRequestedPyqs: number;
    totalNewPyqs: number;
    totalLostFound: number;
    totalGroups: number;
    totalGiveOpportunity: number;
}

const CollegeDataPage = () => {
    const { collegeName } = useParams();
    const [data, setData] = useState<CollegeData | null>(null);
    const [previousData, setPreviousData] = useState<CollegeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${api.college.collegeData}/${collegeName}`
                );
                if (!res.ok) throw new Error('Failed to fetch data');
                const jsonData: CollegeData = await res.json();

                // Get previous data from localStorage
                const storedData = localStorage.getItem(
                    `collegeData_${collegeName}`
                );
                const previousData = storedData ? JSON.parse(storedData) : null;

                // Save current data to localStorage
                localStorage.setItem(
                    `collegeData_${collegeName}`,
                    JSON.stringify(jsonData)
                );

                setData(jsonData);
                setPreviousData(previousData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (collegeName) fetchData();
    }, [collegeName]);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-700">
                <Spinner size={3} />
            </div>
        );
    if (error)
        return (
            <div className="text-center text-red-500 min-h-screen flex items-center justify-center">
                {error}
            </div>
        );

    return (
        <main className="h-screen bg-indigo-50 dark:bg-gray-900">
            <div className="p-6 max-w-6xl mx-auto bg-indigo-50 dark:bg-gray-900 shadow-lg rounded-lg mt-16">
                <h1 className="text-3xl text-center font-bold mb-8 text-indigo-500 dark:text-indigo-400">
                    {capitalizeWords(collegeName as string)} Stats
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Total New PYQs */}
                    <StatCard
                        title="Total New PYQs"
                        value={data?.totalNewPyqs || 0}
                        previousValue={previousData?.totalNewPyqs || 0}
                        icon="📩"
                        href={`${collegeName}/pyqs`}
                    />

                    {/* Total Notes */}
                    <StatCard
                        title="Total Notes"
                        value={data?.totalNotes || 0}
                        previousValue={previousData?.totalNotes || 0}
                        icon="📚"
                        href={`${collegeName}/notes`}
                    />

                    {/* Total Seniors */}
                    <StatCard
                        title="Total Seniors"
                        value={data?.totalSeniors || 0}
                        previousValue={previousData?.totalSeniors || 0}
                        icon="🎓"
                        href={`${collegeName}/seniors`}
                    />

                    {/* Total Products */}
                    <StatCard
                        title="Total Products"
                        value={data?.totalProduct || 0}
                        previousValue={previousData?.totalProduct || 0}
                        icon="🛒"
                        href={`${collegeName}/products`}
                    />

                    {/* Total Posts */}
                    <StatCard
                        title="Total Posts"
                        value={data?.totalPost || 0}
                        previousValue={previousData?.totalPost || 0}
                        icon="📢"
                        href={`${collegeName}/posts`}
                    />

                    {/* Total Lost & Found */}
                    <StatCard
                        title="Total Lost & Found"
                        value={data?.totalLostFound || 0}
                        previousValue={previousData?.totalLostFound || 0}
                        icon="🆘"
                        href={`${collegeName}/lost-found`}
                    />

                    {/* Total Groups */}
                    <StatCard
                        title="Total Groups"
                        value={data?.totalGroups || 0}
                        previousValue={previousData?.totalGroups || 0}
                        icon="👥"
                        href={`${collegeName}/groups`}
                    />

                    {/* Total Community Opportunities */}
                    <StatCard
                        title="Total Opportunities"
                        value={data?.totalGiveOpportunity || 0}
                        previousValue={previousData?.totalGiveOpportunity || 0}
                        icon="💡"
                        href={`${collegeName}/community`}
                    />

                    {/* Total Requested PYQs */}
                    <StatCard
                        title="Total Requested PYQs"
                        value={data?.totalRequestedPyqs || 0}
                        previousValue={previousData?.totalRequestedPyqs || 0}
                        icon="📝"
                        href={`${collegeName}/requested-pyq`}
                    />
                </div>
            </div>
        </main>
    );
};

export default CollegeDataPage;

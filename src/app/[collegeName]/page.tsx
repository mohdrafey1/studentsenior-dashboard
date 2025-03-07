'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCollegeData,
    selectCollegeData,
} from '@/redux/slices/collegeDataSlice';
import { AppDispatch } from '@/redux/store';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import StatCard from '@/components/College/StatCard';
import { capitalizeWords } from '@/utils/Capitalize';

const CollegeDataPage = () => {
    const { collegeName } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { data, previousData, loading, error } =
        useSelector(selectCollegeData);

    useEffect(() => {
        if (collegeName) {
            dispatch(fetchCollegeData(collegeName as string));
        }
    }, [collegeName, dispatch]);

    return (
        <main className="h-screen bg-indigo-50 dark:bg-gray-900">
            <div className="p-6 max-w-6xl mx-auto bg-indigo-50 dark:bg-gray-900 shadow-lg rounded-lg mt-16">
                <h1 className="text-3xl text-center font-bold mb-8 text-indigo-500 dark:text-indigo-400">
                    {capitalizeWords(collegeName as string)} Stats
                </h1>
                {data !== null ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total PYQs"
                            value={data?.totalNewPyqs || 0}
                            previousValue={previousData?.totalNewPyqs || 0}
                            icon="📩"
                            href={`${collegeName}/pyqs`}
                        />
                        <StatCard
                            title="Total Notes"
                            value={data?.totalNotes || 0}
                            previousValue={previousData?.totalNotes || 0}
                            icon="📚"
                            href={`${collegeName}/notes`}
                        />
                        <StatCard
                            title="Total Seniors"
                            value={data?.totalSeniors || 0}
                            previousValue={previousData?.totalSeniors || 0}
                            icon="🎓"
                            href={`${collegeName}/seniors`}
                        />
                        <StatCard
                            title="Total Products"
                            value={data?.totalProduct || 0}
                            previousValue={previousData?.totalProduct || 0}
                            icon="🛒"
                            href={`${collegeName}/products`}
                        />
                        <StatCard
                            title="Total Posts"
                            value={data?.totalPost || 0}
                            previousValue={previousData?.totalPost || 0}
                            icon="📢"
                            href={`${collegeName}/posts`}
                        />
                        <StatCard
                            title="Total Lost & Found"
                            value={data?.totalLostFound || 0}
                            previousValue={previousData?.totalLostFound || 0}
                            icon="🆘"
                            href={`${collegeName}/lost-found`}
                        />
                        <StatCard
                            title="Total Groups"
                            value={data?.totalGroups || 0}
                            previousValue={previousData?.totalGroups || 0}
                            icon="👥"
                            href={`${collegeName}/groups`}
                        />
                        <StatCard
                            title="Total Opportunities"
                            value={data?.totalGiveOpportunity || 0}
                            previousValue={
                                previousData?.totalGiveOpportunity || 0
                            }
                            icon="💡"
                            href={`${collegeName}/opportunities`}
                        />
                        <StatCard
                            title="Total Requested PYQs"
                            value={data?.totalRequestedPyqs || 0}
                            previousValue={
                                previousData?.totalRequestedPyqs || 0
                            }
                            icon="📝"
                            href={`${collegeName}/requested-pyq`}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-screen bg-indigo-50 dark:bg-gray-900">
                        {loading ? (
                            <Spinner size={2} />
                        ) : (
                            <div className="text-center p-4  rounded-lg shadow-3xl">
                                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default CollegeDataPage;

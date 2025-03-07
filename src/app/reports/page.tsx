'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchReportStats } from '@/redux/slices/reportStatsSlice';
import { Spinner } from '@/components/ui/Spinner';
import StatCard from '@/components/College/StatCard';

const ReportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentData, previousData, loading, error } = useSelector(
        (state: RootState) => state.reportStats
    );

    useEffect(() => {
        dispatch(fetchReportStats());
    }, [dispatch]);

    return (
        <main className="h-screen bg-indigo-50 dark:bg-gray-900">
            <div className="p-6 max-w-6xl mx-auto bg-indigo-50 dark:bg-gray-900 shadow-lg rounded-lg mt-16">
                <h1 className="text-3xl text-center font-bold mb-8 text-indigo-500 dark:text-indigo-400">
                    Report Stats
                </h1>

                {error && (
                    <div className="text-red-500 text-center">
                        Failed to load Stats: {error}
                    </div>
                )}

                {currentData !== null ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Total Add Points */}
                        <StatCard
                            title="Total Add Points"
                            value={currentData?.totalAddPointRequest || 0}
                            previousValue={
                                previousData?.totalAddPointRequest || 0
                            }
                            icon="➕"
                            href={`/add-points`}
                        />

                        {/* Total Redemption */}
                        <StatCard
                            title="Total Redemption"
                            value={currentData?.totalRedemptionRequest || 0}
                            previousValue={
                                previousData?.totalRedemptionRequest || 0
                            }
                            icon="🎁"
                            href={`/redemption-request`}
                        />

                        <StatCard
                            title="Total Transactions"
                            value={currentData?.totalTransactions || 0}
                            previousValue={previousData?.totalTransactions || 0}
                            icon="🛍️"
                            href={`/transactions`}
                        />

                        <StatCard
                            title="Total Users"
                            value={currentData?.totalClient || 0}
                            previousValue={previousData?.totalClient || 0}
                            icon="👤"
                            href={`/users`}
                        />

                        {/* Total Dashboard User */}
                        <StatCard
                            title="Total Dashboard Users"
                            value={currentData?.totalDashboardUser || 0}
                            previousValue={
                                previousData?.totalDashboardUser || 0
                            }
                            icon="📊"
                            href={`/dashboard-users`}
                        />

                        <StatCard
                            title="Total Contact Us"
                            value={currentData?.totalContactUs || 0}
                            previousValue={previousData?.totalContactUs || 0}
                            icon="📞"
                            href={`/contactus`}
                        />
                        <StatCard
                            title="Total Subjects"
                            value={currentData?.totalSubjects || 0}
                            previousValue={previousData?.totalSubjects || 0}
                            icon="📚"
                            href={`/subjects`}
                        />
                        <StatCard
                            title="Total Branches"
                            value={currentData?.totalBranch || 0}
                            previousValue={previousData?.totalBranch || 0}
                            icon="🏢"
                            href={`/branches`}
                        />

                        <StatCard
                            title="Total Courses"
                            value={currentData?.totalCourse || 0}
                            previousValue={previousData?.totalCourse || 0}
                            icon="🎓"
                            href={`/courses`}
                        />

                        <StatCard
                            title="Total Affiliate Products"
                            value={currentData?.totalAffiliateProduct || 0}
                            previousValue={
                                previousData?.totalAffiliateProduct || 0
                            }
                            icon="🛍️"
                            href={`/affiliate-products`}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-screen bg-indigo-50 dark:bg-gray-900">
                        {loading ? (
                            <Spinner size={2} />
                        ) : (
                            <div className="text-center p-4  rounded-lg shadow-3xl">
                                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                    No Stats Found
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ReportPage;

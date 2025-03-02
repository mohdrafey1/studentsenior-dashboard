'use client';

import { api } from '@/config/apiUrls';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/Spinner';
import StatCard from '@/components/College/StatCard';

interface Report {
    totalClient: number;
    totalContactUs: number;
    totalAddPointRequest: number;
    totalDashboardUser: number;
    totalBranch: number;
    totalCourse: number;
    totalSubjects: number;
    totalTransactions: number;
    totalRedemptionRequest: number;
    totalAffiliateProduct: number;
}

const ReportPage = () => {
    const [data, setData] = useState<Report | null>(null);
    const [previousData, setPreviousData] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${api.report.stats}`);
                if (!res.ok) throw new Error('Failed to fetch data');
                const jsonData: Report = await res.json();

                // Get previous data from localStorage
                const storedData = localStorage.getItem(`Report_Stats`);
                const previousData = storedData ? JSON.parse(storedData) : null;

                // Save current data to localStorage
                localStorage.setItem(`Report_Stats`, JSON.stringify(jsonData));

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

        fetchData();
    }, []);

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
                    Report Stats
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Total Subjects */}
                    <StatCard
                        title="Total Subjects"
                        value={data?.totalSubjects || 0}
                        previousValue={previousData?.totalSubjects || 0}
                        icon="📚"
                        href={`/subjects`}
                    />

                    {/* Total Branch */}
                    <StatCard
                        title="Total Branches"
                        value={data?.totalBranch || 0}
                        previousValue={previousData?.totalBranch || 0}
                        icon="🏢"
                        href={`/branches`}
                    />

                    {/* Total Course */}
                    <StatCard
                        title="Total Courses"
                        value={data?.totalCourse || 0}
                        previousValue={previousData?.totalCourse || 0}
                        icon="🎓"
                        href={`/courses`}
                    />

                    {/* Total Contacts */}
                    <StatCard
                        title="Total Contact Us"
                        value={data?.totalContactUs || 0}
                        previousValue={previousData?.totalContactUs || 0}
                        icon="📞"
                        href={`/contactus`}
                    />

                    {/* Total Add Points */}
                    <StatCard
                        title="Total Add Points"
                        value={data?.totalAddPointRequest || 0}
                        previousValue={previousData?.totalAddPointRequest || 0}
                        icon="➕"
                        href={`/add-points`}
                    />

                    {/* Total Redemption */}
                    <StatCard
                        title="Total Redemption"
                        value={data?.totalRedemptionRequest || 0}
                        previousValue={
                            previousData?.totalRedemptionRequest || 0
                        }
                        icon="🎁"
                        href={`/redemption-request`}
                    />

                    {/* Total Users */}
                    <StatCard
                        title="Total Users"
                        value={data?.totalClient || 0}
                        previousValue={previousData?.totalClient || 0}
                        icon="👤"
                        href={`/users`}
                    />

                    {/* Total Dashboard User */}
                    <StatCard
                        title="Total Dashboard Users"
                        value={data?.totalDashboardUser || 0}
                        previousValue={previousData?.totalDashboardUser || 0}
                        icon="📊"
                        href={`/dashboard-users`}
                    />

                    {/* Total Affiliate Products */}
                    <StatCard
                        title="Total Affiliate Products"
                        value={data?.totalAffiliateProduct || 0}
                        previousValue={previousData?.totalAffiliateProduct || 0}
                        icon="🛍️"
                        href={`/affiliate-products`}
                    />
                </div>
            </div>
        </main>
    );
};

export default ReportPage;

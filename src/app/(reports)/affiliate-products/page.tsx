'use client';

import { api } from '@/config/apiUrls';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/Spinner';
import Image from 'next/image';

interface AffiliateProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    link: string;
    createdAt: string;
}

const AffiliateProducts = () => {
    const [data, setData] = useState<AffiliateProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${api.store.affiliateProducts}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Something went wrong'
                    );
                }
                const jsonData: AffiliateProduct[] = await res.json();
                setData(jsonData);
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
            <div className="text-center text-red-500 min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                {error}
            </div>
        );

    return (
        <main className="min-h-screen bg-indigo-50 dark:bg-gray-900 p-6">
            <div className="bg-indigo-50 dark:bg-gray-800 shadow-lg rounded-lg p-6 overflow-x-auto">
                <h1 className="text-3xl mt-10 font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
                    Affiliate Products
                </h1>
                <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-indigo-100 dark:bg-gray-600">
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Link
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {data.length > 0 ? (
                            data.map((product) => (
                                <tr
                                    key={product._id}
                                    className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={50}
                                            height={50}
                                            className="rounded-md"
                                            priority
                                            unoptimized
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(
                                            product.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            View Product
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-4 text-gray-500 dark:text-gray-300"
                                >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default AffiliateProducts;

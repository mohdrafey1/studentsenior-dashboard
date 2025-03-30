'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/config/apiUrls';
import {
    FiDownload,
    FiExternalLink,
    FiUser,
    FiPackage,
    FiCreditCard,
    FiArrowLeft,
    FiDollarSign,
} from 'react-icons/fi';
import Link from 'next/link';

interface User {
    _id: string;
    username: string;
    email: string;
}

interface PurchaseItem {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    price: number;
    rewardPoints: number;
    createdAt: string;
}

interface PaymentDetail {
    _id: string;
    user: User;
    typeOfPurchase: string;
    purchaseItemId: PurchaseItem;
    merchantOrderId: string;
    amount: number;
    status: string;
    currency: string;
    provider: string;
    redirectBackUrl: string;
    createdAt: string;
    paymentResponse: {
        orderId: string;
        state: string;
        amount: number;
        paymentDetails: Array<{
            transactionId: string;
            paymentMode: string;
            amount: number;
            state: string;
            rail: {
                type: string;
                utr: string;
                upiTransactionId: string;
            };
        }>;
    };
}

export default function PaymentDetailPage() {
    const params = useParams();
    const paymentId = params?.paymentId;

    const [payment, setPayment] = useState<PaymentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${api.transactions.getPaymentById}/${paymentId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch payment details');
                }

                const data = await response.json();
                setPayment(data.data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'An unknown error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [paymentId]);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800'>
                <Spinner size={2} />
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800'>
                <p className='text-red-500 text-xl'>{error}</p>
            </div>
        );
    }

    if (!payment) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800'>
                <p className='text-gray-500 text-xl'>Payment not found</p>
            </div>
        );
    }

    const getStatusColor = () => {
        switch (payment.status) {
            case 'paid':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'failed':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            default:
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
        }
    };

    const getTypeColor = () => {
        switch (payment.typeOfPurchase) {
            case 'note_purchase':
                return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
            case 'pyq_purchase':
                return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
            case 'course_purchase':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
        }
    };

    // Check if payment failed to show NA for UTR
    const showUTR =
        payment.status !== 'failed' &&
        payment.paymentResponse?.paymentDetails?.[0]?.rail?.utr;

    return (
        <div className='mt-10 min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-5xl mx-auto'>
                {/* Header with back button */}
                <div className='flex justify-between items-center mb-8'>
                    <Link
                        href='/payments'
                        className='flex items-center text-indigo-600 dark:text-indigo-400 hover:underline'
                    >
                        <FiArrowLeft className='mr-2' />
                        Back to Payments
                    </Link>
                    <div className='text-right'>
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                            Payment Details
                        </h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>
                            {payment._id}
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700'>
                    {/* Status Banner */}
                    <div className={`px-6 py-4 ${getStatusColor()} border-b`}>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                                >
                                    {payment.status.toUpperCase()}
                                </span>
                            </div>
                            <div className='text-sm'>
                                <span className='text-gray-500 dark:text-gray-400 mr-2'>
                                    Date:
                                </span>
                                <span className='font-medium'>
                                    {new Date(
                                        payment.createdAt
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className='p-6'>
                        <div className='flex flex-col md:flex-row gap-8'>
                            {/* Left Column */}
                            <div className='flex-1'>
                                <div className='mb-8'>
                                    <h2 className='text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center'>
                                        <FiPackage className='mr-2' />
                                        {payment.purchaseItemId?.title || 'NA'}
                                    </h2>
                                    <p className='text-gray-600 dark:text-gray-300'>
                                        {payment.purchaseItemId?.description ||
                                            'NA'}
                                    </p>
                                </div>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
                                    <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                                        <div className='flex items-center text-gray-500 dark:text-gray-400 mb-2'>
                                            <FiDollarSign className='mr-2' />
                                            <span className='text-sm'>
                                                Amount
                                            </span>
                                        </div>
                                        <p className='text-2xl font-bold text-gray-800 dark:text-white'>
                                            {payment.currency} {payment.amount}
                                        </p>
                                    </div>

                                    <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                                        <div className='flex items-center text-gray-500 dark:text-gray-400 mb-2'>
                                            <FiCreditCard className='mr-2' />
                                            <span className='text-sm'>
                                                Payment Method
                                            </span>
                                        </div>
                                        <p className='text-xl font-semibold text-gray-800 dark:text-white'>
                                            {payment.provider} (
                                            {payment.paymentResponse
                                                ?.paymentDetails?.[0]
                                                ?.paymentMode
                                                ? payment.paymentResponse.paymentDetails[0].paymentMode.replace(
                                                      '_',
                                                      ' '
                                                  )
                                                : 'NA'}
                                            )
                                        </p>
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <h3 className='text-lg font-medium text-gray-800 dark:text-white flex items-center'>
                                        <FiUser className='mr-2' />
                                        Customer Information
                                    </h3>
                                    <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                                        <div className='grid  gap-4'>
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                    Name
                                                </p>
                                                <p className='font-medium'>
                                                    {payment.user.username}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                    Email
                                                </p>
                                                <p className='font-medium'>
                                                    {payment.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className='flex-1'>
                                <div className='bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                                    <h3 className='text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center'>
                                        <FiCreditCard className='mr-2' />
                                        Transaction Details
                                    </h3>

                                    <div className='space-y-4'>
                                        <div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                Order Type
                                            </p>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getTypeColor()}`}
                                            >
                                                {payment.typeOfPurchase.replace(
                                                    '_',
                                                    ' '
                                                )}
                                            </span>
                                        </div>

                                        <div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                Merchant Order ID
                                            </p>
                                            <p className='font-medium'>
                                                {payment.merchantOrderId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                Payment Gateway ID
                                            </p>
                                            <p className='font-medium'>
                                                {
                                                    payment.paymentResponse
                                                        .orderId
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                Transaction ID
                                            </p>
                                            <p className='font-medium'>
                                                {payment.paymentResponse
                                                    ?.paymentDetails?.[0]
                                                    ?.transactionId || 'NA'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                UPI Reference
                                            </p>
                                            <p className='font-medium'>
                                                {payment.paymentResponse
                                                    ?.paymentDetails?.[0]?.rail
                                                    ?.upiTransactionId || 'NA'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                UTR Number
                                            </p>
                                            <p className='font-medium'>
                                                {showUTR
                                                    ? payment.paymentResponse
                                                          ?.paymentDetails?.[0]
                                                          ?.rail?.utr || 'NA'
                                                    : 'NA'}
                                            </p>
                                        </div>

                                        {payment.status === 'paid' && (
                                            <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                                                    Product File
                                                </p>
                                                <a
                                                    href={
                                                        payment.purchaseItemId
                                                            .fileUrl
                                                    }
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                                                >
                                                    <FiDownload className='mr-2' />
                                                    Download File
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-col sm:flex-row justify-between items-center'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                {payment.status === 'paid'
                                    ? 'Thank you !'
                                    : payment.status === 'failed'
                                    ? 'Payment failed.'
                                    : ' payment is being processed.'}
                            </p>
                            <a
                                href={payment.redirectBackUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline'
                            >
                                <FiExternalLink className='mr-1' />
                                View Product Page
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

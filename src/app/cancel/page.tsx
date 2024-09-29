"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';

const CancelPage = () => {
    const router = useRouter();

    const handleRetry = () => {
        router.push('/explore');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Navbar className="fixed w-full z-50" />
            <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Canceled</h1>
            <p className="text-lg text-gray-700 mb-8">
                Your payment was canceled. You can try again if you wish to complete the booking.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleRetry}>
                Try Again
            </Button>
        </div>
    );
};

export default CancelPage;

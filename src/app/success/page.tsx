"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';

const SuccessPage = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Navbar className="fixed w-full z-50" />
            <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-700 mb-8">
                Thank you for your purchase. Your payment has been processed successfully.
            </p>
            <Button className="bg-[#24AE7C] hover:bg-[#329c75] text-white" onClick={handleGoBack}>
                Go to Home
            </Button>
        </div>
    );
};

export default SuccessPage;
'use client'

import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function ThankYou() {
    const router = useRouter();

    useEffect(() => {
        // Here, you could also trigger sending the email confirmation with the ticket
        // by calling a backend API to send the email.
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You for Your Purchase!</h1>
                <p className="text-lg text-gray-700 mb-6">Your ticket will be sent to your email shortly.</p>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
                    onClick={() => router.push('/')}
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

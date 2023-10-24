"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-extrabold text-gray-800">Error</h1>
            <p className="text-lg text-gray-600">
                Something went wrong. Please try again later.
            </p>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}

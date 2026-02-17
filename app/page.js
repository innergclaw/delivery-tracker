"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/tracker/${orderNumber.trim()}`);
    } else {
      setError("Please enter a valid order number");
    }
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-md text-center space-y-8 p-6">
          <h1 className="text-2xl font-bold tracking-tight text-dark">Order Tracker</h1>
          <p className="text-gray-500 text-sm">What's Your Order #?</p>

          <form onSubmit={handleTrack} className="space-y-4">
            <input 
              type="text" 
              placeholder="e.g. 12345"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-lg text-center focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              value={orderNumber}
              onChange={(e) => { setOrderNumber(e.target.value); setError(""); }}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              Track Order
            </button>
          </form>
          <p className="text-sm text-gray-400">Enter ID provided in your confirmation email</p>
        </div>
      </body>
    </html>
  );
}

"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-base font-medium text-gray-800">OsudhGhor</h3>
            <p className="text-sm text-gray-600">
              Your trusted medicine partner
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="/orders" className="text-sm text-gray-600 hover:text-blue-600">Orders</Link>
            <Link href="/analytics" className="text-sm text-gray-600 hover:text-blue-600">Analytics</Link>
            <Link href="/help" className="text-sm text-gray-600 hover:text-blue-600">Help</Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">Terms</Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">Privacy</Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} OsudhGhor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
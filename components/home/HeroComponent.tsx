"use client";

import { useState } from 'react';
import Link from 'next/link';
import MedicineSearch from './MedicineSearch';
import { Id } from "../../convex/_generated/dataModel";

interface MedicineData {
  id: Id<"medicine_data">;
  name: string;
  category: string;
  manufacturer: string;
  mrp: number;
}

export default function Hero() {
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineData | null>(null);
  
  const handleMedicineSelect = (medicine: MedicineData) => {
    setSelectedMedicine(medicine);
  };
  
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center pt-16">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/medications-1628372_1920.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/70"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Your Health, <span className="text-blue-300">Our Priority</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
            Search our extensive database of medicines, check prices, and place orders quickly
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-md">
            <h2 className="text-white text-lg mb-3">Find Your Medicine</h2>
            <div className="relative z-30">
              <MedicineSearch onSelect={handleMedicineSelect} />
              <style jsx global>{`
                .medicine-search input {
                  border-radius: 9999px !important;
                  padding-left: 2.5rem !important;
                  background-color: rgba(255, 255, 255, 0.9) !important;
                  width: 100% !important;
                  height: 2.75rem !important;
                }
                
                .medicine-search .search-icon {
                  position: absolute;
                  left: 0.75rem;
                  top: 50%;
                  transform: translateY(-50%);
                  pointer-events: none;
                  z-index: 40;
                  color: #6b7280;
                }
                
                .medicine-search .results-container {
                  position: absolute;
                  width: 100%;
                  border-radius: 0.75rem;
                  margin-top: 0.5rem;
                  overflow: hidden;
                  background-color: white;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                  z-index: 50;
                  max-height: 300px;
                  overflow-y: auto;
                }
              `}</style>
            </div>
          </div>
        </div>
        
        {/* Add spacing to prevent overlap with search results */}
        <div className="h-16"></div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/orders/quick"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center flex items-center justify-center"
          >
            <span className="mr-2">Quick Order</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/analytics"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center flex items-center justify-center"
          >
            <span className="mr-2">Analytics</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Link>
          <Link
            href="/orders/history"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center flex items-center justify-center"
          >
            <span className="mr-2">Past Orders</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
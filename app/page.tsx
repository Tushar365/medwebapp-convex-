"use client";

import { Id } from "../convex/_generated/dataModel";

// Define the proper type for medicine data from the API
interface MedicineData {
  id: Id<"medicine_data">;
  name: string;
  category: string;
  manufacturer: string;
  mrp: number;
}

export default function Home() {
  // ... existing state and hooks ...

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-6xl font-bold mb-8 text-blue-600">HELLO WORLD</h1>
      
      <div className="w-full max-w-md">
        {/* Search input and results */}
        {/* ... rest of your component ... */}
      </div>
    </div>
  );
}
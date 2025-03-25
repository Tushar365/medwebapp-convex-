"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function MedicineDetailInner({
  params
}: {
  params: { id: string }
}) {
  const routerParams = useParams();
  const id = params?.id || routerParams?.id as string;
  
  // Call useQuery unconditionally, but pass null/undefined when id is missing
  const medicineId = id ? (id as Id<"medicine_data">) : undefined;
  const medicine = useQuery(api.medicine.getMedicineById, 
    medicineId ? { id: medicineId } : { id: "" as Id<"medicine_data"> });
  
  // Now handle the missing ID case
  if (!id) {
    return <div className="text-center text-red-500">Missing medicine ID</div>;
  }
  
  if (!medicine) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-gray-600">Loading medicine details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="text-center mt-4">
            <div className="relative h-64 md:h-80 w-full mb-4 bg-gray-100 rounded overflow-hidden">
              <Image 
                src="/medicine-pictures-2000-x-1500-yeqgtg000nqs48im.webp"
                alt={medicine.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-contain"
              />
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm ${
              medicine.stock_quantity > 0 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {medicine.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
            </div>
          </div>
          
          {/* Medicine Details */}
          <div className="text-black">
            <h1 className="text-2xl font-bold mb-2 text-black">{medicine.name}</h1>
            <p className="text-gray-800 mb-4">{medicine.manufacturer}</p>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="flex justify-between mb-2 text-black">
                <span className="font-medium">MRP:</span>
                <span>₹{medicine.mrp.toFixed(2)}</span>
              </div>
              
              {medicine.discount > 0 && (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-black">Discount:</span>
                    <span className="text-green-700">
                      {(medicine.discount * 100).toFixed(0)}% OFF
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-black">Final Price:</span>
                    <span className="text-green-700">
                      ₹{(medicine.mrp * (1 - medicine.discount)).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-800 font-medium">Composition</span>
                <span className="text-black">{medicine.composition}</span>
              </div>
              
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-800 font-medium">Prescription Required</span>
                <span className="text-black">{medicine.prescription_required === 'True' ? 'Yes' : 'No'}</span>
              </div>
              
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-800 font-medium">Expiry Date</span>
                <span className="text-black">{medicine.expiry_date}</span>
              </div>
              
              {medicine.generic_alternative && (
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-800 font-medium">Generic Alternative</span>
                  <span className="text-black">{medicine.generic_alternative}</span>
                </div>
              )}
            </div>
            
            <button 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={medicine.stock_quantity <= 0}
            >
              {medicine.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
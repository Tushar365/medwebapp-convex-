// app/medicine/[id]/page.tsx
"use client";

import MedicineDetailInner from './inner';
import Header from '@/components/HeaderComponent';
import Footer from '@/components/FooterComponent';
import BrandPromise from '@/components/medicine_page';
import { Suspense} from 'react';
import { useParams } from 'next/navigation';

export default function MedicineDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow w-full py-8">
        <Suspense fallback={<div className="text-center py-8">Loading medicine details...</div>}>
          <MedicineDetailInner params={{ id }} />
        </Suspense>
      </main>
      <BrandPromise />
      <Footer />
    </div>
  );
}
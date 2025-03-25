// app/medicine/[id]/layout.tsx
import { ReactNode } from 'react';

export default function MedicineDetailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="medicine-detail-layout">
      {children}
    </div>
  );
}
// app/api/submit-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    // Create a customer record
    const customerId = await convex.mutation(api.customers.create, {
      name: orderData.personalInfo.name,
      age: orderData.personalInfo.age,
      gender: orderData.personalInfo.gender,
      phone: orderData.personalInfo.phone,
      location: orderData.personalInfo.location,
      address: orderData.personalInfo.address,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Handle prescription if provided
    let prescriptionId = undefined;
    if (orderData.prescription) {
      prescriptionId = await convex.mutation(api.prescriptions.create, {
        filename: orderData.prescription.name,
        fileUrl: orderData.prescription.url || '',
        fileType: orderData.prescription.type,
        fileSize: orderData.prescription.size,
        uploadedAt: Date.now(),
      });
    }
    
    // Create the order
    const orderId = await convex.mutation(api.orders.createOrder, {
      customerId,
      prescriptionId,
      subtotal: orderData.pricing.subtotal,
      discountRate: orderData.pricing.discountRate || 0,
      discountAmount: orderData.pricing.discount || 0,
      gstRate: 0.12, // Default GST rate
      gstAmount: orderData.pricing.gst,
      totalAmount: orderData.pricing.total,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: orderData.paymentMethod || 'COD',
      notes: orderData.notes || '',
    });
    
    // Add order items
    for (const item of orderData.items) {
      await convex.mutation(api.orderItems.addOrderItem, {
        orderId,
        medicineId: item.id,
        medicineName: item.name,
        price: item.price,
        quantity: item.quantity,
        prescriptionRequired: item.prescription_required === 'Yes',
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      orderId,
      message: 'Order placed successfully!' 
    });
    
  } catch (error: any) {
    console.error('Error submitting order:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to place order' 
    }, { status: 500 });
  }
}
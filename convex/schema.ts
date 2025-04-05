import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  medicine_data: defineTable({
    case_pack: v.float64(),
    category: v.string(),
    composition: v.string(),
    discount: v.float64(),
    expiry_date: v.string(),
    generic_alternative: v.string(),
    gst: v.float64(),
    image_url: v.string(),
    manufacturer: v.string(),
    mrp: v.float64(),
    name: v.string(),
    packing: v.union(v.float64(), v.string()),
    pr_code: v.union(v.float64(), v.string()),
    prescription_required: v.string(),
    stock_quantity: v.float64(),
    cost_price: v.optional(v.float64()), // Added cost_price field
  })
  .searchIndex("search_medicines", {
    searchField: "name",
    filterFields: ["category", "manufacturer"]
  }),
  
  // Customers table
  customers: defineTable({
    name: v.string(),
    age: v.string(),
    gender: v.string(),
    phone: v.string(),
    location: v.string(),
    address: v.string(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }),

  // Prescriptions table
  prescriptions: defineTable({
    filename: v.string(),
    fileUrl: v.string(),
    fileType: v.string(),
    fileSize: v.float64(),
    uploadedAt: v.float64(),
  }),

  // Orders table
  orders: defineTable({
    customerId: v.id("customers"),
    prescriptionId: v.optional(v.id("prescriptions")),
    subtotal: v.float64(),
    discountRate: v.float64(),
    discountAmount: v.float64(),
    
    // Category-based breakdowns
    genericTotal: v.float64(),
    brandedTotal: v.float64(), 
    otcTotal: v.float64(),
    ayurvedicTotal: v.float64(),
    surgicalTotal: v.float64(),
    
    // Margin information
    preGstTotal: v.float64(),
    marginAmount: v.float64(),
    marginPercentage: v.float64(),
    
    gstRate: v.float64(),
    gstAmount: v.float64(),
    totalAmount: v.float64(),
    orderStatus: v.string(),
    paymentStatus: v.string(),
    paymentMethod: v.optional(v.string()),
    orderDate: v.float64(),
    updatedAt: v.float64(),
    notes: v.optional(v.string()),
  }).index("by_customer", ["customerId"]),

  // Order items table
  orderItems: defineTable({
    orderId: v.id("orders"),
    medicineId: v.string(), // This should match the _id from medicine_data
    medicineName: v.string(),
    price: v.float64(),
    quantity: v.float64(),
    prescriptionRequired: v.boolean(),
    totalPrice: v.float64(),
  }).index("by_order", ["orderId"]),

  // Order drafts table
  orderDrafts: defineTable({
    customerId: v.optional(v.id("customers")),
    draftData: v.any(), // JSON data for the draft
    savedAt: v.float64(),
    updatedAt: v.float64(),
  }),
  
  numbers: defineTable({
    value: v.any(), // Keep your existing numbers table
  }),
});
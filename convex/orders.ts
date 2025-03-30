// convex/orders.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper function to calculate category totals and margins
async function calculateCategoryTotals(
  ctx: any, 
  orderId: Id<"orders">
) {
  // Get all order items for this order
  const orderItems = await ctx.db
    .query("orderItems")
    .withIndex("by_order", (q: any) => q.eq("orderId", orderId))
    .collect();
  
  // Initialize category totals
  let genericTotal = 0;
  let brandedTotal = 0;
  let otcTotal = 0;
  let ayurvedicTotal = 0;
  let surgicalTotal = 0;
  let marginAmount = 0;
  
  // Calculate category totals and margins
  for (const item of orderItems) {
    // Get the medicine details
    const medicine = await ctx.db.get(item.medicineId as Id<"medicine_data">);
    
    if (!medicine) continue;
    
    // Add to the appropriate category total
    switch (medicine.category.toLowerCase()) {
      case "generic":
        genericTotal += item.totalPrice;
        break;
      case "branded":
        brandedTotal += item.totalPrice;
        break;
      case "otc":
        otcTotal += item.totalPrice;
        break;
      case "ayurvedic":
        ayurvedicTotal += item.totalPrice;
        break;
      case "surgical":
        surgicalTotal += item.totalPrice;
        break;
    }
    
    // Calculate margin (if cost_price exists)
    if (medicine.cost_price !== undefined) {
      marginAmount += item.totalPrice - (medicine.cost_price * item.quantity);
    }
  }
  
  // Get the order
  const order = await ctx.db.get(orderId);
  
  if (!order) return;
  
  // Calculate pre GST total
  const preGstTotal = order.subtotal - order.discountAmount;
  
  // Calculate margin percentage
  const marginPercentage = preGstTotal > 0 
    ? (marginAmount / preGstTotal) * 100 
    : 0;
  
  // Update the order with new totals
  await ctx.db.patch(orderId, {
    genericTotal,
    brandedTotal,
    otcTotal,
    ayurvedicTotal,
    surgicalTotal,
    preGstTotal,
    marginAmount,
    marginPercentage,
    updatedAt: Date.now(),
  });
}

// Create a new order
export const createOrder = mutation({
  args: {
    customerId: v.id("customers"),
    prescriptionId: v.optional(v.id("prescriptions")),
    subtotal: v.number(),
    discountRate: v.number(),
    discountAmount: v.number(),
    gstRate: v.number(),
    gstAmount: v.number(),
    totalAmount: v.number(),
    orderStatus: v.string(),
    paymentStatus: v.string(),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create the order with initial zero values for category totals
    const orderId = await ctx.db.insert("orders", {
      ...args,
      genericTotal: 0,
      brandedTotal: 0,
      otcTotal: 0,
      ayurvedicTotal: 0,
      surgicalTotal: 0,
      preGstTotal: args.subtotal - args.discountAmount,
      marginAmount: 0,
      marginPercentage: 0,
      orderDate: Date.now(),
      updatedAt: Date.now(),
    });
    
    return orderId;
  },
});

// Add item to order
export const addOrderItem = mutation({
  args: {
    orderId: v.id("orders"),
    medicineId: v.string(),
    medicineName: v.string(),
    price: v.number(),
    quantity: v.number(),
    prescriptionRequired: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Calculate total price for this item
    const totalPrice = args.price * args.quantity;
    
    // Insert the order item
    const orderItemId = await ctx.db.insert("orderItems", {
      orderId: args.orderId,
      medicineId: args.medicineId,
      medicineName: args.medicineName,
      price: args.price,
      quantity: args.quantity,
      prescriptionRequired: args.prescriptionRequired,
      totalPrice,
    });
    
    // Update the category totals and margins
    await calculateCategoryTotals(ctx, args.orderId);
    
    return orderItemId;
  },
});

// Update order item quantity
export const updateOrderItemQuantity = mutation({
  args: {
    orderItemId: v.id("orderItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the order item
    const orderItem = await ctx.db.get(args.orderItemId);
    
    if (!orderItem) {
      throw new Error("Order item not found");
    }
    
    // Calculate new total price
    const totalPrice = orderItem.price * args.quantity;
    
    // Update the order item
    await ctx.db.patch(args.orderItemId, {
      quantity: args.quantity,
      totalPrice,
    });
    
    // Update the category totals and margins
    await calculateCategoryTotals(ctx, orderItem.orderId);
    
    return { success: true };
  },
});

// Remove order item
export const removeOrderItem = mutation({
  args: {
    orderItemId: v.id("orderItems"),
  },
  handler: async (ctx, args) => {
    // Get the order item to find its orderId
    const orderItem = await ctx.db.get(args.orderItemId);
    
    if (!orderItem) {
      throw new Error("Order item not found");
    }
    
    const orderId = orderItem.orderId;
    
    // Delete the order item
    await ctx.db.delete(args.orderItemId);
    
    // Update the category totals and margins
    await calculateCategoryTotals(ctx, orderId);
    
    return { success: true };
  },
});

// Get order with category breakdown
export const getOrderWithBreakdown = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    // Get the order
    const order = await ctx.db.get(args.orderId);
    
    if (!order) {
      return null;
    }
    
    // Get all items for this order
    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_order", q => q.eq("orderId", args.orderId))
      .collect();
    
    return {
      ...order,
      items: orderItems,
    };
  },
});

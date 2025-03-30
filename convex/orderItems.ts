// convex/orderItems.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add an item to an order
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
    
    return orderItemId;
  },
});

// Get items for a specific order
export const getByOrderId = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orderItems")
      .withIndex("by_order", q => q.eq("orderId", args.orderId))
      .collect();
  },
});

// Update item quantity
export const updateQuantity = mutation({
  args: {
    orderItemId: v.id("orderItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
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
    
    return { success: true };
  },
});

// Remove an item from an order
export const removeItem = mutation({
  args: {
    orderItemId: v.id("orderItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.orderItemId);
    return { success: true };
  },
});
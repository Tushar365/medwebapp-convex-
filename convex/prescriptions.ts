// convex/prescriptions.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new prescription record
export const create = mutation({
  args: {
    filename: v.string(),
    fileUrl: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const prescriptionId = await ctx.db.insert("prescriptions", {
      filename: args.filename,
      fileUrl: args.fileUrl,
      fileType: args.fileType,
      fileSize: args.fileSize,
      uploadedAt: args.uploadedAt,
    });
    
    return prescriptionId;
  },
});

// Get a prescription by ID
export const getById = query({
  args: {
    prescriptionId: v.id("prescriptions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.prescriptionId);
  },
});

// List prescriptions for a specific order
export const listByOrder = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    // Get the order
    const order = await ctx.db.get(args.orderId);
    
    if (!order || !order.prescriptionId) {
      return null;
    }
    
    // Get the prescription
    return await ctx.db.get(order.prescriptionId);
  },
});

// Delete a prescription
export const remove = mutation({
  args: {
    prescriptionId: v.id("prescriptions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.prescriptionId);
    return { success: true };
  },
});
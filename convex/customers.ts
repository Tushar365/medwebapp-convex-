// convex/customers.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create a new customer
export const create = mutation({
  args: {
    name: v.string(),
    age: v.string(),
    gender: v.string(),
    phone: v.string(),
    location: v.string(),
    address: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const customerId = await ctx.db.insert("customers", {
      name: args.name,
      age: args.age,
      gender: args.gender,
      phone: args.phone,
      location: args.location,
      address: args.address,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
    
    return customerId;
  },
});

// Get a customer by ID
export const getById = query({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.customerId);
  },
});

// Search customers by phone number
export const searchByPhone = query({
  args: {
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const customers = await ctx.db
      .query("customers")
      .filter((q) => q.eq(q.field("phone"), args.phone))
      .collect();
    
    return customers;
  },
});

// Update customer information
export const update = mutation({
  args: {
    customerId: v.id("customers"),
    name: v.optional(v.string()),
    age: v.optional(v.string()),
    gender: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { customerId, ...updates } = args;
    
    // Add updatedAt timestamp
    const updatedFields = {
      ...updates,
      updatedAt: Date.now(),
    };
    
    await ctx.db.patch(customerId, updatedFields);
    
    return { success: true };
  },
});

// List all customers
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("customers").order("desc").collect();
  },
});
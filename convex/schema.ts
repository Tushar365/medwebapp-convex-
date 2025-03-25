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
  })
  .searchIndex("search_medicines", {
    searchField: "name",
    filterFields: ["category", "manufacturer"]
  }),
  numbers: defineTable({
    value: v.any(), // Replace with specific type based on your needs
  }),
});
// convex/medicine.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchMedicines = query({
  args: {
    searchQuery: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      id: v.id("medicine_data"),
      name: v.string(),
      category: v.string(),
      manufacturer: v.string(),
      mrp: v.number()
    })
  ),
  handler: async (ctx, args) => {
    // If search query is empty, return empty array
    if (!args.searchQuery.trim()) {
      return [];
    }

    const limit = args.limit ?? 10;

    // Use Convex's search index to get medicine matches
    const medicines = await ctx.db
      .query("medicine_data")
      .withSearchIndex("search_medicines", (q) => 
        q.search("name", args.searchQuery)
      )
      .take(limit);

    // Map results to the expected format with fields that exist in your schema
    return medicines.map((medicine) => ({
      id: medicine._id,
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      mrp: medicine.mrp
    }));
  },
});
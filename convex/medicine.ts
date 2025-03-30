// convex/medicine.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchMedicines = query({
  args: {
    searchQuery: v.string(),
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      id: v.id("medicine_data"),
      name: v.string(),
      category: v.string(),
      manufacturer: v.string(),
      mrp: v.number(),
      discount: v.number(),
      stock_quantity: v.number(),
      prescription_required: v.string()
    })
  ),
  handler: async (ctx, args) => {
    // Early return for empty queries to avoid unnecessary processing
    const trimmedQuery = args.searchQuery.trim();
    if (!trimmedQuery) {
      return [];
    }

    const limit = args.limit ?? 10;

    // Use Convex's search index with category filter if provided
    let medicinesQuery = ctx.db
      .query("medicine_data")
      .withSearchIndex("search_medicines", (q) => {
        let query = q.search("name", trimmedQuery);
        if (args.category) {
          query = query.eq("category", args.category);
        }
        return query;
      });

    const medicines = await medicinesQuery.take(limit);

    // Map to include fields needed for both search display and ordering
    return medicines.map((medicine) => ({
      id: medicine._id,
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      mrp: medicine.mrp,
      discount: medicine.discount,
      stock_quantity: medicine.stock_quantity,
      prescription_required: medicine.prescription_required
    }));
  },
});

// Get detailed medicine information for product page
export const getMedicineById = query({
  args: { id: v.id("medicine_data") },
  returns: v.object({
    id: v.id("medicine_data"),
    name: v.string(),
    category: v.string(),
    manufacturer: v.string(),
    mrp: v.number(),
    discount: v.number(),
    composition: v.string(),
    stock_quantity: v.number(),
    prescription_required: v.string(),
    image_url: v.string(),
    generic_alternative: v.string(),
    expiry_date: v.string()
  }),
  handler: async (ctx, args) => {
    const medicine = await ctx.db.get(args.id);
    if (!medicine) {
      throw new Error("Medicine not found");
    }
    
    return {
      id: medicine._id,
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      mrp: medicine.mrp,
      discount: medicine.discount,
      composition: medicine.composition,
      stock_quantity: medicine.stock_quantity,
      prescription_required: medicine.prescription_required,
      image_url: medicine.image_url,
      generic_alternative: medicine.generic_alternative,
      expiry_date: medicine.expiry_date
    };
  },
});

// Get multiple medicines by IDs for cart/order processing
export const getMedicinesByIds = query({
  args: { 
    ids: v.array(v.id("medicine_data")) 
  },
  returns: v.array(
    v.object({
      id: v.id("medicine_data"),
      name: v.string(),
      manufacturer: v.string(),
      mrp: v.number(),
      discount: v.number(),
      stock_quantity: v.number(),
      prescription_required: v.string()
    })
  ),
  handler: async (ctx, args) => {
    // Early return for empty array
    if (args.ids.length === 0) return [];
    
    // Fetch multiple medicines in a single query for better performance
    const medicines = await Promise.all(
      args.ids.map(id => ctx.db.get(id))
    );
    
    // Filter out any null results and map to the format needed for ordering
    return medicines
      .filter(medicine => medicine !== null)
      .map(medicine => ({
        id: medicine!._id,
        name: medicine!.name,
        manufacturer: medicine!.manufacturer,
        mrp: medicine!.mrp,
        discount: medicine!.discount,
        stock_quantity: medicine!.stock_quantity,
        prescription_required: medicine!.prescription_required
      }));
  },
});

// Check stock availability for medicines in cart
export const checkStockAvailability = query({
  args: {
    items: v.array(v.object({
      id: v.id("medicine_data"),
      quantity: v.number()
    }))
  },
  returns: v.object({
    allAvailable: v.boolean(),
    items: v.array(v.object({
      id: v.id("medicine_data"),
      name: v.string(),
      available: v.boolean(),
      requested: v.number(),
      inStock: v.number()
    }))
  }),
  handler: async (ctx, args) => {
    const stockResults = await Promise.all(
      args.items.map(async (item) => {
        const medicine = await ctx.db.get(item.id);
        if (!medicine) {
          return { 
            id: item.id, 
            name: "Unknown Medicine", 
            available: false, 
            requested: item.quantity, 
            inStock: 0 
          };
        }
        
        return {
          id: item.id,
          name: medicine.name,
          available: medicine.stock_quantity >= item.quantity,
          requested: item.quantity,
          inStock: medicine.stock_quantity
        };
      })
    );
    
    return {
      allAvailable: stockResults.every(item => item.available),
      items: stockResults
    };
  }
});

// Get popular/featured medicines for suggestions
export const getSuggestedMedicines = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string())
  },
  returns: v.array(
    v.object({
      id: v.id("medicine_data"),
      name: v.string(),
      category: v.string(),
      manufacturer: v.string(),
      mrp: v.number(),
      discount: v.number(),
      image_url: v.string()
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 8;
    
    let query = ctx.db.query("medicine_data");
    
    // Filter by category if provided
    if (args.category) {
      // Fix: Use filter instead of withIndex for category filtering
      query = query.filter(q => q.eq(q.field("category"), args.category));
    }
    
    // Get medicines with highest discount first (best deals)
    const medicines = await query
      // Use a different approach for ordering by discount
      .filter(q => q.gte(q.field("discount"), 0)) // Include all medicines with discount >= 0
      .collect() // Collect all results
      .then(results => 
        // Sort in memory by discount in descending order
        results.sort((a, b) => b.discount - a.discount).slice(0, limit)
      );
    
    return medicines.map(medicine => ({
      id: medicine._id,
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      mrp: medicine.mrp,
      discount: medicine.discount,
      image_url: medicine.image_url
    }));
  }
});
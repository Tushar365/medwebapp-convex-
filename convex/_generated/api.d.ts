/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as customers from "../customers.js";
import type * as http from "../http.js";
import type * as medicine from "../medicine.js";
import type * as myFunctions from "../myFunctions.js";
import type * as orderItems from "../orderItems.js";
import type * as orders from "../orders.js";
import type * as prescriptions from "../prescriptions.js";
import type * as ResendOTP from "../ResendOTP.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  customers: typeof customers;
  http: typeof http;
  medicine: typeof medicine;
  myFunctions: typeof myFunctions;
  orderItems: typeof orderItems;
  orders: typeof orders;
  prescriptions: typeof prescriptions;
  ResendOTP: typeof ResendOTP;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

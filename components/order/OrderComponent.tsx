// "use client";

// import { useState, useEffect } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../convex/_generated/api";
// import { Id } from "../convex/_generated/dataModel";
// import MedicineSearch from "./MedicineSearch";

// interface MedicineData {
//   id: Id<"medicine_data">;
//   name: string;
//   category: string;
//   manufacturer: string;
//   mrp: number;
//   packSize?: string;
// }

// interface OrderItem {
//   medicine: MedicineData;
//   quantity: number;
// }

// export default function OrderComponent() {
//   const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [customerAddress, setCustomerAddress] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // This would be your actual mutation in a real app
//   // const createOrder = useMutation(api.orders.createOrder);

//   const handleMedicineSelect = (medicine: MedicineData) => {
//     // Check if medicine already exists in order
//     const existingItemIndex = orderItems.findIndex(
//       item => item.medicine.id === medicine.id
//     );

//     if (existingItemIndex >= 0) {
//       // Update quantity if medicine already in order
//       const updatedItems = [...orderItems];
//       updatedItems[existingItemIndex].quantity += 1;
//       setOrderItems(updatedItems);
//     } else {
//       // Add new medicine to order
//       setOrderItems([...orderItems, { medicine, quantity: 1 }]);
//     }
//   };

//   const updateQuantity = (index: number, newQuantity: number) => {
//     if (newQuantity < 1) return;
    
//     const updatedItems = [...orderItems];
//     updatedItems[index].quantity = newQuantity;
//     setOrderItems(updatedItems);
//   };

//   const removeItem = (index: number) => {
//     setOrderItems(orderItems.filter((_, i) => i !== index));
//   };

//   const calculateTotal = () => {
//     return orderItems.reduce(
//       (total, item) => total + item.medicine.mrp * item.quantity,
//       0
//     );
//   };

//   const handleSubmitOrder = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (orderItems.length === 0) {
//       setErrorMessage("Your order is empty. Please add some medicines.");
//       return;
//     }
    
//     if (!customerName || !customerPhone) {
//       setErrorMessage("Please provide your name and phone number.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     setErrorMessage("");
    
//     try {
//       // Format order data
//       const orderData = {
//         customer: {
//           name: customerName,
//           phone: customerPhone,
//           address: customerAddress,
//         },
//         items: orderItems.map(item => ({
//           medicineId: item.medicine.id,
//           quantity: item.quantity,
//           price: item.medicine.mrp,
//         })),
//         paymentMethod,
//         total: calculateTotal(),
//       };
      
//       // In a real app, you would call your mutation here
//       // await createOrder(orderData);
      
//       // For demo purposes, simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setSuccessMessage("Order placed successfully!");
//       // Reset form
//       setOrderItems([]);
//       setCustomerName("");
//       setCustomerPhone("");
//       setCustomerAddress("");
//       setPaymentMethod("cash");
      
//       // Clear success message after 5 seconds
//       setTimeout(() => setSuccessMessage(""), 5000);
//     } catch (error) {
//       setErrorMessage("Failed to place order. Please try again.");
//       console.error("Order submission error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Format price to currency
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 2
//     }).format(price);
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create New Order</h2>
      
//       {successMessage && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {successMessage}
//         </div>
//       )}
      
//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {errorMessage}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmitOrder}>
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Add Medicines</h3>
//           <MedicineSearch onSelect={handleMedicineSelect} />
          
//           {orderItems.length > 0 && (
//             <div className="mt-4">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                   <thead className="bg-gray-50 dark:bg-gray-700">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Medicine</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
//                       <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                     {orderItems.map((item, index) => (
//                       <tr key={item.medicine.id}>
//                         <td className="px-4 py-3">
//                           <div>
//                             <div className="font-medium text-gray-900 dark:text-white">{item.medicine.name}</div>
//                             <div className="text-sm text-gray-500 dark:text-gray-400">{item.medicine.manufacturer}</div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
//                           {formatPrice(item.medicine.mrp)}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex items-center w-24">
//                             <button
//                               type="button"
//                               className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                               onClick={() => updateQuantity(index, item.quantity - 1)}
//                             >
//                               -
//                             </button>
//                             <input
//                               type="number"
//                               className="mx-2 w-12 text-center border-0 dark:bg-gray-800 focus:ring-0"
//                               value={item.quantity}
//                               onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
//                               min="1"
//                             />
//                             <button
//                               type="button"
//                               className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                               onClick={() => updateQuantity(index, item.quantity + 1)}
//                             >
//                               +
//                             </button>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
//                           {formatPrice(item.medicine.mrp * item.quantity)}
//                         </td>
//                         <td className="px-4 py-3 text-right">
//                           <button
//                             type="button"
//                             className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//                             onClick={() => removeItem(index)}
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr className="bg-gray-50 dark:bg-gray-700">
//                       <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
//                         Total:
//                       </td>
//                       <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
//                         {formatPrice(calculateTotal())}
//                       </td>
//                       <td></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb
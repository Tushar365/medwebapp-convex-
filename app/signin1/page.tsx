// "use client";

// import { useAuthActions } from "@convex-dev/auth/react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function SignIn() {
//   const { signIn } = useAuthActions();
//   const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
//           <p className="mt-2 text-gray-600">
//             {step === "signIn" 
//               ? "Enter your email to receive a verification code" 
//               : "Enter the verification code sent to your email"}
//           </p>
//           {error && (
//             <p className="mt-2 text-red-600">{error}</p>
//           )}
//         </div>
        
//         <div className="rounded-lg bg-white p-8 shadow-md">
//           {step === "signIn" ? (
//             <form
//               onSubmit={async (event) => {
//                 event.preventDefault();
//                 setError(null);
//                 const formData = new FormData(event.currentTarget);
//                 try {
//                   await signIn("resend-otp", formData);
//                   setStep({ email: formData.get("email") as string });
//                 } catch (error) {
//                   console.error("Sign in error:", error);
//                   setError("Failed to send verification code. Please try again.");
//                 }
//               }}
//               className="space-y-6"
//             >
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   placeholder="your@email.com"
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 Send code
//               </button>
//             </form>
//           ) : (
//             <form
//               onSubmit={(event) => {
//                 event.preventDefault();
//                 setError(null);
//                 const formData = new FormData(event.currentTarget);
                
//                 // Use a non-async handler with promise chaining
//                 signIn("resend-otp", formData)
//                   .then(() => {
//                     console.log("Authentication successful");
//                     router.push("/");
//                   })
//                   .catch((error) => {
//                     console.error("Verification error:", error);
                    
//                     // Check if this is an API key error
//                     if (error && error.message && 
//                         (error.message.includes("API key is invalid") || 
//                          error.message.includes("validation_error"))) {
//                       setError("Authentication service is currently unavailable. Please try again later or contact support.");
//                       console.error("API key validation error:", error);
//                     } 
//                     // Check if this is the redirect error
//                     else if (error && error.message && error.message.includes("redirect")) {
//                       console.log("Redirect error caught, handling manually");
//                       router.push("/");
//                     } else {
//                       setError("Invalid verification code. Please try again.");
//                     }
//                   });
//               }}
//               className="space-y-6"
//             >
//               <div>
//                 <label htmlFor="code" className="block text-sm font-medium text-gray-700">
//                   Verification Code
//                 </label>
//                 <input
//                   id="code"
//                   name="code"
//                   type="text"
//                   required
//                   placeholder="Enter verification code"
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                 />
//                 <input name="email" value={step.email} type="hidden" />
//               </div>
//               <div className="flex space-x-4">
//                 <button
//                   type="submit"
//                   className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   Continue
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setStep("signIn")}
//                   className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


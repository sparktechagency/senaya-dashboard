// import React, { useState } from "react";
// import { Upload, FileSpreadsheet, ClipboardEdit, CheckCircle, XCircle } from "lucide-react";

// // Types
// interface ToastState {
//   message: string;
//   type: "success" | "error" | "";
// }

// interface ToastContainerProps {
//   message: string;
//   type: "success" | "error" | "";
//   onClose: () => void;
// }

// interface APIResponse {
//   data?: {
//     success: boolean;
//     message?: string;
//   };
//   error?: {
//     message?: string;
//     status?: number;
//   };
// }

// // Mock CreateSpare component for demonstration
// const CreateSpare: React.FC = () => (
//   <div className="p-6">
//     <h3 className="text-xl font-semibold mb-4">Create Spare Form</h3>
//     <p className="text-gray-600">Form fields would go here...</p>
//   </div>
// );

// // Toast replacement with inline notifications
// const ToastContainer: React.FC<ToastContainerProps> = ({ message, type, onClose }) => {
//   if (!message) return null;

//   return (
//     <div className="fixed top-4 right-4 z-50 animate-slide-in">
//       <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
//         }`}>
//         {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
//         <span>{message}</span>
//         <button onClick={onClose} className="ml-4 hover:opacity-80">✕</button>
//       </div>
//     </div>
//   );
// };

// const SpareFromOrFileUpload: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"form" | "file">("form");
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [toast, setToast] = useState<ToastState>({ message: "", type: "" });

//   const showToast = (message: string, type: "success" | "error"): void => {
//     setToast({ message, type });
//     setTimeout(() => setToast({ message: "", type: "" }), 4000);
//   };

//   // Simulated API call - replace with your actual mutation
//   // const uploadFileToAPI = async (formData: FormData): Promise<APIResponse> => {
//   //   // Simulate API delay
//   //   await new Promise(resolve => setTimeout(resolve, 1500));

//   //   // Simulate random success/failure for demo
//   //   const isSuccess = Math.random() > 0.3;

//   //   if (isSuccess) {
//   //     return { data: { success: true, message: "File uploaded successfully" } };
//   //   } else {
//   //     return { error: { message: "Upload failed", status: 400 } };
//   //   }
//   // };

//   // Handle Excel file upload
//   // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
//   //   const file = e.target.files?.[0];
//   //   if (!file) return;

//   //   // Validate file extension
//   //   const validExtensions = ['.xlsx', '.xls'];
//   //   const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

//   //   if (!validExtensions.includes(fileExtension)) {
//   //     showToast("Please upload a valid Excel file (.xlsx or .xls)", "error");
//   //     e.target.value = ""; // Reset input
//   //     return;
//   //   }

//   //   // Validate file size (e.g., max 10MB)
//   //   const maxSize = 10 * 1024 * 1024; // 10MB
//   //   if (file.size > maxSize) {
//   //     showToast("File size exceeds 10MB limit", "error");
//   //     e.target.value = "";
//   //     return;
//   //   }

//   //   setUploading(true);

//   //   try {
//   //     const formData = new FormData();
//   //     // Make sure the field name matches your backend expectation
//   //     formData.append("document", file);

//   //     // Optional: Add additional fields if needed
//   //     // formData.append("uploadType", "spare");
//   //     // formData.append("userId", "123");

//   //     console.log("Uploading file:", file.name, "Size:", file.size, "bytes");

//   //     // Replace this with your actual mutation hook
//   //     // const result = await uploadFileToAPI(formData);

//   //     if (result.data && result.data.success) {
//   //       showToast(`File "${file.name}" uploaded successfully!`, "success");
//   //       e.target.value = ""; // Reset input on success
//   //     } else if (result.error) {
//   //       console.error("Upload error:", result.error);
//   //       const errorMessage = result.error.message || "File upload failed! Please try again.";
//   //       showToast(errorMessage, "error");
//   //     }
//   //   } catch (error) {
//   //     console.error("Upload exception:", error);
//   //     showToast("Network error! Please check your connection and try again.", "error");
//   //   } finally {
//   //     setUploading(false);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen p-8 bg-gray-50">
//       <ToastContainer
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast({ message: "", type: "" })}
//       />

//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Spare Data</h2>

//       {/* Toggle Buttons */}
//       <div className="flex gap-4 mb-8">
//         <button
//           onClick={() => setActiveTab("form")}
//           className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 
//             ${activeTab === "form"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-white text-gray-700 border hover:border-blue-400"
//             }`}
//         >
//           <ClipboardEdit size={18} />
//           Use Form
//         </button>
//         <button
//           onClick={() => setActiveTab("file")}
//           className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 
//             ${activeTab === "file"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-white text-gray-700 border hover:border-blue-400"
//             }`}
//         >
//           <FileSpreadsheet size={18} />
//           Upload Excel File
//         </button>
//       </div>

//       {/* Conditional Rendering */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {activeTab === "form" ? (
//           <CreateSpare />
//         ) : (
//           <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors">
//             <Upload size={48} className="text-blue-500 mb-4" />
//             <p className="text-gray-600 mb-4 text-center max-w-md">
//               Upload an Excel (.xlsx or .xls) file to import work data in bulk
//             </p>
//             <p className="text-sm text-gray-500 mb-4">Maximum file size: 10MB</p>

//             <label className={`px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium
//               ${uploading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
//               } text-white`}>
//               {uploading ? (
//                 <span className="flex items-center gap-2">
//                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Uploading...
//                 </span>
//               ) : (
//                 "Choose File"
//               )}
//               <input
//                 type="file"
//                 accept=".xlsx,.xls"
//                 // onChange={handleFileUpload}
//                 disabled={uploading}
//                 className="hidden"
//               />
//             </label>

//             {/* Debug Information */}
//             <div className="mt-8 p-4 bg-gray-50 rounded-lg w-full max-w-md">
//               <p className="text-xs font-semibold text-gray-700 mb-2">Debug Checklist:</p>
//               <ul className="text-xs text-gray-600 space-y-1">
//                 <li>✓ File validation implemented</li>
//                 <li>✓ FormData correctly structured</li>
//                 <li>✓ Error handling added</li>
//                 <li>✓ Loading state managed</li>
//                 <li>⚠ Check backend API endpoint</li>
//                 <li>⚠ Verify 'document' field name</li>
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SpareFromOrFileUpload;
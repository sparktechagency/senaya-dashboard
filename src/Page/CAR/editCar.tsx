// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//     useGetSingleCarQuery,
//     useUpdateCarMutation,
//     useGetModelsQuery,
//     useAllBrandQuery,
//     useImageTypeQuery
// } from "../../redux/feature/adminApi";
// import { Loader2, CarFront, MapPin, User, CreditCard, CalendarDays, Wrench, Save, X } from "lucide-react";

// const CarEdit: React.FC = () => {
//     const { carId } = useParams<{ carId: string }>();
//     const { data, isLoading, isError } = useGetSingleCarQuery(carId!, { skip: !carId });
//     const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();

//     // Fetch dropdown data
//     const { data: brandsData } = useAllBrandQuery(undefined);
//     const { data: modelsData } = useGetModelsQuery({});
//     const { data: clientsData } = useAllUserQuery({});
//     const { data: symbolsData } = useImageTypeQuery(undefined);

//     const car = data?.data;


//     // Form state
//     const [formData, setFormData] = useState({
//         client: "",
//         brand: "",
//         model: "",
//         year: "",
//         vin: "",
//         description: "",
//         carType: "Saudi" as "Saudi" | "International",
//         plateNumberForInternational: "",
//         plateNumberForSaudi: {
//             symbol: "",
//             numberEnglish: "",
//             numberArabic: "",
//             alphabetsCombinations: [""]
//         },
//         longitude: "",
//         latitude: "",
//         address: ""
//     });

//     // Initialize form data when car data loads
//     useEffect(() => {
//         if (car) {
//             setFormData({
//                 client: car.client?._id || car.client?.clientId?._id || "",
//                 brand: car.brand?._id || "",
//                 model: car.model?._id || "",
//                 year: car.year || "",
//                 vin: car.vin || "",
//                 description: car.description || "",
//                 carType: car.carType || "Saudi",
//                 plateNumberForInternational: car.plateNumberForInternational || "",
//                 plateNumberForSaudi: {
//                     symbol: car.plateNumberForSaudi?.symbol?._id || car.plateNumberForSaudi?.symbol || "",
//                     numberEnglish: car.plateNumberForSaudi?.numberEnglish || "",
//                     numberArabic: car.plateNumberForSaudi?.numberArabic || "",
//                     alphabetsCombinations: car.plateNumberForSaudi?.alphabetsCombinations || [""]
//                 },
//                 longitude: car.longitude || "",
//                 latitude: car.latitude || "",
//                 address: car.address || ""
//             });
//         }
//     }, [car]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSaudiPlateChange = (field: string, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             plateNumberForSaudi: {
//                 ...prev.plateNumberForSaudi,
//                 [field]: value
//             }
//         }));
//     };

//     const handleAlphabetChange = (index: number, value: string) => {
//         setFormData(prev => {
//             const newAlphabets = [...prev.plateNumberForSaudi.alphabetsCombinations];
//             newAlphabets[index] = value;
//             return {
//                 ...prev,
//                 plateNumberForSaudi: {
//                     ...prev.plateNumberForSaudi,
//                     alphabetsCombinations: newAlphabets
//                 }
//             };
//         });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             const updateData: any = {
//                 client: formData.client,
//                 brand: formData.brand,
//                 model: formData.model,
//                 year: formData.year,
//                 vin: formData.vin,
//                 description: formData.description,
//                 carType: formData.carType,
//                 longitude: formData.longitude,
//                 latitude: formData.latitude,
//                 address: formData.address
//             };

//             // Add plate number based on car type
//             if (formData.carType === "International") {
//                 updateData.plateNumberForInternational = formData.plateNumberForInternational;
//             } else if (formData.carType === "Saudi") {
//                 updateData.plateNumberForSaudi = formData.plateNumberForSaudi;
//             }

//             await updateCar({ id: carId, data: updateData }).unwrap();
//             alert("Car updated successfully!");
//             // Navigate back or handle success
//         } catch (error) {
//             console.error("Failed to update car:", error);
//             alert("Failed to update car. Please try again.");
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen text-indigo-600">
//                 <Loader2 className="animate-spin mr-2" size={26} />
//                 Loading Car Details...
//             </div>
//         );
//     }

//     if (isError || !car) {
//         return (
//             <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
//                 ❌ Failed to load car details
//             </div>
//         );
//     }

//     const brands = brandsData?.data?.result || [];
//     const models = modelsData?.data || [];
//     const clients = clientsData?.data || [];
//     const symbols = symbolsData?.data || [];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-6">
//             <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white flex items-center justify-between">
//                     <div>
//                         <h2 className="text-3xl font-bold">Edit Car Details</h2>
//                         <p className="text-sm opacity-80 mt-1">VIN: {car.vin || "Not Available"}</p>
//                     </div>
//                     <CarFront size={44} className="opacity-90" />
//                 </div>

//                 {/* Form Container */}
//                 <div className="p-8">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Client */}
//                         <FormField label="Client" icon={<User className="text-indigo-500" size={20} />}>
//                             <select
//                                 name="client"
//                                 value={formData.client}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             >
//                                 <option value="">Select Client</option>
//                                 {clients.map((client: any) => (
//                                     <option key={client._id} value={client._id}>
//                                         {client.name || client.clientId?.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </FormField>

//                         {/* Brand */}
//                         <FormField label="Brand" icon={<CarFront className="text-indigo-500" size={20} />}>
//                             <select
//                                 name="brand"
//                                 value={formData.brand}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             >
//                                 <option value="">Select Brand</option>
//                                 {brands.map((brand: any) => (
//                                     <option key={brand._id} value={brand._id}>
//                                         {brand.title}
//                                     </option>
//                                 ))}
//                             </select>
//                         </FormField>

//                         {/* Model */}
//                         <FormField label="Model" icon={<Wrench className="text-indigo-500" size={20} />}>
//                             <select
//                                 name="model"
//                                 value={formData.model}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             >
//                                 <option value="">Select Model</option>
//                                 {models.map((model: any) => (
//                                     <option key={model._id} value={model._id}>
//                                         {model.title}
//                                     </option>
//                                 ))}
//                             </select>
//                         </FormField>

//                         {/* Year */}
//                         <FormField label="Year" icon={<CalendarDays className="text-indigo-500" size={20} />}>
//                             <input
//                                 type="text"
//                                 name="year"
//                                 value={formData.year}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             />
//                         </FormField>

//                         {/* VIN */}
//                         <FormField label="VIN" icon={<CreditCard className="text-indigo-500" size={20} />}>
//                             <input
//                                 type="text"
//                                 name="vin"
//                                 value={formData.vin}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             />
//                         </FormField>

//                         {/* Car Type */}
//                         <FormField label="Car Type" icon={<CarFront className="text-indigo-500" size={20} />}>
//                             <select
//                                 name="carType"
//                                 value={formData.carType}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             >
//                                 <option value="Saudi">Saudi</option>
//                                 <option value="International">International</option>
//                             </select>
//                         </FormField>

//                         {/* Conditional Plate Number Fields */}
//                         {formData.carType === "International" ? (
//                             <FormField label="Plate Number (International)" icon={<CreditCard className="text-indigo-500" size={20} />}>
//                                 <input
//                                     type="text"
//                                     name="plateNumberForInternational"
//                                     value={formData.plateNumberForInternational}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 />
//                             </FormField>
//                         ) : (
//                             <>
//                                 <FormField label="Symbol" icon={<CreditCard className="text-indigo-500" size={20} />}>
//                                     <select
//                                         value={formData.plateNumberForSaudi.symbol}
//                                         onChange={(e) => handleSaudiPlateChange("symbol", e.target.value)}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     >
//                                         <option value="">Select Symbol</option>
//                                         {symbols.map((symbol: any) => (
//                                             <option key={symbol._id} value={symbol._id}>
//                                                 {symbol.title}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </FormField>

//                                 <FormField label="Number (English)" icon={<CreditCard className="text-indigo-500" size={20} />}>
//                                     <input
//                                         type="text"
//                                         value={formData.plateNumberForSaudi.numberEnglish}
//                                         onChange={(e) => handleSaudiPlateChange("numberEnglish", e.target.value)}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     />
//                                 </FormField>

//                                 <FormField label="Number (Arabic)" icon={<CreditCard className="text-indigo-500" size={20} />}>
//                                     <input
//                                         type="text"
//                                         value={formData.plateNumberForSaudi.numberArabic}
//                                         onChange={(e) => handleSaudiPlateChange("numberArabic", e.target.value)}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     />
//                                 </FormField>

//                                 <FormField label="Alphabets Combination" icon={<CreditCard className="text-indigo-500" size={20} />}>
//                                     <input
//                                         type="text"
//                                         value={formData.plateNumberForSaudi.alphabetsCombinations[0]}
//                                         onChange={(e) => handleAlphabetChange(0, e.target.value)}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     />
//                                 </FormField>
//                             </>
//                         )}

//                         {/* Location Fields */}
//                         <FormField label="Longitude" icon={<MapPin className="text-indigo-500" size={20} />}>
//                             <input
//                                 type="text"
//                                 name="longitude"
//                                 value={formData.longitude}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             />
//                         </FormField>

//                         <FormField label="Latitude" icon={<MapPin className="text-indigo-500" size={20} />}>
//                             <input
//                                 type="text"
//                                 name="latitude"
//                                 value={formData.latitude}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             />
//                         </FormField>

//                         {/* Address - Full Width */}
//                         <div className="md:col-span-2">
//                             <FormField label="Address" icon={<MapPin className="text-indigo-500" size={20} />}>
//                                 <input
//                                     type="text"
//                                     name="address"
//                                     value={formData.address}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 />
//                             </FormField>
//                         </div>

//                         {/* Description - Full Width */}
//                         <div className="md:col-span-2">
//                             <FormField label="Description" icon={<Wrench className="text-indigo-500" size={20} />}>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     rows={3}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                                 />
//                             </FormField>
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-4 mt-8">
//                         <button
//                             onClick={handleSubmit}
//                             disabled={isUpdating}
//                             className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isUpdating ? (
//                                 <>
//                                     <Loader2 className="animate-spin" size={20} />
//                                     Updating...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save size={20} />
//                                     Update Car
//                                 </>
//                             )}
//                         </button>
//                         <button
//                             onClick={() => window.history.back()}
//                             className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
//                         >
//                             <X size={20} />
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// interface FormFieldProps {
//     label: string;
//     icon: React.ReactNode;
//     children: React.ReactNode;
// }

// const FormField: React.FC<FormFieldProps> = ({ label, icon, children }) => (
//     <div className="flex flex-col">
//         <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//             {icon}
//             {label}
//         </label>
//         {children}
//     </div>
// );

// export default CarEdit;
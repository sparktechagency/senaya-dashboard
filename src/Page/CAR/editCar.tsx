import React, { useState, useEffect } from "react";

import {
    useGetSingleCarQuery,
    useUpdateCarMutation,
    useAllBrandQuery,
    useImageTypeQuery,
    useAllClientQuery,
    useAllCarModelQuery
} from "../../redux/feature/adminApi";
import {
    Loader2,
    CarFront,
    User,
    CreditCard,
    CalendarDays,
    Wrench,
    Save,
    X
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

/* ------------------ UTILS ------------------ */
const englishToArabicMap: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
};

const convertEnglishToArabic = (value: string) =>
    value
        .split("")
        .map(char => englishToArabicMap[char] ?? "")
        .join("");

/* ------------------ COMPONENT ------------------ */
const EditCar: React.FC = () => {
    const { carId } = useParams<{ carId: string }>();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetSingleCarQuery(carId!, { skip: !carId });
    const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();

    const { data: brandsData } = useAllBrandQuery(undefined);
    const { data: modelsData } = useAllCarModelQuery(undefined);
    const { data: clientsData } = useAllClientQuery({});
    const { data: symbolsData } = useImageTypeQuery(undefined);

    const brands = brandsData?.data?.result || [];
    const models = modelsData?.data || [];
    const clients = clientsData?.data?.result || [];
    const symbols = symbolsData?.data || [];

    const car = data?.data;

    /* ------------------ STATE ------------------ */
    const [formData, setFormData] = useState({
        client: "",
        providerWorkShopId: "",
        brand: "",
        model: "",
        year: "",
        vin: "",
        description: "",
        carType: "Saudi" as "Saudi" | "International",
        plateNumberForInternational: "",
        plateNumberForSaudi: {
            symbol: "",
            numberEnglish: "",
            numberArabic: "",
            alphabetsCombinations: [""]
        },
        longitude: "",
        latitude: "",
        address: ""
    });

    /* ------------------ INIT DATA ------------------ */
    useEffect(() => {
        if (!car) return;

        setFormData({
            client: car.client?._id || car.client?.clientId?._id || "",
            providerWorkShopId: car.providerWorkShopId || "",
            brand: car.brand?._id || "",
            model: car.model?._id || "",
            year: car.year || "",
            vin: car.vin || "",
            description: car.description || "",
            carType: car.carType || "Saudi",
            plateNumberForInternational: car.plateNumberForInternational || "",
            plateNumberForSaudi: {
                symbol: car.plateNumberForSaudi?.symbol?._id || "",
                numberEnglish: car.plateNumberForSaudi?.numberEnglish || "",
                numberArabic:
                    car.plateNumberForSaudi?.numberArabic ||
                    convertEnglishToArabic(car.plateNumberForSaudi?.numberEnglish || ""),
                alphabetsCombinations:
                    car.plateNumberForSaudi?.alphabetsCombinations || [""]
            },
            longitude: car.longitude || "",
            latitude: car.latitude || "",
            address: car.address || ""
        });
    }, [car]);

    /* ------------------ HANDLERS ------------------ */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Client select → providerWorkShopId auto set
    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClientId = e.target.value;
        const selectedClient = clients.find((c: any) => c._id === selectedClientId);

        const providerWorkShopId =
            selectedClient?.providerWorkShopId ||
            selectedClient?.clientId?.providerWorkShopId ||
            selectedClient?.workshopId ||
            "";
        setFormData(prev => ({
            ...prev,
            client: selectedClientId,
            providerWorkShopId
        }));
    };

    // ✅ Saudi plate (English → Arabic auto)
    const handleSaudiPlateChange = (field: string, value: string) => {
        setFormData(prev => {
            if (field === "numberEnglish") {
                return {
                    ...prev,
                    plateNumberForSaudi: {
                        ...prev.plateNumberForSaudi,
                        numberEnglish: value,
                        numberArabic: convertEnglishToArabic(value)
                    }
                };
            }

            return {
                ...prev,
                plateNumberForSaudi: {
                    ...prev.plateNumberForSaudi,
                    [field]: value
                }
            };
        });
    };


    /* ------------------ SUBMIT ------------------ */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.providerWorkShopId) {
            alert("providerWorkShopId missing!");
            return;
        }

        const payload: any = {
            client: formData.client,
            providerWorkShopId: formData.providerWorkShopId,
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            description: formData.description,
            carType: formData.carType
        };

        if (formData.carType === "Saudi") {
            payload.plateNumberForSaudi = {
                symbol: formData.plateNumberForSaudi.symbol,
                numberEnglish: formData.plateNumberForSaudi.numberEnglish,
                numberArabic: formData.plateNumberForSaudi.numberArabic,
                alphabetsCombinations:
                    formData.plateNumberForSaudi.alphabetsCombinations.filter(Boolean)
            };
        } else {
            payload.plateNumberForInternational =
                formData.plateNumberForInternational;
        }

        try {
            await updateCar({ id: carId as string, payload }).unwrap();
            console.log("payload", payload);
            navigate("/admin/car");
        } catch (err: any) {
            alert(err?.data?.message || "Update failed");
        }
    };

    /* ------------------ UI ------------------ */
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin mr-2" />
                Loading...
            </div>
        );
    }

    if (isError || !car) {
        return <div className="text-red-600 text-center">Failed to load car</div>;
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-6">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">Edit Car Details</h2>
                        <p className="text-sm opacity-80 mt-1">VIN: {car.vin || "Not Available"}</p>
                    </div>
                    <CarFront size={44} className="opacity-90" />
                </div>

                {/* Form Container */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client */}
                        <FormField label="Client" icon={<User className="text-indigo-500" size={20} />}>
                            <select
                                name="client"
                                value={formData.client}
                                onChange={handleClientChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select Client</option>
                                {clients.map((client: any) => (
                                    <option key={client._id} value={client._id}>
                                        {client?.clientId?.name || client?.workShopNameAsClient || client?.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>


                        {/* Brand */}
                        <FormField label="Brand" icon={<CarFront className="text-indigo-500" size={20} />}>
                            <select
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand: any) => (
                                    <option key={brand._id} value={brand._id}>
                                        {brand.title}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        {/* Model */}
                        <FormField label="Model" icon={<Wrench className="text-indigo-500" size={20} />}>
                            <select
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select Model</option>
                                {models.map((model: any) => (
                                    <option key={model._id} value={model._id}>
                                        {model.title}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        {/* Year */}
                        <FormField label="Year" icon={<CalendarDays className="text-indigo-500" size={20} />}>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </FormField>

                        {/* VIN */}
                        <FormField label="VIN" icon={<CreditCard className="text-indigo-500" size={20} />}>
                            <input
                                type="text"
                                name="vin"
                                value={formData.vin}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </FormField>

                        {/* Car Type */}
                        <FormField label="Car Type" icon={<CarFront className="text-indigo-500" size={20} />}>
                            <select
                                name="carType"
                                value={formData.carType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="Saudi">Saudi</option>
                                <option value="International">International</option>
                            </select>
                        </FormField>

                        {/* Conditional Plate Number Fields */}
                        {formData.carType === "International" ? (
                            <FormField label="Plate Number (International)" icon={<CreditCard className="text-indigo-500" size={20} />}>
                                <input
                                    type="text"
                                    name="plateNumberForInternational"
                                    value={formData.plateNumberForInternational}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </FormField>
                        ) : (
                            <>
                                <FormField label="Symbol" icon={<CreditCard className="text-indigo-500" size={20} />}>
                                    <select
                                        value={formData.plateNumberForSaudi.symbol}
                                        onChange={(e) => handleSaudiPlateChange("symbol", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Select Symbol</option>
                                        {symbols.map((symbol: any) => (
                                            <option key={symbol._id} value={symbol._id}>
                                                {symbol.title}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Number (English)" icon={<CreditCard size={18} />}>
                                    <input
                                        value={formData.plateNumberForSaudi.numberEnglish}
                                        onChange={e =>
                                            handleSaudiPlateChange(
                                                "numberEnglish",
                                                e.target.value.replace(/[^0-9]/g, "")
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </FormField>

                                <FormField label="Number (Arabic)" icon={<CreditCard size={18} />}>
                                    <input
                                        value={formData.plateNumberForSaudi.numberArabic}
                                        readOnly
                                        className="input bg-gray-100 w-full px-4 py-2  rounded-lg cursor-not-allowed"
                                    />
                                </FormField>


                                {/* <FormField label="Alphabets Combination" icon={<CreditCard className="text-indigo-500" size={20} />}>
                                    <input
                                        type="text"
                                        value={formData.plateNumberForSaudi.alphabetsCombinations[0]}
                                        onChange={(e) => handleAlphabetChange(0, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </FormField> */}
                            </>
                        )}
                        {/* Description - Full Width */}
                        {/* <div className="md:col-span-2">
                            <FormField label="Description" icon={<Wrench className="text-indigo-500" size={20} />}>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </FormField>
                        </div> */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Car
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={20} />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface FormFieldProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, icon, children }) => (
    <div className="flex flex-col">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            {icon}
            {label}
        </label>
        {children}
    </div>
);

export default EditCar;
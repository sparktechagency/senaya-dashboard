import React, { useState, useEffect, useRef } from "react";

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
    X,
    ChevronDown,
    Search
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

/* ------------------ CUSTOM SEARCHABLE DROPDOWN ------------------ */
interface SearchableDropdownProps {
    options: Array<{ value: string; label: string; raw: any }>;
    value: string;
    onChange: (value: string, raw: any) => void;
    placeholder?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = "Search..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: any) => {
        onChange(option.value, option.raw);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("", null);
        setSearchTerm("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent cursor-pointer bg-white flex items-center justify-between"
            >
                <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-2">
                    {selectedOption && (
                        <X
                            size={16}
                            className="text-gray-400 hover:text-gray-600"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Type to search..."
                                className="flex-1 bg-transparent outline-none text-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-48">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${option.value === value ? "bg-indigo-100 text-indigo-700 font-medium" : ""
                                        }`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                No clients found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

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
            alphabetsCombinations: ["", ""]
        },
        longitude: "",
        latitude: "",
        address: ""
    });

    /* ------------------ CLIENT OPTIONS ------------------ */
    const clientOptions = clients.map((client: any) => ({
        value: client._id,
        label: client?.clientId?.name || client?.workShopNameAsClient || client?.name || "Unknown",
        raw: client
    }));

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
                numberArabic: car.plateNumberForSaudi?.numberArabic || "",
                alphabetsCombinations: car.plateNumberForSaudi?.alphabetsCombinations?.length > 0
                    ? car.plateNumberForSaudi.alphabetsCombinations
                    : ["", ""]
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
    const handleClientSelect = (clientId: string, clientRaw: any) => {
        if (!clientId) {
            setFormData(prev => ({
                ...prev,
                client: "",
                providerWorkShopId: ""
            }));
            return;
        }

        const providerWorkShopId =
            clientRaw?.providerWorkShopId ||
            clientRaw?.clientId?.providerWorkShopId ||
            clientRaw?.workshopId ||
            "";

        setFormData(prev => ({
            ...prev,
            client: clientId,
            providerWorkShopId
        }));
    };

    // ✅ Saudi plate fields handler
    const handleSaudiPlateChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            plateNumberForSaudi: {
                ...prev.plateNumberForSaudi,
                [field]: value
            }
        }));
    };

    // ✅ Handler for alphabet combinations
    const handleAlphabetChange = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            plateNumberForSaudi: {
                ...prev.plateNumberForSaudi,
                alphabetsCombinations: prev.plateNumberForSaudi.alphabetsCombinations.map((item, i) =>
                    i === index ? value : item
                )
            }
        }));
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
                alphabetsCombinations: formData.plateNumberForSaudi.alphabetsCombinations.filter(Boolean)
            };
        } else {
            payload.plateNumberForInternational = formData.plateNumberForInternational;
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
                        {/* Client - Custom Searchable Dropdown */}
                        <FormField label="Client" icon={<User className="text-indigo-500" size={20} />}>
                            <SearchableDropdown
                                options={clientOptions}
                                value={formData.client}
                                onChange={handleClientSelect}
                                placeholder="Search and select client..."
                            />
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
                                {/* Symbol */}
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

                                {/* Number (English) */}
                                <FormField label="Number (English)" icon={<CreditCard size={20} />}>
                                    <input
                                        type="text"
                                        value={formData.plateNumberForSaudi.numberEnglish}
                                        onChange={(e) => handleSaudiPlateChange("numberEnglish", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </FormField>

                                {/* Number (Arabic) */}
                                <FormField label="Number (Arabic)" icon={<CreditCard size={20} />}>
                                    <input
                                        type="text"
                                        value={formData.plateNumberForSaudi.numberArabic}
                                        onChange={(e) => handleSaudiPlateChange("numberArabic", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </FormField>

                                {/* Alphabet Combination 1 */}
                                <FormField label="Alphabet 1" icon={<CreditCard size={20} />}>
                                    <input
                                        type="text"
                                        value={formData.plateNumberForSaudi.alphabetsCombinations[0] || ""}
                                        onChange={(e) => handleAlphabetChange(0, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="First letter"
                                    />
                                </FormField>

                                {/* Alphabet Combination 2 */}
                                <FormField label="Alphabet 2" icon={<CreditCard size={20} />}>
                                    <input
                                        type="text"
                                        value={formData.plateNumberForSaudi.alphabetsCombinations[1] || ""}
                                        onChange={(e) => handleAlphabetChange(1, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Second letter"
                                    />
                                </FormField>
                            </>
                        )}
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
import React, { useState, useEffect } from "react";
import {
    useGetSingleCarQuery,
    useUpdateCarMutation,
    useAllBrandQuery,
    useImageTypeQuery,
    useAllCarModelQuery
} from "../../redux/feature/adminApi";
import {
    Loader2,
    CarFront,
    CreditCard,
    CalendarDays,
    Wrench,
    Save,
    X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

/* ------------------ COMPONENT ------------------ */
const EditCar: React.FC = () => {
    const { carId } = useParams<{ carId: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useGetSingleCarQuery(carId!, { skip: !carId });
    const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();

    const { data: brandsData } = useAllBrandQuery(undefined);
    const { data: modelsData } = useAllCarModelQuery(undefined);
    const { data: symbolsData } = useImageTypeQuery(undefined);

    const brands = brandsData?.data?.result || [];
    const models = modelsData?.data || [];
    const symbols = symbolsData?.data || [];

    const car = data?.data;

    console.log("~~~~~~~~~~~~~~~~~~~~~~~~MODELS", models);
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~BRANDS", brands);


    /* ------------------ STATE ------------------ */
    const [formData, setFormData] = useState({
        client: "",
        clientName: "",
        clientType: "",
        providerWorkShopId: "",
        brand: "",
        model: "",
        year: "",
        vin: "",
        description: "",
        contact: "",
        carType: "Saudi" as "Saudi" | "International",
        plateNumberForInternational: "",
        plateNumberForSaudi: {
            symbol: "",
            numberEnglish: "",
            numberArabic: "",
            alphabetsCombinations: ["", ""],
        },
    });

    /* ------------------ INIT ------------------ */
    useEffect(() => {
        if (!car) return;

        setFormData({
            client: car.client?._id || "",
            clientType: car.client?.clientType || "User",
            clientName:
                car.client?.clientId?.name ||
                car.client?.workShopNameAsClient ||
                "",
            providerWorkShopId: car.providerWorkShopId || "",
            brand: car.brand?._id || "",
            model: car.model?._id || "",
            year: car.year || "",
            vin: car.vin || "",
            contact: car.client?.contact || "",
            description: car.description || "",
            carType: car.carType || "Saudi",
            plateNumberForInternational: car.plateNumberForInternational || "",
            plateNumberForSaudi: {
                symbol: car.plateNumberForSaudi?.symbol?._id || "",
                numberEnglish: car.plateNumberForSaudi?.numberEnglish || "",
                numberArabic: car.plateNumberForSaudi?.numberArabic || "",
                alphabetsCombinations:
                    car.plateNumberForSaudi?.alphabetsCombinations?.length
                        ? car.plateNumberForSaudi.alphabetsCombinations
                        : ["", ""],
            },
        });
    }, [car]);

    /* ------------------ HANDLERS ------------------ */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // When model changes
        if (name === "model") {
            const selectedModel = models.find((m: any) => m._id === value);

            setFormData(prev => ({
                ...prev,
                model: value,
                brand: selectedModel?.brand?._id || "",
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSaudiPlateChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            plateNumberForSaudi: {
                ...prev.plateNumberForSaudi,
                [field]: value,
            },
        }));
    };

    const handleAlphabetChange = (index: number, value: string) => {
        const updated = [...formData.plateNumberForSaudi.alphabetsCombinations];
        updated[index] = value;

        setFormData(prev => ({
            ...prev,
            plateNumberForSaudi: {
                ...prev.plateNumberForSaudi,
                alphabetsCombinations: updated,
            },
        }));
    };

    /* ------------------ SUBMIT ------------------ */
    const handleSubmit = async () => {
        const payload: any = {
            clientId: formData.client,
            clientType: formData.clientType,
            ...(formData.clientType === "User"
                ? { name: formData.clientName }
                : { workShopNameAsClient: formData.clientName }
            ),
            providerWorkShopId: formData.providerWorkShopId,
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            vin: formData.vin,
            description: formData.description,
            carType: formData.carType,
            carId,
            contact: formData.contact,
        };

        if (formData.carType === "Saudi") {
            payload.plateNumberForSaudi = {
                symbol: formData.plateNumberForSaudi.symbol,
                numberEnglish: formData.plateNumberForSaudi.numberEnglish,
                numberArabic: formData.plateNumberForSaudi.numberArabic,
                alphabetsCombinations:
                    formData.plateNumberForSaudi.alphabetsCombinations.filter(Boolean),
            };
        } else {
            payload.plateNumberForInternational =
                formData.plateNumberForInternational;
        }

        await updateCar(payload).unwrap();
        console.log("payload-----------------------", payload);
        navigate("/admin/car");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin mr-2" /> Loading...
            </div>
        );
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
                        <FormField label="Client Name" icon={<CreditCard size={18} />}>
                            <input
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}

                                className="w-full px-4 py-2 border rounded bg-gray-100"
                            />
                        </FormField>

                        {/* Brand */}
                        <FormField label="Brand" icon={<CarFront size={20} />}>
                            <input
                                value={
                                    brands.find((b: any) => b._id === formData.brand)?.title || ""
                                }
                                disabled
                                className="w-full px-4 py-2 border bg-gray-100 cursor-not-allowed"
                            />
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
                            <input
                                name="carType"
                                value={formData.carType}
                                // onChange={handleInputChange}
                                disabled
                                className="w-full px-4 py-2 border cursor-not-allowed border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
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

                                <div className="flex justify-between">
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
                                </div>
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
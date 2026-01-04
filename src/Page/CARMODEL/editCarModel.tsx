import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  useAllBrandQuery,
  useGetSingleCarModelQuery,
  useUpdateCarModelMutation,
} from "../../redux/feature/adminApi";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  title: string;
  brand: string;
}

const EditCarModel: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  console.log("Model ID:", modelId);
  const navigate = useNavigate();

  // API hooks
  const { data: modelData, isLoading: modelLoading, isError: modelError } =
    useGetSingleCarModelQuery(modelId!);

  const [updateCarModel, { isLoading: isUpdating }] = useUpdateCarModelMutation();
  const { data: allBrand, isLoading: brandLoading } = useAllBrandQuery(undefined);

  const brands = allBrand?.data?.result || [];
  const carModel = modelData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  // Pre-populate form with existing data
  useEffect(() => {
    if (carModel) {
      console.log("Car Model Data:", carModel);
      setValue("title", carModel.title || "");
      setValue("brand", carModel.brand?._id || carModel.brand || "");
    }
  }, [carModel, setValue]);

  // Submit function
  const onSubmit = async (formData: FormData) => {
    console.log("Submitting data:", formData);
    console.log("Model ID:", modelId);

    try {
      // Send data directly without wrapping in { id, data }
      const result = await updateCarModel({
        id: modelId,
        ...formData
      }).unwrap();

      console.log("Update result:", result);
      toast.success("Car Model Updated Successfully!");
      navigate("/admin/carmodel");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update car model");
    }
  };

  // Loading state
  if (modelLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <Loader2 className="animate-spin" size={26} />
          <span className="font-semibold">Loading Car Model...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (modelError || !carModel) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-600 font-semibold text-center">
          <p className="text-2xl mb-2">❌ Failed to load car model</p>
          <button
            onClick={() => navigate("/admin/carmodel")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Car Models
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Edit Car Model
        </h2>

        <div className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter car model title"
              {...register("title", { required: "Title is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Brand Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Brand
            </label>
            <select
              {...register("brand", { required: "Brand is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={brandLoading}
            >
              <option value="">Select Brand</option>
              {brands.map((brand: any) => (
                <option key={brand._id} value={brand._id}>
                  {brand.title || brand.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit(onSubmit)}
              disabled={isUpdating}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating && <Loader2 className="animate-spin" size={20} />}
              {isUpdating ? "Updating..." : "Update Model"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/carmodel")}
              type="button"
              className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold shadow-md"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditCarModel;
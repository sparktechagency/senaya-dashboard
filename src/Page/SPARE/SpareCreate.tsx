import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateSpareMutation } from "../../redux/feature/work";
import { useAllWorkShopQuery } from "../../redux/feature/adminApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

type SpareFormValues = {
  providerWorkShopId: string;
  itemName: string;
  code: string;
};

const CreateSpare: React.FC = () => {
  const [searchTerm] = useState("");
  const navigate = useNavigate();
  const { data: providers, isLoading: loadingProviders } = useAllWorkShopQuery({ search: searchTerm });
  const [createSpare, { isLoading }] = useCreateSpareMutation();

  const providerList = providers?.data?.result || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpareFormValues>();

  const onSubmit = async (formData: SpareFormValues) => {
    try {
      const payload = {
        providerWorkShopId: formData.providerWorkShopId,
        itemName: formData.itemName,
        code: formData.code,
      };

      await createSpare(payload).unwrap();
      toast.success("Spare part created successfully!");
      reset();
      navigate("/admin/Spare");
    } catch (err) {
      toast.error("Failed to create spare part.");
    }
  };

  return (
    <div className=" flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md text-black rounded-2xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">
          Create Spare Part
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
          {/* Provider Selection */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Provider</label>
            {loadingProviders ? (
              <p className="text-sm text-gray-600">Loading providers...</p>
            ) : (
              <select
                {...register("providerWorkShopId", { required: "Provider is required" })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select WorkShopProvider
                </option>
                {providerList.length === 0 ? (
                  <option value="" disabled>
                    No providers found
                  </option>
                ) : (
                  providerList.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {(p.workshopNameArabic || "").trim()}{" "}
                      {p.workshopNameArabic && p.workshopNameEnglish ? "|" : ""}{" "}
                      {(p.workshopNameEnglish || "").trim()}
                    </option>
                  ))
                )}
              </select>
            )}
            {errors.providerWorkShopId && (
              <span className="text-sm text-red-600">{errors.providerWorkShopId.message}</span>
            )}
          </div>

          {/* Item Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Item Name</label>
            <input
              {...register("itemName", { required: "Item name is required" })}
              type="text"
              placeholder="Enter item name"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.itemName && (
              <span className="text-sm text-red-600">{errors.itemName.message}</span>
            )}
          </div>

          {/* Code */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Code</label>
            <input
              {...register("code", { required: "Code is required" })}
              type="text"
              placeholder="Enter code"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.code && <span className="text-sm text-red-600">{errors.code.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-md font-medium text-white ${isLoading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 hover:opacity-90"
              } transition`}
          >
            {isLoading ? "Creating..." : "Create Spare"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSpare;
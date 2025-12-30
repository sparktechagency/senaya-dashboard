import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetSinglePackageQuery,
  useUpdatePackageMutation,
} from "../../redux/feature/Package";

// ✅ Strongly typed form data
interface PackageFormData {
  title: string;
  description: string;
  features: { value: string }[];
  price: number;
  monthlyBasePrice: number;
  discountPercentage: number;
  duration: string;
  paymentType: "Monthly" | "Yearly";
  subscriptionType: "app" | "web";
}

const UpdatePackageForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: packageData, isLoading } = useGetSinglePackageQuery(id!);
  const [updatePackage] = useUpdatePackageMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageFormData>({
    defaultValues: {
      title: "",
      description: "",
      features: [{ value: "" }],
      price: 0,
      monthlyBasePrice: 0,
      discountPercentage: 0,
      duration: "",
      paymentType: "Monthly",
      subscriptionType: "app",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  // ✅ Populate data when loaded
  useEffect(() => {
    if (packageData?.data) {
      const pkg = packageData.data;
      reset({
        title: pkg.title || "",
        description: pkg.description || "",
        features: Array.isArray(pkg.features)
          ? pkg.features.map((f: string) => ({ value: f }))
          : [{ value: "" }],
        price: pkg.price || 0,
        monthlyBasePrice: pkg.monthlyBasePrice || 0,
        discountPercentage: pkg.price * (1 - (pkg.discountPercentage / 100)),
        duration: pkg.duration || "",
        paymentType: pkg.paymentType || "Monthly",
        subscriptionType: pkg.subscriptionType || "app",
      });
    }
  }, [packageData, reset]);

  const onSubmit = async (data: PackageFormData) => {
    const discountPrice = (data.price - data.discountPercentage) / data.price * 100;
    const finalData = {
      ...data,
      price: Number(data.price),
      monthlyBasePrice: Number(data.monthlyBasePrice),
      discountPercentage: Number(discountPrice),
      features: data.features.map((f) => f.value),
    };

    try {
      const result = await updatePackage({ id, data: finalData }).unwrap();
      if (result.success) {
        toast.success("Package updated successfully!");
        navigate("/admin/package");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update package");
    }
  };


  if (isLoading) {
    return <p className="text-center py-6">Loading package data...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-semibold mb-4">Update Package</h2>

      {/* Title */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Subscription Period</label>
        <input
          {...register("title", { required: "Subscription Period is required" })}
          placeholder="Enter Subscription Period"
          className="border w-full p-2 rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Enter description"
          className="border w-full p-2 rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Features */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Features</label>
        {fields.map((field, index) => (

          <div key={field.id} className="flex items-center mb-2 gap-2">
            <input
              {...register(`features.${index}.value`, {
                required: "Feature is required",
              })}
              placeholder={`Feature ${index + 1}`}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add Feature
        </button>
      </div>

      {/* Monthly Base Price */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Monthly Base Price</label>
        <input
          type="number"
          {...register("monthlyBasePrice", {
            required: "Monthly base price is required",
          })}
          placeholder="Enter monthly base price"
          className="border w-full p-2 rounded"
        />
      </div>
      {/* Price */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Price</label>
        <input
          type="number"
          {...register("price", { required: "Price is required" })}
          placeholder="Enter price"
          className="border w-full p-2 rounded"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      {/* Discount Percentage */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Last Price</label>
        <input
          type="number"
          {...register("discountPercentage", {
            required: "Discount percentage is required",
          })}
          placeholder="Enter discount percentage"
          className="border w-full p-2 rounded"
        />
      </div>

      {/* Duration */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Duration</label>
        <select
          {...register("duration", { required: "Duration is required" })}
          className="border w-full p-2 rounded"
        >
          <option value="">Select duration</option>
          <option value="1 month">1 month</option>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
          <option value="1.5 year">1.5 year</option>
        </select>
      </div>

      {/* Payment Type */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Payment Type</label>
        <select
          {...register("paymentType", { required: "Payment type is required" })}
          className="border w-full p-2 rounded"
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Subscription Type */}
      {/* <div className="mb-3">
        <label className="block font-medium mb-1">Subscription Type</label>
        <select
          {...register("subscriptionType", {
            required: "Subscription type is required",
          })}
          className="border w-full p-2 rounded"
        >
          <option value="app">App</option>
          <option value="web">Web</option>
        </select>
      </div> */}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Update Package
      </button>
    </form>
  );
};

export default UpdatePackageForm;

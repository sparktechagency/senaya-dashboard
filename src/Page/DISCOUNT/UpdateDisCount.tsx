import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAllPackageQuery,
  useGetSingleDiscountQuery,
  useUpdateDiscountMutation,
} from "../../redux/feature/Package";

interface DiscountFormData {
  code: string;
  package: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
}

const UpdateDiscount: React.FC = () => {
  const { id } = useParams(); // ✅ use id
  const navigate = useNavigate();

  const { data: allPackageData } = useGetAllPackageQuery(undefined);
  const allPackage = allPackageData?.data?.packages;

  const { data: discountData, isLoading: isLoadingDiscount } =
    useGetSingleDiscountQuery(id!);

  const [updateDiscount, { isLoading: isUpdating }] =
    useUpdateDiscountMutation();

  const { register, handleSubmit, reset } = useForm<DiscountFormData>({
    defaultValues: {
      code: "",
      package: "",
      discountType: "Percentage",
      discountValue: 0,
      startDate: "",
      endDate: "",
      usageLimit: 1,
      name: "",
      usedCount: 0,
      description: "",
      isActive: true,
      isDeleted: false,
    },
  });

  useEffect(() => {
    if (discountData?.data) {
      const d = discountData.data;
      reset({
        code: d.code,
        package: d.package?._id || "",
        discountType: d.discountType,
        discountValue: d.discountValue,
        startDate: new Date(d.startDate).toISOString().split("T")[0],
        endDate: new Date(d.endDate).toISOString().split("T")[0],
        usageLimit: d.usageLimit,
        name: d.name,
        usedCount: d.usedCount,
        description: d.description,
        isActive: d.isActive,
        isDeleted: d.isDeleted,
      });
    }
  }, [discountData, reset]);

const onSubmit = async (formData: DiscountFormData) => {
  try {
    const payload = {
      ...formData,
      package: formData.package || undefined, 
    };

    await updateDiscount({ code: discountData?.data?.code, data: payload }).unwrap();
    toast.success("Discount updated successfully!");
    navigate("/admin/cupon");
  } catch (err: any) {
    toast.error(err?.data?.message || "Failed to update discount");
  }
};


  if (isLoadingDiscount) return <p>Loading discount...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Update Discount</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("code")} placeholder="Code" className="w-full p-2 border rounded" />
        <select {...register("package")} className="w-full p-2 border rounded" defaultValue="">
          <option value="" disabled>Select Package</option>
          {allPackage?.map((pkg: any) => (
            <option key={pkg._id} value={pkg._id}>{pkg.title}</option>
          ))}
        </select>
        <input {...register("discountValue", { valueAsNumber: true })} type="number" placeholder="Discount Value" className="w-full p-2 border rounded" />
        <input {...register("startDate")} type="date" className="w-full p-2 border rounded" />
        <input {...register("endDate")} type="date" className="w-full p-2 border rounded" />
        <input {...register("usageLimit", { valueAsNumber: true })} type="number" placeholder="Usage Limit" className="w-full p-2 border rounded" />
        <input {...register("name")} placeholder="Name" className="w-full p-2 border rounded" />
        <textarea {...register("description")} placeholder="Description" className="w-full p-2 border rounded" />
        <label className="flex items-center space-x-2">
          <input {...register("isActive")} type="checkbox" />
          <span>Is Active</span>
        </label>
        <button type="submit" disabled={isUpdating} className="w-full bg-blue-500 text-white p-2 rounded">
          {isUpdating ? "Updating..." : "Update Discount"}
        </button>
      </form>
    </div>
  );
};

export default UpdateDiscount;

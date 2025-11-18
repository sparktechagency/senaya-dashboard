import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useCreateDiscountMutation,
  useGetAllPackageQuery,
} from "../../redux/feature/Package";
import { useNavigate } from "react-router";

interface DiscountFormData {
  code: string;
  package: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount:number,
  name: string;
  description: string;
  isActive: boolean;
  isDeleted:boolean,
}

const CreateDiscount: React.FC = () => {
  const { data: AllPackage } = useGetAllPackageQuery(undefined);
  const navigate = useNavigate()
  const allPackage = AllPackage?.data?.packages;

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
      usedCount:0,
      description: "",
      isActive: true,
      isDeleted:false
    },
  });

  const [createDiscount, { isLoading }] = useCreateDiscountMutation();

  const onSubmit = async (data: DiscountFormData) => {
    try {
      await createDiscount(data).unwrap();
      toast.success("Discount created successfully!");
      reset();
      navigate("/admin/cupon")
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create discount");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Create Discount</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("code")}
          placeholder="Code"
          className="w-full p-2 border rounded"
        />
        <select
          {...register("package")}
          className="w-full p-2 border rounded"
          defaultValue=""
        >
          <option value="" disabled>
            Select Package
          </option>
          {allPackage?.map((pkg: any) => (
            <option key={pkg._id} value={pkg._id}>
              {pkg.title} 
            </option>
          ))}
        </select>

        <input
          {...register("discountValue", { valueAsNumber: true })}
          placeholder="Discount Value"
          type="number"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("startDate")}
          type="date"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("endDate")}
          type="date"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("usageLimit", { valueAsNumber: true })}
          placeholder="Usage Limit"
          type="number"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <label className="flex items-center space-x-2">
          <input {...register("isActive")} type="checkbox" />
          <span>Is Active</span>
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isLoading ? "Creating..." : "Create Discount"}
        </button>
      </form>
    </div>
  );
};

export default CreateDiscount;

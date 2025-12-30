import { useForm, useFieldArray } from "react-hook-form";
import { useCreatePackageMutation } from "../../redux/feature/Package";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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

const CreatePackageForm = () => {
  const [createPackage] = useCreatePackageMutation();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
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

  // ✅ Proper typing for useFieldArray
  const { fields, append, remove } = useFieldArray<
    PackageFormData,
    "features",
    "id"
  >({
    control,
    name: "features",
  });

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
      const result = await createPackage(finalData).unwrap();
      if (result.success) {
        toast.success("Package Create Successfully")
        navigate("/admin/package")
      }
    } catch (error) {
      toast.error("Can not create Package");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-semibold mb-4">Create Package</h2>

      {/* Title */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Subscription Period</label>
        <input
          {...register("title", { required: true })}
          placeholder="Enter Subscription Period"
          className="border w-full p-2 rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">Subscription Period is required</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          {...register("description", { required: true })}
          placeholder="Enter description"
          className="border w-full p-2 rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">Description is required</p>
        )}
      </div>

      {/* Features */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Features</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center mb-2 gap-2">
            <input
              {...register(`features.${index}.value` as const, {
                required: true,
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
            required: true,
            valueAsNumber: true,
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
          {...register("price", { required: true, valueAsNumber: true })}
          placeholder="Enter price"
          className="border w-full p-2 rounded"
        />
      </div>
      {/* Discount Percentage */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Last Price</label>
        <input
          type="number"
          {...register("discountPercentage", {
            required: true,
            valueAsNumber: true,
          })}
          placeholder="Enter discount percentage"
          className="border w-full p-2 rounded"
        />
      </div>

      {/* Duration */}
      <div className="mb-3">
        <select
          {...register("duration", { required: true })}
          className="border w-full p-2 rounded"
        >
          <option value="">Select duration</option>
          <option value="1 month">1 month</option>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
          <option value="1.5 year">1.5 year</option>
        </select>
        {errors.duration && (
          <p className="text-red-500 text-sm">Duration is required</p>
        )}
      </div>

      {/* Payment Type */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Payment Type</label>
        <select
          {...register("paymentType", { required: true })}
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
          {...register("subscriptionType", { required: true })}
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
        Create Package
      </button>
    </form>
  );
};

export default CreatePackageForm;

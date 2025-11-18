import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetSingleImageQuery,
  useUpdateImageMutation,
} from "../../redux/feature/adminApi";

interface FormData {
  title: string;
  description: string;
  image: FileList | undefined;
  type: string;
}

const UpdateImage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading: isFetching } = useGetSingleImageQuery(id!);

  const [updateImage, { isLoading, isSuccess, isError }] =
    useUpdateImageMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Prefill form with fetched data
  useEffect(() => {
    if (data?.data) {
      setValue("title", data.data.title || "");
      setValue("description", data.data.description || "");
      setValue("type", data.data.type || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData: FormData) => {
    if (!id) {
      toast.error("Invalid image ID");
      return;
    }

    try {
      const updatedData = new FormData();
      updatedData.append(
        "data",
        JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
        })
      );

      if (formData.image && formData.image.length > 0) {
        updatedData.append("image", formData.image[0]);
      }

      await updateImage({ id: id as string, payload: updatedData }).unwrap();

      toast.success("Image updated successfully!");
      navigate("/admin/carmodel");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update image");
    }
  };

  // ✅ Handle case when id is undefined
  if (!id) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-red-500">
        Invalid image ID
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading image details...
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
          Update Image
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter title"
              {...register("title", { required: "Title is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type
            </label>
            <select
              {...register("type", { required: "Type is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Type</option>
              <option value="car_symbol">Car Symbol</option>
              <option value="website_logo">Website Logo</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs">{errors.type.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Upload New Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md flex justify-center items-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {isLoading ? "Updating..." : "Update Image"}
          </motion.button>

          {isSuccess && (
            <p className="text-green-500 text-center mt-2">Image updated!</p>
          )}
          {isError && (
            <p className="text-red-500 text-center mt-2">
              Failed to update image
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateImage;

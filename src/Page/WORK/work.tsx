import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  useCreateWorkMutation,
  useWorkCategoryQuery,
} from "../../redux/feature/work";
import { useNavigate } from "react-router";

interface ITitleObj {
  ar: string;
  bn: string;
  ur: string;
  hi: string;
  ti: string;
  en: string;
}

interface IFormInput {
  titleObj: ITitleObj;
  workCategoryName: string;
  code: string;
}

const CreateWorkForm: React.FC = () => {
  const [createSpare] = useCreateWorkMutation();
  const {
    data: workCategory,
    isLoading,
    isError,
    refetch,
  } = useWorkCategoryQuery(undefined);

  const workCATEGORY = workCategory?.data;

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<IFormInput>({
    defaultValues: {
      titleObj: { ar: "", bn: "", ur: "", hi: "", ti: "", en: "" },
      workCategoryName: "",
      code: "",
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      await createSpare(data).unwrap();
      toast.success("Data submitted successfully!");
      navigate("/admin/workList");
      reset();
    } catch (error: any) {
      toast.error("Failed to submit data.");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-6  rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add New Work Part
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
        {/* Title fields */}
        {(["ar", "bn", "ur", "hi", "ti", "en"] as (keyof ITitleObj)[]).map(
          (lang) => (
            <div key={lang} className="flex flex-col">
              <label className="mb-1 font-medium">{`Title (${lang.toUpperCase()})`}</label>
              <input
                {...register(`titleObj.${lang}`)}
                className="border bg-white/20 rounded-lg p-2 focus:outline-none focus:ring-2 "
                placeholder={`Enter title in ${lang.toUpperCase()}`}
              />
            </div>
          )
        )}

        {/* Work Category Name */}
        {/* Work Category Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Work Category Name</label>

          <select
            {...register("workCategoryName")}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2"
            disabled={isLoading}
          >
            <option value="">
              {isLoading ? "Loading categories..." : "Select Work Category"}
            </option>

            {workCATEGORY?.map((item: any) => (
              <option key={item._id} value={item._id}>
                {item.workCategoryName}
              </option>
            ))}
          </select>

          {isError && (
            <p className="text-red-500 text-sm mt-1">
              Failed to load categories!
            </p>
          )}
        </div>

        {/* Code */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Code</label>
          <input
            {...register("code")}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 "
            placeholder="Enter code"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="mt-3 py-3 bg-linear-to-r w-full from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-pink-400/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateWorkForm;

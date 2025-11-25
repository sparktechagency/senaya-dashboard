import React, { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/feature/authApi";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await login(data).unwrap();

      if (res.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        window.dispatchEvent(new Event('authChange'));

        toast.success("Logged in Successfully");
        navigate("/admin/profile");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Welcome Back </h2>
          <p className="text-gray-500 mt-1 text-sm">Please login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Contact Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact</label>
            <input
              type="text"
              placeholder="Enter Contact Number"
              {...register("contact", { required: "Contact is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{String(errors.contact.message)}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:border-transparent pr-10 transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          {/* Submit Button */}


          {/* Submit/Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-6 
          rounded-lg font-semibold shadow-md text-white transition duration-300 
          ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <>
                <LogIn size={18} /> Login
              </>
            )}
          </motion.button>


        </form>
      </motion.div>
    </div>
  );
};

export default Login;
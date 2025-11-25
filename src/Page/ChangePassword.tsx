import React, { useState } from "react";
import { motion } from "framer-motion";
// Ant Design-এর 'message' কম্পোনেন্টটি ব্যবহার করা হয়েছে
import { message } from "antd";
// Lucide-এর আইকনগুলো ব্যবহার করা হয়েছে
import { Eye, EyeOff } from "lucide-react"; 
import { useChangePasswordMutation } from "../redux/feature/authApi";
import { useNavigate } from "react-router";

const ChangePassword: React.FC = () => {
    // পাসওয়ার্ডগুলির জন্য State (অবস্থা)
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // পাসওয়ার্ড দেখানোর জন্য State
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    // পাসওয়ার্ড মিল না হওয়ার ত্রুটির জন্য State
    const [passwordMatchError, setPasswordMatchError] = useState("");

    // Redux Toolkit Query থেকে Mutation Hook ব্যবহার করা হয়েছে
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const navigate = useNavigate();

    // ফর্ম সাবমিট হ্যান্ডলার
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMatchError(""); // প্রতিবার সাবমিটে ত্রুটি বার্তা রিসেট করা

        // ১. ক্লায়েন্ট-সাইড ভ্যালিডেশন: কোনো ফিল্ড ফাঁকা আছে কি না পরীক্ষা
        if (!oldPassword || !newPassword || !confirmPassword) {
            return message.error("All fields are required");
        }

        // ২. ক্লায়েন্ট-সাইড ভ্যালিডেশন: নতুন পাসওয়ার্ড কনফার্ম পাসওয়ার্ডের সাথে মেলে কি না পরীক্ষা
        if (newPassword !== confirmPassword) {
            setPasswordMatchError("New Password and Confirm Password do not match");
            return message.error("New Password and Confirm Password do not match");
        }

        // API কল করা এবং ত্রুটি হ্যান্ডলিং
        try {
            const result = await changePassword({
                oldPassword,
                newPassword
            }).unwrap();

            // ৩. API থেকে সফল উত্তর এলে
            if (result.success) {
                message.success("Password changed successfully!", 1.5);
                
                // সফল হলে ইনপুট ফিল্ডগুলো পরিষ্কার করা
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");

                // ১.৫ সেকেন্ড পর ইউজারকে লগইন পেজে নিয়ে যাওয়া
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                // ৪. API সফল হলেও লজিক্যাল ব্যর্থতা (যেমন: পুরানো পাসওয়ার্ড ভুল)
                message.error(result.message || "Failed to change password");
            }
        } catch (err: any) {
            console.error("Change password error:", err);

            // ৫. নেটওয়ার্ক বা সার্ভার ত্রুটি (Status Code Error) হ্যান্ডলিং
            const errorMessage =
                err?.data?.message ||
                err?.error?.message ||
                err?.message ||
                "Failed to change password. Please try again.";

            message.error(errorMessage, 3); // ত্রুটি বার্তা ৩ সেকেন্ডের জন্য দেখানো
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Change Password</h2>

                <div className="flex flex-col gap-4">
                    {/* Old Password Input */}
                    <div className="relative">
                        <input
                            type={showOld ? "text" : "password"}
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {/* Show/Hide Toggle */}
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowOld(!showOld)}
                        >
                            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {/* New Password Input */}
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {/* Show/Hide Toggle */}
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowNew(!showNew)}
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {/* Show/Hide Toggle */}
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {/* Password Mismatch Error Message */}
                    {passwordMatchError && (
                        <p className="text-red-500 text-sm">{passwordMatchError}</p>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold shadow-md transition duration-300 ${isLoading
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
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
                            "Change Password"
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
import { motion } from "framer-motion";
import { message } from "antd";
import { Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "../redux/feature/authApi";
import { useNavigate } from "react-router";
import { useState } from "react";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwordMatchError, setPasswordMatchError] = useState("");

    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setPasswordMatchError("");

        // Empty field validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            return message.error("All fields are required");
        }

        // Confirm password check (only frontend)
        if (newPassword !== confirmPassword) {
            setPasswordMatchError("New Password and Confirm Password do not match");
            return message.error("New Password and Confirm Password do not match");
        }
 
        try {
          
            const result = await changePassword({
                currentPassword: oldPassword,
                newPassword: newPassword,    
                confirmPassword: confirmPassword,
            }).unwrap();

            if (result.success) {
                message.success("Password changed successfully!");

                // Reset fields
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => navigate("/login"), 1500);
            } else {
                message.error(result.message || "Failed to change password");
            }
        } catch (err: any) {
            // If backend sends validation array error
            if (err?.data?.error) {
                err.data.error.forEach((e: any) => message.error(e.message));
            } else {
                message.error(err?.data?.message || "Failed to change password");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Change Password</h2>

                <div className="flex flex-col gap-4">

                    {/* Old Password */}
                    <div className="relative">
                        <input
                            type={showOld ? "text" : "password"}
                            placeholder="Current Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="border rounded-md p-3 w-full"
                        />
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowOld(!showOld)}
                        >
                            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border rounded-md p-3 w-full"
                        />
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowNew(!showNew)}
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {/* Confirm Password (frontend only) */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border rounded-md p-3 w-full"
                        />
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {passwordMatchError && (
                        <p className="text-red-500 text-sm">{passwordMatchError}</p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className={`w-full py-2 rounded-lg text-white font-semibold shadow-md ${
                            isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {isLoading ? "Processing..." : "Change Password"}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;

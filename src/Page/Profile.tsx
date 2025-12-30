import React, { useState } from "react";
import { Loader2, Mail, Phone, Shield, CheckCircle, Edit } from "lucide-react";
import { useGetProfileQuery } from "../redux/feature/authApi";
import { useUpdateAdminMutation } from "../redux/feature/authApi";
import { toast } from "react-toastify";
import { Link } from "react-router";

const languages = ["en", "bn", "ar", "ur", "hi", "tl"];

const Profile: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetProfileQuery(undefined);
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

  const [editMode, setEditMode] = useState(false);
  const [nationality, setNationality] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center text-5xl  text-red-500 font-semibold mt-10">
        Failed to load profile data.
      </div>
    );
  }

  const profile = data.data;

  const handleEdit = () => {
    setNationality(profile.nationality || "");
    setPreferredLanguage(profile.preferredLanguage || "en");
    setEditMode(true);
  };

  // 🔵 IMAGE UPLOAD HANDLER
  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("image", file);
  //   console.log("fileeeeeeeee", file);

  //   try {
  //     await updateAdmin({
  //       id: profile._id,
  //       updates: formData,
  //       isFormData: true,
  //     }).unwrap();

  //     toast.success("Profile image updated!");
  //     refetch();
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to update image");
  //   }
  // };

  const handleSave = async () => {
    try {
      await updateAdmin({
        id: profile._id,
        updates: { nationality, preferredLanguage },
      }).unwrap();

      toast.success("Profile updated successfully!");
      setEditMode(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-24"></div>

      <div className="px-6 py-6">
        {/* Name & Role */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.name}
          </h2>
          <p className="text-sm text-gray-500 capitalize">{profile.role}</p>

          {profile.verified && (
            <div className="flex justify-center items-center gap-1 text-green-600 text-sm mt-1">
              <CheckCircle size={16} /> Verified Account
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 mt-4">
          {!editMode && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
            >
              <Edit size={16} /> Edit Profile
            </button>
          )}

          <Link
            to="change-password"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow"
          >
            Change Password
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Mail size={18} />
            </div>
            <span>{profile.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Phone size={18} />
            </div>
            <span>{profile.contact}</span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Shield size={18} />
            </div>
            <span>
              Status: <span className="font-semibold">{profile.status}</span>
            </span>
          </div>
        </div>

        {/* Nationality & Language */}
        <div className="mt-6 text-gray-700 ">
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className=" text-sm font-medium text-white ">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-300 border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="mt-1 w-full rounded-lg border p-2"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {profile.nationality && (
                <div>Nationality: {profile.nationality}</div>
              )}
              {profile.preferredLanguage && (
                <div>
                  Language: {profile.preferredLanguage.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-500 mt-6 text-center">
          Created: {new Date(profile.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );

};

export default Profile;

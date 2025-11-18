import React, { useState } from "react";
import { Loader2, User, Mail, Phone, Shield, CheckCircle, Edit, Check, X } from "lucide-react";
import { useGetProfileQuery } from "../redux/feature/authApi";
import { useUpdateAdminMutation } from "../redux/feature/authApi";
import { toast } from "react-toastify";

const languages = ["en", "bn", "ar", "ur", "hi", "tl"];

const Profile: React.FC = () => {
  const { data, isLoading, isError } = useGetProfileQuery(undefined);
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

  const handleSave = async () => {
    try {
      await updateAdmin({ id: profile._id, updates: { nationality, preferredLanguage } }).unwrap();
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white h-32"></div>

      <div className="relative px-6 pb-8 -mt-16">
        <div className="flex flex-col items-center">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center shadow-md">
              <User className="w-12 h-12 text-gray-500" />
            </div>
          )}
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.role}</p>

          {profile.verified && (
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <CheckCircle size={16} /> Verified Account
            </div>
          )}

      
          {!editMode && (
            <button
              onClick={handleEdit}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
            >
              <Edit size={16} /> Edit Profile
            </button>
          )}
        </div>

        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 text-white shadow-md">
              <Mail size={18} />
            </div>
            <span className="text-sm md:text-base">{profile.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-linear-to-tr from-green-500 to-emerald-600 text-white shadow-md">
              <Phone size={18} />
            </div>
            <span className="text-sm md:text-base">{profile.contact}</span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
              <Shield size={18} />
            </div>
            <span className="text-sm md:text-base">
              Status: <span className="font-semibold capitalize">{profile.status}</span>
            </span>
          </div>

          {/* Nationality & Preferred Language */}
          <div className="mt-4">
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 flex items-center gap-1"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check size={16} /> {isUpdating ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {profile.nationality && <div>Nationality: {profile.nationality}</div>}
                {profile.preferredLanguage && <div>Preferred Language: {profile.preferredLanguage.toUpperCase()}</div>}
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="text-sm text-gray-500 mt-4">
            Created: {new Date(profile.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

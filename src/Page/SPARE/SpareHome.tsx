import React, { useState } from "react";
import { Upload, FileSpreadsheet, ClipboardEdit } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateWorkByFileMutation } from "../../redux/feature/work";
import CreateSpare from "./SpareCreate";

const SpareFromOrFileUpload: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"form" | "file">("form");
  const [uploadFile] = useCreateWorkByFileMutation();

  // Handle Excel file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      toast.error("Please upload a valid Excel (.xlsx) file");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    try {
      const result = await uploadFile(formData);
      if ("data" in result && result.data?.success) {
        toast.success(`File "${file.name}" uploaded successfully!`);
      } else if ("error" in result) {
        toast.error("File upload failed! Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during upload!");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Spare Data</h2>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition 
            ${
              activeTab === "form"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
        >
          <ClipboardEdit size={18} />
          Use Form
        </button>
        <button
          onClick={() => setActiveTab("file")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition 
            ${
              activeTab === "file"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
        >
          <FileSpreadsheet size={18} />
          Upload Excel File
        </button>
      </div>

      {/* Conditional Rendering */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {activeTab === "form" ? (
          <CreateSpare />
        ) : (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-blue-300 rounded-xl">
            <Upload size={48} className="text-blue-500 mb-4" />
            <p className="text-gray-600 mb-4 text-center">
              Upload an Excel (.xlsx) file to import work data in bulk
            </p>
            <label className="bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
              Choose File
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpareFromOrFileUpload;
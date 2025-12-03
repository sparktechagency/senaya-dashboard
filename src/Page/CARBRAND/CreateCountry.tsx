import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useAllCountryQuery,
  useCreateCountryMutation,
  useDeleteCountryMutation,
} from "../../redux/feature/adminApi";

export const CreateCountry = () => {
  const [countryName, setCountryName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // for resetting file input
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [createCountry, { isLoading: creating }] = useCreateCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();

  const { data: countries } = useAllCountryQuery(undefined);

  console.log("countries", countries)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryName || !image) {
      toast.error("Please provide country name and image");
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify({ title: countryName }));
    formData.append("image", image);

    try {
      await createCountry(formData).unwrap();
      toast.success("Country created successfully");

      // Reset states
      setCountryName("");
      setImage(null);
      setFileInputKey(Date.now()); // Reset file input
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create country");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this country?")) return;

    try {
      setDeletingId(id);
      await deleteCountry(id).unwrap();
      toast.success("Country deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete country");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Countries</h2>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-10"
      >
        <input
          type="text"
          placeholder="Country Name"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          className="p-3 border rounded-md w-full sm:w-64 focus:outline-blue-500"
        />

        {/* Image Uploader */}
        <label className="w-full sm:w-64 cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-md px-4 py-2 flex flex-col items-center justify-center hover:border-blue-500 transition">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="text-center">
                <div className="text-gray-400 text-3xl mb-2">📁</div>
                <p className="text-gray-500 text-sm">Click to upload image</p>
              </div>
            )}
          </div>

          <input
            key={fileInputKey} // important to reset input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          disabled={creating}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </form>

      {/* Country List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries?.data?.map((country: any) => (
          <div
            key={country._id}
            className="bg-white rounded-xl shadow-md overflow-hidden relative hover:shadow-xl transition group"
          >
            {/* Image */}
            {country.image && (
              <img
                src={`http://10.10.7.103:7010/${country.image}`}
                alt={country.title}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Title and Delete */}
            <div className="flex justify-between items-center px-4 pb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {country.title}
              </h3>

              <button
                onClick={() => handleDelete(country._id)}
                disabled={deletingId === country._id}
                className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition"
              >
                {deletingId === country._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

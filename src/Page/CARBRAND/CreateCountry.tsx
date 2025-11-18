import React, { useState } from "react";
import {
  useAllCountryQuery,
  useCreateCountryMutation,
  useDeleteCountryMutation,
} from "../../redux/feature/adminApi";
import { toast } from "react-toastify";

export const CreateCountry = () => {
  const [countryName, setCountryName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [createCountry, { isLoading: creating }] = useCreateCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();
  const { data: countries } = useAllCountryQuery(undefined);

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
      setCountryName("");
      setImage(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create country");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this country?")) return;
    try {
      await deleteCountry(id).unwrap();
      toast.success("Country deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete country");
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="p-3 border rounded-md w-full sm:w-64"
        />

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
            className="bg-white rounded-xl shadow-md overflow-hidden relative hover:shadow-xl transition"
          >

            {/* Image */}
            {country.image && (
              <img
                src={`https://api.senaeya.net${country.image}`}
                alt={country.title}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Title */}
            <div className="p-4 text-center flex justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{country.title}</h3>
                  {/* Delete Button */}
            <button
              onClick={() => handleDelete(country._id)}
              className=" top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
            >
              Delete
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

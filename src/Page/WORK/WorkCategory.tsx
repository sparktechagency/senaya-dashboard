import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateWorkCategoryMutation,
  useWorkCategoryQuery,
  useDeleteWorkCategoryMutation,
} from "../../redux/feature/work";

interface ILocaleObject {
  ar: string;
  bn: string;
  ur: string;
  hi: string;
  tl: string;
  en: string;
}

export const CreateWorkCategory: React.FC = () => {
  const [titleObj, setTitleObj] = useState<ILocaleObject>({
    ar: "", bn: "", ur: "", hi: "", tl: "", en: "",
  });

  const [descriptionObj, setDescriptionObj] = useState<ILocaleObject>({
    ar: "", bn: "", ur: "", hi: "", tl: "", en: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: workCategory } = useWorkCategoryQuery(undefined);
  const workCATEGORY = workCategory?.data;


  const [createWork, { isLoading: creating }] = useCreateWorkCategoryMutation();
  const [deleteWork] = useDeleteWorkCategoryMutation();

  // Handle title & description change
  const handleTitleChange = (lang: keyof ILocaleObject, value: string) => {
    setTitleObj((prev) => ({ ...prev, [lang]: value }));
  };
  const handleDescriptionChange = (lang: keyof ILocaleObject, value: string) => {
    setDescriptionObj((prev) => ({ ...prev, [lang]: value }));
  };

  // Create or update work
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image && !editingId) return toast.error("Please upload image");

    const formData = new FormData();
    formData.append("data", JSON.stringify({ titleObj, descriptionObj }));
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        // Update logic
        await createWork({ id: editingId, formData }).unwrap();
        toast.success("Work updated successfully");
      } else {
        // Create logic
        await createWork(formData).unwrap();
        toast.success("Work created successfully");
      }

      // Reset form
      setImage(null);
      setTitleObj({ ar: "", bn: "", ur: "", hi: "", tl: "", en: "" });
      setDescriptionObj({ ar: "", bn: "", ur: "", hi: "", tl: "", en: "" });
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create/update work");
    }
  };

  // Delete work
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this work?")) return;

    try {
      setDeletingId(id);
      await deleteWork(id).unwrap();
      toast.success("Work deleted successfully");
    } catch (err) {
      toast.error("Failed to delete work");
    } finally {
      setDeletingId(null);
    }
  };

  // Edit work
  // const handleEdit = (item: any) => {
  //   setEditingId(item._id);
  //   setTitleObj(item.titleObj || { ar:"", bn:"", ur:"", hi:"", tl:"", en:"" });
  //   setDescriptionObj(item.descriptionObj || { ar:"", bn:"", ur:"", hi:"", tl:"", en:"" });
  //   setImage(null);
  // };

  return (
    <div className="max-w-7xl mx-auto mt-12 p-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        {editingId ? "Edit Work" : "Create Work"}
      </h2>

      {/* Form */}
      <div className="bg-white shadow-lg rounded-2xl p-8 mb-14 border">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Title */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl text-gray-700 border-b pb-2">
              📝 Title (Multi-language)
            </h3>
            {(Object.keys(titleObj || {}) as (keyof ILocaleObject)[]).map((lang) => (
              <div key={lang}>
                <label className="text-sm text-gray-500 ml-1 font-medium">
                  Title ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  placeholder={`Enter title in ${lang}`}
                  value={titleObj[lang]}
                  onChange={(e) => handleTitleChange(lang, e.target.value)}
                  className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl text-gray-700 border-b pb-2">
              📝 Description (Multi-language)
            </h3>
            {(Object.keys(descriptionObj || {}) as (keyof ILocaleObject)[]).map((lang) => (
              <div key={lang}>
                <label className="text-sm text-gray-500 ml-1 font-medium">
                  Description ({lang.toUpperCase()})
                </label>
                <textarea
                  placeholder={`Enter description in ${lang}`}
                  value={descriptionObj[lang]}
                  onChange={(e) => handleDescriptionChange(lang, e.target.value)}
                  className="mt-1 p-3 border rounded-lg w-full h-24 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                ></textarea>
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <label htmlFor="imageUpload" className="md:col-span-2 cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-md px-4 py-4 flex flex-col items-center justify-center hover:border-blue-500 transition">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" className="w-48 h-48 object-cover rounded-full" />
              ) : (
                <div className="text-center">
                  <div className="text-gray-400 text-3xl mb-2">📁</div>
                  <p className="text-gray-500 text-sm">Click to upload image</p>
                </div>
              )}
            </div>
          </label>
          <input id="imageUpload" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="hidden" />

          <button type="submit" disabled={creating} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition md:col-span-2 shadow-md">
            {creating ? "Processing..." : editingId ? "Update Work" : "Create Work"}
          </button>
        </form>
      </div>

      {/* Work Table */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800">All Works</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">Image</th>
              <th className="px-4 py-3 border">Title (EN)</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {workCATEGORY?.map((item: any) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">

                <td className="px-4 py-3 border text-center">
                  {item.image && (
                    <img
                      src={`http://10.10.7.103:7010${item.image}`}
                      alt="Work"
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                  )}
                </td>

                <td className="px-4 py-3 border text-center">
                  {item?.title?.en}
                </td>

                <td className="px-4 py-3 border">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

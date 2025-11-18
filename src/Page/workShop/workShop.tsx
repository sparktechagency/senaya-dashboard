import  { useState } from "react";
import {
  Loader2,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle,
  Edit,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAllWorkShopQuery,
  useDeleteWorkShopMutation,
} from "../../redux/feature/adminApi";

const WorkShop = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteWorkShop, { isLoading: isDeleting }] =
    useDeleteWorkShopMutation();

  // ✅ Single API for all & search
  const {
    data: allData,
    isLoading,
    isError,
    refetch,
  } = useAllWorkShopQuery({ search: searchTerm });

  const { result = [], meta = {} } = allData?.data || {};


  const isSearchActive = searchTerm.length > 0;
  const isNoResult = isSearchActive && result.length === 0;

  // ✅ Delete Handler
  const handleDelete = async (id: string, name: string) => {
    const confirm = await Swal.fire({
      title: "Delete Workshop?",
      text: `Are you sure you want to delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      await deleteWorkShop(id).unwrap();
      refetch();
    }
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600">
        <Loader2 className="animate-spin mr-2" size={24} />
        Loading Workshops...
      </div>
    );
  }

  // ✅ Error State
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load workshop data ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Workshops</h1>
          <p className="text-gray-500 text-sm">
            Total {meta.total || result.length} workshops registered
          </p>
        </div>

        {/* Search Box */}
        <div className="flex items-center bg-white shadow-md rounded-xl px-4 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 outline-none border-none bg-transparent text-sm text-gray-700"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#1771B7] rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="p-3 bg-[#0F5C79] rounded-full text-white">
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Total Workshops</p>
            <h2 className="text-2xl font-bold text-white">
              {meta.total || result.length}
            </h2>
          </div>
        </div>

        <div className="bg-amber-800 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-900 rounded-full text-white">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Active Subscriptions</p>
            <h2 className="text-2xl font-bold text-white">
              {result.filter((w: any) => w.subscribedPackage).length}
            </h2>
          </div>
        </div>

        <div className="bg-[#6F42C1] rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="p-3 bg-[#5A2A91] rounded-full text-white">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Mobile Workshops</p>
            <h2 className="text-2xl font-bold text-white">
              {result.filter((w: any) => w.isAvailableMobileWorkshop).length}
            </h2>
          </div>
        </div>

        <div className="bg-[#F46236] rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="p-3 bg-[#D75727] rounded-full text-white">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Total Invoices</p>
            <h2 className="text-2xl font-bold text-white">
              {result.reduce(
                (sum: number, w: any) => sum + (w.generatedInvoiceCount || 0),
                0
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* Workshop Table */}
      <div className="bg-white shadow-md rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-indigo-600 text-white text-left">
            <tr>
              <th className="px-4 py-3">Serial</th>
              <th className="px-4 py-3">Workshop Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Subscription</th>
              <th className="px-4 py-3">Invoices</th>
              <th className="px-4 py-3">Nationality</th>
              <th className="px-4 py-3">Preferred Language</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isNoResult ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-red-500 font-semibold"
                >
                  No workshop found for this number
                </td>
              </tr>
            ) : result.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No Workshops Found
                </td>
              </tr>
            ) : (
              result.map((workshop: any, index: number) => (
                <tr
                  key={workshop._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {workshop.workshopNameEnglish}
                  </td>
                  <td className="px-4 py-3">{workshop.contact}</td>
                  <td className="px-4 py-3 line-clamp-1">{workshop.address}</td>
                  <td className="px-4 py-3">
                    {workshop.subscribedPackage ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {workshop.generatedInvoiceCount || 0}
                  </td>
                  <td className="px-4 py-3">
                    {workshop.nationality || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {workshop.preferredLanguage || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(workshop.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center gap-3">
                    <Link
                      to={`/UpdateWorkShop/${workshop._id}`}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(workshop._id, workshop.workshopNameEnglish)
                      }
                      disabled={isDeleting}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkShop;

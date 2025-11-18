import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useDeleteSubscriptionMutation,
  useGetAllSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../../redux/feature/Package";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Subscription {
  _id: string;
  price: number;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  package: {
    title: string;
    paymentType: string;
  };
  workshop?: {
    _id: string;
    workshopNameArabic: string;
    ownerId: {
      _id: string;
      name: string;
      contact: string;
    };
  };
}

interface EditData {
  id: string;
  currentPeriodEnd: Date;
}

const AllSubscription = () => {
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [editData, setEditData] = useState<EditData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, refetch } = useGetAllSubscriptionQuery({
    search: searchTerm,
  });
  console.log("Data", data);

  const subscriptions: Subscription[] = data?.data?.result || [];
  console.log(subscriptions);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center text-2xl">
        Failed to load subscriptions
      </p>
    );
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This subscription will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteSubscription(id).unwrap();
        toast.success("Subscription deleted successfully!");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete subscription!");
      }
    }
  };

  const handleEdit = (sub: Subscription) => {
    setEditData({
      id: sub._id,
      currentPeriodEnd: new Date(sub.currentPeriodEnd),
    });
  };

  const handleUpdate = async () => {
    if (!editData) return;

    try {
      await updateSubscription({
        id: editData.id,
        data: { currentPeriodEnd: editData.currentPeriodEnd },
      }).unwrap();
      toast.success("Subscription updated successfully!");
      setEditData(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update subscription!");
    }
  };

  return ( 
    <div className="p-6">
      {/* Search */}
      <div className="flex justify-between gap-4 items-center mb-4">
        <h2 className="font-semibold text-3xl">All Subscription</h2>
        <input
          type="text"
          placeholder="Search by Contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md mt-5">
        <table className="min-w-full divide-y divide-gray-200 text-sm border text-gray-700">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-4 py-2 text-center">S/N</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-center">Contact</th>
              <th className="px-4 py-2 text-center">Current Period Start</th>
              <th className="px-4 py-2 text-center">Current Period End</th>
              <th className="px-4 py-2 text-left">Payment Type</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub, index) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-left">{sub.package.title}</td>
                  <td className="px-4 py-2 text-right">${sub.price}</td>
                  <td className="px-4 py-2 text-center">
                    {sub?.workshop?.ownerId?.contact}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(sub.currentPeriodStart).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {sub.package.paymentType}
                  </td>
                  <td
                    className={`px-4 py-2 text-center font-semibold ${
                      sub.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {sub.status}
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-xl font-semibold mb-4">Update Subscription</h2>
            <label className="block mb-2 font-medium">Current Period End</label>
            <DatePicker
              selected={editData.currentPeriodEnd}
              onChange={(date: Date | null) => {
                if (date) setEditData({ ...editData, currentPeriodEnd: date });
              }}
              className="border w-full p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditData(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSubscription;

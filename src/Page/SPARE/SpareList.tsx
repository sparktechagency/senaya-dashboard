import React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useDeleteSpareMutation,
  useSpareListQuery,
} from "../../redux/feature/work";
import { Link } from "react-router";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { Button, Tooltip } from "antd";
import { FiDelete } from "react-icons/fi";
import Swal from "sweetalert2";

const SparePartsList: React.FC = () => {
  // Fetch all works/spare parts
  const { data, error, isLoading } = useSpareListQuery(undefined);
  const [deleteSpare, { isLoading: isDeleting }] = useDeleteSpareMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading spare parts...
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch spare parts");
    return (
      <div className="text-center text-red-500 mt-10 font-medium">
        Something went wrong while loading data.
      </div>
    );
  }

  const spareParts = data?.data?.result || [];
  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteSpare(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "The Spare  has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete the work.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-md p-5 mb-6">
        {/* Title */}
        <h2 className="text-2xl font-bold">🧰 Spare List</h2>

        {/* Create Button */}
        <Link to="/admin/createSpare" className="mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white bg-linear-to-tr from-blue-500 via-purple-600 to-pink-500 shadow-lg hover:shadow-pink-400/30 hover:scale-[1.03] transition-all duration-300">
            <MdOutlineCreateNewFolder className="text-lg" />
            <span>Create Spare</span>
          </button>
        </Link>
      </div>

      {spareParts.length === 0 ? (
        <p className="text-center text-gray-600">No spare parts found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
              <tr>
                <th className="py-3 px-4 border">Sirial</th>
                <th className="py-3 px-4 border">Item Name</th>
                <th className="py-3 px-4 border">Code</th>
                <th className="py-3 px-4 border">Type</th>
                <th className="py-3 px-4 border">Provider</th>
                <th className="py-3 px-4 border">Created At</th>
                <th className="py-3 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {spareParts.map((item: any, index: number) => (
                <tr
                  key={item._id}
                  className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="py-2 px-4 border text-center">{index + 1}</td>

                  <td className="py-2 px-4 text-center border">
                    {item.itemName || item.title?.en || "N/A"}
                  </td>
                  <td className="py-2 px-4 border text-center">{item.code}</td>
                  <td className="py-2 px-4 border text-center">
                    {item.type || "N/A"}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {item?.providerWorkShopId?.workshopNameEnglish || "N/A"}
                  </td>

                  <td className="py-2 px-4 border text-center">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-center py-2 border-b text-gray-500 text-sm">
                    <Tooltip title="Delete Work">
                      <Button
                        danger
                        icon={<FiDelete />}
                        shape="circle"
                        onClick={() => handleDelete(item._id)}
                        className={`hover:scale-110 text-center transition-all ${isDeleting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={isDeleting}
                      />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SparePartsList;
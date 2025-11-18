import React from "react";
import {
  useDeleteWorkMutation,
  useWorkListQuery,
} from "../../redux/feature/work";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { FiDelete } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const WorkListTable: React.FC = () => {
  const { data, isLoading, isError, refetch } = useWorkListQuery(undefined);
  const [deleteWork, { isLoading: isDeleting }] = useDeleteWorkMutation();

  if (isLoading)
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-5xl py-10 text-red-500">
        Failed to load work list!
      </div>
    );

  const works = data?.data?.result || [];

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
        await deleteWork(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "The work has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete the work.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl shadow-md p-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🧰 Work List
        </h2>

        <Link to="/admin/addWork" className="mt-3 sm:mt-0">
          <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-white bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 transition-all shadow-md hover:scale-105">
            <MdOutlineCreateNewFolder size={20} />
            Create Work
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 text-left border w-16">S/N</th>
              <th className="py-3 px-4 text-left border min-w-[180px]">
                English Title
              </th>
              <th className="py-3 px-4 text-left border min-w-[180px]">
                Bengali Title
              </th>
              <th className="py-3 px-4 text-left border w-[140px]">
                Category
              </th>
              <th className="py-3 px-4 text-left border w-[100px]">Type</th>
              <th className="py-3 px-4 text-left border w-[120px]">Code</th>
              <th className="py-3 px-4 text-left border w-[140px]">
                Created At
              </th>
              <th className="py-3 px-4 text-center border w-[100px]">Action</th>
            </tr>
          </thead>

          <tbody>
            {works.length > 0 ? (
              works.map((work: any, idx: number) => (
                <tr
                  key={work._id}
                  className={`transition-colors duration-150 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="py-3 px-4 border text-gray-700 text-center font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 border">{work.title?.en || "N/A"}</td>
                  <td className="py-3 px-4 border">{work.title?.bn || "N/A"}</td>
                  <td className="py-3 px-4 border">
                    {work.workCategoryName || "N/A"}
                  </td>
                  <td className="py-3 px-4 border capitalize">
                    {work.type || "N/A"}
                  </td>
                  <td className="py-3 px-4 border">{work.code || "N/A"}</td>
                  <td className="py-3 px-4 border text-gray-500 text-sm">
                    {new Date(work.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border text-center">
                    <Tooltip title="Delete Work">
                      <Button
                        danger
                        icon={<FiDelete />}
                        shape="circle"
                        onClick={() => handleDelete(work._id)}
                        className={`transition-all hover:scale-110 ${
                          isDeleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isDeleting}
                      />
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No work found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkListTable;

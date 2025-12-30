import React, { useState } from "react";
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
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const WorkListTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const allWorks = data?.data?.result || [];
  const total = allWorks.length;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Current page er data slice kore newa
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = allWorks.slice(startIndex, endIndex);

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

        // Jodi current page e kono data na thake, previous page e jawa
        if (currentWorks.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete the work.");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl shadow-md p-5 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🧰 Work List
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {total} works
          </p>
        </div>

        <Link to="/admin/addWork" className="mt-3 sm:mt-0">
          <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 transition-all shadow-md hover:scale-105">
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
                Arabic Title
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
            {currentWorks.length > 0 ? (
              currentWorks.map((work: any, idx: number) => (
                <tr
                  key={work._id}
                  className={`transition-colors duration-150 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                >
                  <td className="py-3 px-4 border text-gray-700 text-center font-medium">
                    {startIndex + idx + 1}
                  </td>
                  <td className="py-3 px-4 border">{work.title?.en || "N/A"}</td>
                  <td className="py-3 px-4 border">{work.title?.ar || "N/A"}</td>
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
                        className={`transition-all hover:scale-110 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(endIndex, total)}
            </span>{" "}
            of <span className="font-semibold text-gray-800">{total}</span> results
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500"
                }`}
            >
              <FiChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {renderPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all min-w-[40px] ${currentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500"
                        }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500"
                }`}
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkListTable;
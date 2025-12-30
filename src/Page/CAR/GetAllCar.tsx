import { Eye, Loader2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useAllCarQuery,
  useDeleteCarMutation,
} from "../../redux/feature/adminApi";

type MaybeObjWithTitle = { title?: string } | string | undefined | null;

const toTitle = (v: MaybeObjWithTitle, fallback = "-") =>
  v && typeof v === "object" ? v.title || fallback : v || fallback;

const Cars: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useAllCarQuery(undefined);
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();

  const handleDelete = async (carId: string) => {
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
        await deleteCar(carId).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Jodi current page e kono data na thake, previous page e jawa
        if (currentCars.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete car");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-5xl text-center mt-10">
        Something went wrong while fetching cars.
      </div>
    );
  }

  const allCars = data?.data?.result || data?.result || [];
  const total = allCars.length;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Current page er data slice kore newa
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = allCars.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
              🚗 Cars List
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Total: {total} cars
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">S/N</th>
              <th className="px-4 py-3 text-left font-semibold">Brand</th>
              <th className="px-4 py-3 text-left font-semibold">Model</th>
              <th className="px-4 py-3 text-left font-semibold">Year</th>
              <th className="px-4 py-3 text-center font-semibold">VIN</th>
              <th className="px-4 py-3 text-left font-semibold">Client Name</th>
              <th className="px-4 py-3 text-left font-semibold">Contact</th>
              <th className="px-4 py-3 text-left font-semibold">Car Type</th>
              <th className="px-4 py-3 text-left font-semibold">Plate Number</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCars.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500 italic">
                  No cars found.
                </td>
              </tr>
            ) : (
              currentCars.map((car: any, index: number) => {
                const brandTitle = toTitle(car?.brand?.title);
                const brandImage = `https://api.senaeya.net/${car.brand?.image}`;
                const modelTitle = toTitle(car.model);
                const year = String(car.year || "-");
                const vin = car.vin || "-";
                const clientName = toTitle(car.client?.clientId?.name);
                const carType = car.carType || "-";
                const contactNumber = car.client?.contact || "-";

                let plateNumber = "-";
                if (carType === "International") {
                  plateNumber = car.plateNumberForInternational || "-";
                } else if (carType === "Saudi") {
                  const number = car.plateNumberForSaudi?.numberEnglish || "-";
                  const english =
                    car.plateNumberForSaudi?.alphabetsCombinations[0] || "-";
                  plateNumber = `${number}-${english}`;
                }

                return (
                  <tr
                    key={car._id}
                    className={`border-b transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                  >
                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                      {startIndex + index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={brandImage}
                          alt={brandTitle}
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300"
                        />
                        <span className="font-medium text-gray-700">
                          {brandTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">{modelTitle}</td>
                    <td className="px-4 py-3 text-gray-700">{year}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{vin}</td>
                    <td className="px-4 py-3 text-gray-700">{clientName}</td>
                    <td className="px-4 py-3 text-gray-700">{contactNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{carType}</td>
                    <td className="px-4 py-3 text-gray-700">{plateNumber}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDelete(car._id)}
                          disabled={isDeleting}
                          className="flex items-center justify-center p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition disabled:opacity-60 hover:scale-110"
                          title="Delete"
                        >
                          {isDeleting ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>

                        <Link
                          to={`/carDetails/${car._id}`}
                          className="flex items-center justify-center p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition hover:scale-110"
                          title="View details"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
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
            of <span className="font-semibold text-gray-800">{total}</span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-500"
                }`}
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {renderPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all min-w-[40px] ${currentPage === page
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-500"
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
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-500"
                }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
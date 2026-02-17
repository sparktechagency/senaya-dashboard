import { Loader2, Trash2, ChevronLeft, ChevronRight, Edit } from "lucide-react";
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
  // const [searchTerm, setSearchTerm] = useState("");

  // Pass pagination parameters to the API query
  const { data, isLoading, isError } = useAllCarQuery({
    // search: searchTerm,
    page: currentPage,
    limit: itemsPerPage
  });

  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();


  const englishToArabicAlphabet = (value: string) => {
    const map: Record<string, string> = {
      A: "ا",
      B: "ب",
      J: "ج",
      D: "د",
      R: "ر",
      S: "س",
      X: "ص",
      T: "ط",
      E: "ع",
      G: "ق",
      K: "ك",
      L: "ل",
      M: "م",
      N: "ن",
      H: "هـ",
      V: "و",
      Y: "ي"
    };

    return value
      .toUpperCase()
      .split("")
      .map(char => map[char] ?? "")
      .join("");
  };

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

        // If current page has no data after deletion, go to previous page
        const carsOnPage = data?.data?.result?.length || 0;
        if (carsOnPage === 1 && currentPage > 1) {
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

  // Get data from API response
  const allCars = data?.data?.result || [];
  const meta = data?.data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  console.log("AllCars", allCars);
  console.log("Meta", meta);

  // Use server-side pagination data
  const total = meta.total;
  const totalPages = meta.totalPage;
  const startIndex = (meta.page - 1) * meta.limit;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
              🚗 Cars List
            </h2>

          </div>
          {/* Search Box */}
          {/* <div className="flex items-center bg-white shadow-md rounded-xl px-4 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by mobile number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="ml-2 outline-none border-none bg-transparent text-sm text-gray-700"
            />
          </div> */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow-md border border-gray-200">
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
            {allCars.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500 italic">
                  No cars found.
                </td>
              </tr>
            ) : (
              allCars.map((car: any, index: number) => {
                const brandTitle = toTitle(car?.brand?.title);
                const brandImage = `https://api.senaeya.net/${car.brand?.image}`;
                const modelTitle = toTitle(car.model);
                const year = String(car.year || "-");
                const vin = car.vin || "-";
                const clientName = toTitle(car.client?.clientId?.name);
                const CLIENTname = toTitle(car.client?.workShopNameAsClient);
                const clientType = car.client?.clientType || "-";
                const carType = car.carType || "-";
                const contactNumber = car.client?.contact || "-";

                let plateNumber = "-";
                if (carType === "International") {
                  plateNumber = car.plateNumberForInternational || "-";
                } else if (carType === "Saudi") {
                  const english =
                    car.plateNumberForSaudi?.alphabetsCombinations?.[0] || "-";

                  const arabicAlphabet =
                    english !== "-" ? englishToArabicAlphabet(english) : "-";

                  const numberEnglish =
                    car.plateNumberForSaudi?.numberEnglish || "-";

                  const numberArabic =
                    car.plateNumberForSaudi?.numberArabic || "-";

                  plateNumber = `${english}-${numberEnglish}  |  ${arabicAlphabet}-${numberArabic}`;

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
                    {
                      clientType === "WorkShop" ? (
                        <td className="px-4 py-3 text-gray-700">{CLIENTname}</td>
                      ) : (
                        <td className="px-4 py-3 text-gray-700">{clientName}</td>
                      )
                    }
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
                          <Edit size={16} />
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
            Showing page{" "}
            <span className="font-semibold text-gray-800">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {totalPages}
            </span>{" "}
            ({total} total results)
          </div>

          <div className="flex items-center gap-3">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg"
                }`}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            {/* Page Info */}
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">
              {currentPage} / {totalPages}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg"
                }`}
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useGetSingleWorkShopQuery } from "../../redux/feature/adminApi";
import "react-toastify/dist/ReactToastify.css";

const WorkShopDetails: React.FC = () => {
  const { workShopId } = useParams<{ workShopId: string }>();

  if (!workShopId) {
    return (
      <div className="flex justify-center  text-5xl items-center min-h-screen text-red-500 font-semibold">
        Invalid Workshop ID ❌
      </div>
    );
  }

  const { data, isLoading, isError } = useGetSingleWorkShopQuery(workShopId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600">
        <Loader2 className="animate-spin mr-2" size={24} />
        Loading Workshop Details...
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 font-semibold">
        Failed to load workshop details ❌
      </div>
    );
  }

  const workshop = data.data;

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border-t-8 border-indigo-500"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-4xl font-bold text-indigo-700 mb-2">{workshop.workshopNameEnglish}</h2>
          <p className="text-xl text-gray-600">{workshop.workshopNameArabic}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Location */}
          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner border-l-4 border-indigo-400">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">📍 Location</h3>
            <p className="text-gray-700">
              Latitude: <span className="font-medium">{workshop.workshopGEOlocation.coordinates[0]}</span>
            </p>
            <p className="text-gray-700">
              Longitude: <span className="font-medium">{workshop.workshopGEOlocation.coordinates[1]}</span>
            </p>
          </div>

          {/* Working Schedule */}
          <div className="bg-green-50 p-4 rounded-xl shadow-inner border-l-4 border-green-400">
            <h3 className="text-lg font-semibold text-green-700 mb-2">🕒 Working Schedule</h3>
            <p className="text-gray-700">
              From <span className="font-medium">{workshop.regularWorkingSchedule.startDay}</span> to{" "}
              <span className="font-medium">{workshop.regularWorkingSchedule.endDay}</span>
            </p>
            <p className="text-gray-700">
              Time: <span className="font-medium">{workshop.regularWorkingSchedule.startTime}</span> -{" "}
              <span className="font-medium">{workshop.regularWorkingSchedule.endTime}</span>
            </p>
          </div>

          {/* Ramadan Schedule */}
          <div className="bg-yellow-50 p-4 rounded-xl shadow-inner border-l-4 border-yellow-400">
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">🌙 Ramadan Schedule</h3>
            <p className="text-gray-700">
              From <span className="font-medium">{workshop.ramadanWorkingSchedule.startDay}</span> to{" "}
              <span className="font-medium">{workshop.ramadanWorkingSchedule.endDay}</span>
            </p>
            <p className="text-gray-700">
              Time: <span className="font-medium">{workshop.ramadanWorkingSchedule.startTime}</span> -{" "}
              <span className="font-medium">{workshop.ramadanWorkingSchedule.endTime}</span>
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-pink-50 p-4 rounded-xl shadow-inner border-l-4 border-pink-400">
            <h3 className="text-lg font-semibold text-pink-700 mb-2">ℹ️ Additional Info</h3>
            <p className="text-gray-700">Owner ID: <span className="font-medium">{workshop.ownerId}</span></p>
            <p className="text-gray-700">CRN: <span className="font-medium">{workshop.crn}</span></p>
            <p className="text-gray-700">Bank Account: <span className="font-medium">{workshop.bankAccountNumber}</span></p>
            <p className="text-gray-700">VAT Number: <span className="font-medium">{workshop.taxVatNumber}</span></p>
            <p className="text-gray-700">
              Mobile Workshop: <span className="font-medium">{workshop.isAvailableMobileWorkshop ? "✅ Yes" : "❌ No"}</span>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default WorkShopDetails;

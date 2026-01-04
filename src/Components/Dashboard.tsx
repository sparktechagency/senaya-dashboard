import {
  Loader2,
  Users,
  Calendar,
  DollarSign,
  Bookmark,
  Car,
  CarFront,
} from "lucide-react";
import {
  useAllCarModelQuery,
  useAllCarQuery,
  useAllWorkShopQuery,
  useGetDashBoardQuery,
} from "../redux/feature/adminApi";
import { useGetAllAdminQuery } from "../redux/feature/authApi";
import { useState } from "react";

const Dashboard = () => {
  const {
    data: DashBoard,
    isLoading,
    isError,
  } = useGetDashBoardQuery(undefined);
  const { data: PersonalData } = useGetAllAdminQuery(undefined);
  console.log("PersonalData", PersonalData);

  const [searchTerm] = useState("");
  const { data: allData } = useAllWorkShopQuery({ search: searchTerm });
  const { data, isLoading: carLoading, isError: carError } = useAllCarQuery(undefined);
  const { data: carModelData } = useAllCarModelQuery(undefined);
  const totalCarModel = carModelData?.data?.length;

  const allCars = data?.data?.result || data?.result || [];
  const total = allCars.length;

  if (isLoading || carLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600">
        <Loader2 className="animate-spin mr-2" size={24} />
        Loading Dashboard...
      </div>
    );
  }

  if (isError || !DashBoard?.data || carError || !allCars) {
    return (
      <div className="flex justify-center items-center min-h-screen text-5xl text-red-500">
        Failed to load dashboard data ❌
      </div>
    );
  }

  const { subscriptions } = DashBoard.data;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of platform statistics and performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Workshops Subscribed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Workshops Subscribed</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">
                {subscriptions?.workshopsSubscribedCount}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Calendar size={26} />
            </div>
          </div>
        </div>

        {/* Total Workshops */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Workshops</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">
                {allData?.data?.meta?.total}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users size={26} />
            </div>
          </div>
        </div>

        {/* Total Subscriptions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Subscriptions</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">
                {subscriptions?.subscriptionsCount}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <Bookmark size={26} />
            </div>
          </div>
        </div>
        {/* Total Cars */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Cars</p>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">
                {total}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <Car size={26} />
            </div>
          </div>
        </div>
        {/* Total Car Models */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Car Models</p>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">
                {totalCarModel}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <CarFront size={26} />
            </div>
          </div>
        </div>

        {/* Amount Earned */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Amount Earned</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">
                ${subscriptions?.amountEarned}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <DollarSign size={26} />
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default Dashboard;

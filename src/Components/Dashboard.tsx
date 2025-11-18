import {
  Loader2,
  Users,
  Calendar,
  DollarSign,
  Bookmark,
  User,
} from "lucide-react";
import {
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
  const [searchTerm] = useState("");
  const { data: allData } = useAllWorkShopQuery({ search: searchTerm });

  console.log(DashBoard);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600">
        <Loader2 className="animate-spin mr-2" size={24} />
        Loading Dashboard...
      </div>
    );
  }

  if (isError || !DashBoard?.data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-5xl text-red-500">
        Failed to load dashboard data ❌
      </div>
    );
  }

  const { totalAdmins, subscriptions } = DashBoard.data;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Monthly overview of platform activities and performance
        </p>
      </div>

      {/* === Dashboard Summary Cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {/* Total Admins */}
        <div className="bg-[#1771B7] rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
          <div className="p-3 bg-[#0F5C79] rounded-full text-white">
            <Users size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Total Admins</p>
            <h2 className="text-2xl font-bold text-white">{totalAdmins}</h2>
          </div>
        </div>

        {/* Subscriptions Count */}
        <div className="bg-amber-800 rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
          <div className="p-3 bg-amber-900 rounded-full text-white">
            <Bookmark size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Total Subscriptions</p>
            <h2 className="text-2xl font-bold text-white">
              {subscriptions?.subscriptionsCount}
            </h2>
          </div>
        </div>

        {/* Workshops Subscribed */}
        <div className="bg-[#6F42C1] rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
          <div className="p-3 bg-[#5A2A91] rounded-full text-white">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Workshops Subscribed</p>
            <h2 className="text-2xl font-bold text-white">
              {subscriptions?.workshopsSubscribedCount}
            </h2>
          </div>
        </div>

        {/* Period Info */}
        {/* <div className="bg-[#4C74B5] rounded-2xl shadow-lg p-6 col-span-2 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-white mb-2">
            Current Period
          </h3>
          <div className="text-sm text-white">
            <p>
              Month: <span className="font-medium">{period?.month}</span>
            </p>
            <p>
              Year: <span className="font-medium">{period?.year}</span>
            </p>
            <p>
              From:{" "}
              <span className="font-medium">
                {new Date(period?.start).toLocaleDateString()}
              </span>{" "}
              → To:{" "}
              <span className="font-medium">
                {new Date(period?.end).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div> */}
        {/* Period Info */}
        <div className="bg-[#1771B7] rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
          <div className="p-3 bg-[#0F5C79] rounded-full text-white">
            <Users size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Total WorkShop</p>
            <h2 className="text-2xl font-bold text-white">
              {allData?.data?.meta?.total}
            </h2>
          </div>
        </div>
        {/* Amount Earned */}
        <div className="bg-[#F46236] rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
          <div className="p-3 bg-[#D75727] rounded-full text-white">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-white text-sm">Amount Earned</p>
            <h2 className="text-2xl font-bold text-white">
              ${subscriptions?.amountEarned}
            </h2>
          </div>
        </div>
      </div>

      {/* === Admin Info Section === */}
      <div className="min-h-screen py-10 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">All Admins</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Sirial</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Contact</th>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Role</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {PersonalData?.data?.map((admin: any, index: number) => (
                <tr
                  key={admin._id || index}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6 flex items-center gap-3">
                    <div className="p-2 bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-md">
                      <User size={20} />
                    </div>
                    <span>{admin.name}</span>
                  </td>
                  <td className="py-3 px-6 truncate">{admin.email}</td>
                  <td className="py-3 px-6">{admin.contact}</td>
                  <td className="py-3 px-6">{admin._id.slice(0, 8)}...</td>
                  <td className="py-3 px-6">
                    <span className="inline-block text-xs font-semibold bg-linear-to-r from-blue-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-md">
                      Admin
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

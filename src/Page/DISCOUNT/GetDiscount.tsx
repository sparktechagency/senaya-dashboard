import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCreateNewFolder, MdEdit, MdDelete } from "react-icons/md";
import {
  useGetAllCuponQuery,
  useDeleteCuponMutation,
} from "../../redux/feature/Package";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CouponCards: React.FC = () => {
  const { data, isLoading, isError } = useGetAllCuponQuery({ page: 1, limit: 10 });
  const [deleteCupon] = useDeleteCuponMutation();
  const navigate = useNavigate();

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading coupons...</p>;
  if (isError)
    return <p className="text-center py-10 font-semibold text-5xl text-red-500">Failed to load coupons.</p>;

  const coupons = data?.data?.result;

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This coupon will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (result.isConfirmed) {
      await deleteCupon(id).unwrap();
      toast.success(`Coupon deleted successfully`);
    }
  };

  const handleEdit = (coupon: any) => {
    navigate(`/updateCoupon/${coupon._id}`); // ✅ use _id
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-md p-5 mb-6">
        <h2 className="text-2xl font-bold">🈹 Coupon List</h2>
        <Link to="/admin/createCupon" className="mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white bg-linear-to-tr from-blue-500 via-purple-600 to-pink-500 shadow-lg hover:shadow-pink-400/30 hover:scale-[1.03] transition-all duration-300">
            <MdOutlineCreateNewFolder className="text-lg" />
            <span>Create Coupon</span>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {coupons?.map((coupon: any) => (
          <div
            key={coupon._id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{coupon.code}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {coupon.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <p className="text-gray-600 text-sm">
                Type: <span className="font-medium">{coupon.discountType}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Value: <span className="font-medium">{coupon.discountValue}%</span>
              </p>
              <p className="text-gray-600 text-sm">
                Usage:{" "}
                <span className="font-medium">
                  {coupon.usedCount}/{coupon.usageLimit}
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                Start: {new Date(coupon.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                End: {new Date(coupon.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(coupon)}
                className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                <MdEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(coupon._id)}
                className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponCards;

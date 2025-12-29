import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useDeletePackageMutation,
  useGetAllPackageQuery,
} from "../../redux/feature/Package";
import { Link, useNavigate } from "react-router";
import { MdOutlineCreateNewFolder } from "react-icons/md";


const PackageTable = () => {
  const { data, isLoading, isError } = useGetAllPackageQuery(undefined);
  const [deletePackage] = useDeletePackageMutation();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );

  if (isError)
    return (
      <p className="text-red-500 text-center text-5xl">
        Failed to load packages{" "}
      </p>
    );

  const packages = data?.data?.packages || [];
  console.log(packages);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This package will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (result.isConfirmed) {
      deletePackage(id).unwrap();
      toast.success(`Package deleted Sucessfully`);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/updatePackage/${id}`);
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg shadow-md  mt-5">
        <div className="bg-linear-to-r from-indigo-500  via-purple-500 to-pink-500 p-4 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md">
            📦 All Packages
          </h2>

          <Link to="/admin/package/create">
            <button className="px-5 py-2 flex items-center gap-2  bg-white text-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg">
              <MdOutlineCreateNewFolder className="text-lg" />
              Create Package
            </button>
          </Link>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm mt-5 border text-gray-700">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">S/N</th>
              <th className="px-4 py-2 text-left">Time Period</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Payment Type</th>
              <th className="px-4 py-2 text-left">Discount</th>
              <th className="px-4 py-2 text-left">Subscription Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {packages.map((pkg: any, index: number) => (
              <tr key={pkg._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{pkg.title}</td>
                <td
                  className="px-4 py-2 hover:bg-gray-300 max-w-xs truncate relative group cursor-pointer"
                  title={pkg.description}
                >
                  {pkg.description.split(" ").slice(0, 5).join(" ")}
                  {pkg.description.split(" ").length > 7 && "....."}
                </td>

                <td className="px-4 py-2">${pkg.price}</td>
                <td className="px-4 py-2">{pkg.duration || "N/A"}</td>
                <td className="px-4 py-2">{pkg.paymentType}</td>
                <td className="px-4 py-2 text-center">
                  {pkg.discountPercentage || 0}%
                </td>
                <td className="px-4 py-2 text-center">
                  {pkg.subscriptionType || "N/A"}
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${pkg.status === "active" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {pkg.status}
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(pkg._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageTable;

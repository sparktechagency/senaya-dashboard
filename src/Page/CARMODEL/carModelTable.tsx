import { Link } from "react-router-dom";
import {
  useAllCarModelQuery,
  useDeletecarModelMutation,
} from "../../redux/feature/adminApi";
import { FiDelete, FiEdit } from "react-icons/fi";
import { Button, Tooltip } from "antd";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { toast } from "react-toastify";
import ImageList from "../IMAGE/ImageList";
import Swal from "sweetalert2";

interface CarModel {
  _id: string;
  brand: {title:string};
  title: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const CarModelTable = () => {
  const { data, error, isLoading } = useAllCarModelQuery(undefined);
  const [deleteCarBrand] = useDeletecarModelMutation(); 

console.log("CARMODEL",data);
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
      })
        if (result.isConfirmed) {
          await deleteCarBrand(id).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
    } catch {
      toast.error("Failed to delete the model.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-lg font-medium text-gray-600">
        Loading car models...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-5xl text-red-500 font-medium mt-6">
        Failed to load car models. Please try again later.
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-linear-to-br from-slate-100 via-gray-100 to-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Card container */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden transition-all hover:shadow-indigo-300/40 hover:scale-[1.01] duration-300">
          {/* linear header strip */}
          <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md">
              🚗 Car Models Management
            </h2>

            <Link to="/createCarmodel">
              <button className="px-5 py-2 flex items-center gap-2  bg-white text-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg">
                <MdOutlineCreateNewFolder className="text-lg" />
                Create Model
              </button>
            </Link>
          </div>

          {/* Table section */}
          <div className="p-6">
            {data?.data?.length === 0 ? (
              <div className="text-center text-gray-400 font-medium py-10">
                No car models found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm md:text-base">
                  <thead>
                    <tr className="bg-linear-to-r from-indigo-100 to-pink-100 text-gray-800 uppercase text-xs md:text-sm font-semibold tracking-wide">
                      <th className="px-5 py-3 text-left rounded-tl-xl">
                        Title
                      </th>
                      <th className="px-5 py-3 text-left">Brand</th>
                      <th className="px-5 py-3 text-left">Created At</th>
                      <th className="px-5 py-3 text-center rounded-tr-xl">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.map((carModel: CarModel, index: number) => (
                      <tr
                        key={carModel._id}
                        className={`${
                          index % 2 === 0 ? "bg-white/40" : "bg-white/30"
                        } hover:bg-indigo-50 transition duration-200`}
                      >
                        <td className="px-5 py-3 font-medium text-gray-800">
                          {carModel.title}
                        </td>
                        <td className="px-5 py-3 text-gray-700">
                          {carModel.brand?.title}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {new Date(carModel.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3 flex justify-center gap-3">
                          <Tooltip title="Edit Model">
                            <Link to={`/edit/${carModel._id}`}>
                              <Button
                                icon={<FiEdit />}
                                shape="circle"
                                className="bg-linear-to-r from-indigo-500 to-purple-500 text-white hover:scale-110 hover:shadow-md transition-all"
                              />
                            </Link>
                          </Tooltip>

                          <Tooltip title="Delete Model">
                            <Button
                              danger
                              icon={<FiDelete />}
                              shape="circle"
                              onClick={() => handleDelete(carModel._id)}
                              className="hover:scale-110 transition-all"
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
        </div>

        {/* Image List Section */}
        <div className="mt-10">
          <ImageList />
        </div>
      </div>
    </div>
  );
};

export default CarModelTable;

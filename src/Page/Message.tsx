import { motion } from "framer-motion";
import { MessageSquare, Phone, Trash2 } from "lucide-react";
import {
  useAllMessageQuery,
  useDeleteMessageMutation,
} from "../redux/feature/adminApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MessageList = () => {
  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = useAllMessageQuery(undefined);

  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
  console.log(messages?.data?.result);

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
        await deleteMessage(id).unwrap();
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      toast.error("Failed to delete message!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600 font-medium">
        Loading messages...
      </div>
    );
  }

  if (isError || !messages?.data?.result?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">
        No messages found ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        User Feedback Messages
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages?.data?.result?.map((msg: any, index: number) => (
          <motion.div
            key={msg._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-3  bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full text-white">
                  <MessageSquare size={22} />
                </div>
                <h2 className="text-base font-semibold text-gray-800">
                  {msg.name || "Unknown Sender"}
                </h2>
              </div>

              <button
                onClick={() => handleDelete(msg._id)}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 transition"
                title="Delete Message"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Message Body */}
            <p className="text-gray-700 mb-3">{msg.message}</p>

            <div className="flex justify-between">
              {/* Contact Info */}
              {msg.contact && (
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Phone size={16} />
                  <span>{msg.contact}</span>
                </div>
              )}
              <td className="px-4 py-3">
                {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>
            </div>

            {/* Attached Data */}
            {/* Attached Data */}
            {msg.data && msg.data.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mt-3">
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  Attached Data:
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                          Requested Work Item
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                          Work Category Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {msg.data.map(
                        (
                          item: {
                            requestedWorkItem: string;
                            workCategoryName: string;
                          },
                          i: number
                        ) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-100 transition-colors border-b"
                          >
                            <td className="px-4 py-2 text-gray-700">
                              {item.requestedWorkItem}
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                              {item.workCategoryName}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;

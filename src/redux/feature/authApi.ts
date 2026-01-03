import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (authData) => ({
        url: "/admin/create-admin",
        method: "POST",
        body: authData,
      }),
      invalidatesTags: ["ADMIN"],
    }),

    Login: builder.mutation({
      query: (authData) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: authData,
      }),
      invalidatesTags: ["AUTH"],
    }),

    changePassword: builder.mutation({
      query: (authData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: authData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: ["AUTH"],
    }),


    // ✅ Personal admin data
    getAllAdmin: builder.query({
      query: (params) => ({
        url: "/admin/get-admin",
        method: "GET",
        params,
      }),
      providesTags: ["ADMIN"],
    }),
    // UPDATE
    updateAdmin: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/users/admin/update/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["AUTH"],
    }),

    // ✅ Personal admin data
    getProfile: builder.query({
      query: (params) => ({
        url: "/users/profile",
        method: "GET",
        params,
      }),
      providesTags: ["AUTH"],
    }),
    // DELETE ADMIN
    deleteAdmin: builder.mutation({
      query: (adminId) => ({
        url: `/admin/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ADMIN"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAdminMutation,
  useGetAllAdminQuery,
  useGetProfileQuery,
  useLoginMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useChangePasswordMutation,
} = authApi;

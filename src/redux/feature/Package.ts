import { baseApi } from "../baseApi";

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPackage: builder.mutation({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PACKAGE"],
    }),
    // discount
    createDiscount: builder.mutation({
      query: (data) => ({
        url: "/coupon",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DISCOUNT"],
    }),
    //---------------- get All Package--------------
    getAllPackage: builder.query({
      query: () => ({
        url: "/packages",
        method: "GET",
      }),
      providesTags: ["PACKAGE"],
    }),
    getAllCupon: builder.query({
      query: () => ({
        url: "/coupon",
        method: "GET",
      }),
      providesTags: ["DISCOUNT"],
    }),
    // subscription
    getAllSubscription: builder.query({
      query: ({ search }) => ({
        url: `/subscription?searchTerm=${search || ""}`,
        method: "GET",
      }),
      providesTags: ["SUBSCRIPTION"],
    }),
    // single------------------
    getSinglePackage: builder.query({
      query: (carId: string) => ({
        url: `/packages/${carId}`,
        method: "GET",
      }),
      providesTags: ["PACKAGE"],
    }),
    getSingleDiscount: builder.query({
      query: (carId: string) => ({
        url: `/coupon/${carId}`,
        method: "GET",
      }),
      providesTags: ["DISCOUNT"],
    }),

    // -=================UPDATE===================
    updateSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscription/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SUBSCRIPTION"],
    }),
    updateDiscount: builder.mutation({
      query: ({ code, data }) => ({
        url: `coupon/update-coupon/${code}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DISCOUNT"],
    }),
    updatePackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PACKAGE"],
    }),

    //============================== Delete
    deletePackage: builder.mutation({
      query: (id: string) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PACKAGE"],
    }),
    deleteCupon: builder.mutation({
      query: (id: string) => ({
        url: `/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DISCOUNT"],
    }),
    // Delete
    deleteSubscription: builder.mutation({
      query: (id: string) => ({
        url: `/subscription/cancel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUBSCRIPTION"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateDiscountMutation,
  useCreatePackageMutation,
  useDeletePackageMutation,
  useGetAllSubscriptionQuery,
  useGetAllPackageQuery,
  useDeleteCuponMutation,
  useUpdateDiscountMutation,
  useGetAllCuponQuery,
  useGetSinglePackageQuery,
  useGetSingleDiscountQuery,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useUpdatePackageMutation,
} = settingApi;

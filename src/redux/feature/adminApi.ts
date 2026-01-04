import { baseApi } from "../baseApi";

export const adminAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // // ✅ Create Car Brand
    createCountry: builder.mutation({
      query: (body) => ({
        url: "/car-brand-countries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["COUNTRY"],
    }),
    // // ✅ Create Car Brand
    createImage: builder.mutation({
      query: (body) => ({
        url: "/images",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IMAGE"],
    }),
    // ✅ Create Car Brand
    createCarBrand: builder.mutation({
      query: (body) => ({
        url: "/car-brands",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ADMIN"],
    }),

    // ✅ Create Car Model
    createCarModel: builder.mutation({
      query: (body) => ({
        url: "/car-models",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CARS"],
    }),

    // ✅ Dashboard data
    getDashBoard: builder.query({
      query: () => ({
        url: "admin/dashboard",
        method: "GET",
      }),
      providesTags: ["ADMIN"],
    }),

    // ✅ All Messages
    allMessage: builder.query({
      query: () => ({
        url: "/message",
        method: "GET",
      }),
      providesTags: ["ADMIN"],
    }),

    // ✅ All Workshops
    allWorkShop: builder.query({
      query: ({ search }) => ({
        url: `/workshops?searchTerm=${search || ""}`,
        method: "GET",
      }),
      providesTags: ["WORKSHOP"],
    }),

    // ✅ All Brands
    allBrand: builder.query({
      query: () => ({
        url: "/car-brands",
        method: "GET",
      }),
      providesTags: ["ADMIN"],
    }),

    // ✅ All Car Models
    allCarModel: builder.query({
      query: () => ({
        url: "car-models/unpaginated",
        method: "GET",
      }),
      providesTags: ["CARS"],
    }),

    // ✅ All Cars
    allCar: builder.query({
      query: () => ({
        url: "cars",
        method: "GET",
      }),
      providesTags: ["CAR"],
    }),
    // ✅ All Country
    allCountry: builder.query({
      query: () => ({
        url: "car-brand-countries/unpaginated",
        method: "GET",
      }),
      providesTags: ["COUNTRY"],
    }),
    imageType: builder.query({
      query: () => ({
        url: "images/unpaginated/car_symbol",
        method: "GET",
      }),
      providesTags: ["IMAGE"],
    }),
    logoType: builder.query({
      query: () => ({
        url: "images/website_logo",
        method: "GET",
      }),
      providesTags: ["IMAGE"],
    }),

    // ---------------------------------------
    // ✅ Single Brand Fetch
    getSingleCarModel: builder.query({
      query: (modelId: string) => ({
        url: `/car-models/${modelId}`,
        method: "GET",
      }),
      providesTags: ["CARS"],
    }),
    getBrandById: builder.query({
      query: (brandId: string) => ({
        url: `/car-brand-countries/${brandId}`,
        method: "GET",
      }),
      providesTags: ["ADMIN"],
    }),

    // ✅ Single Workshop Fetch
    getSingleWorkShop: builder.query({
      query: (workShopId: string) => ({
        url: `/workshops/${workShopId}`,
        method: "GET",
      }),
      providesTags: ["WORKSHOP"],
    }),

    // ✅ Single Car Fetch
    getSingleCar: builder.query({
      query: (carId: string) => ({
        url: `/cars/${carId}`,
        method: "GET",
      }),
      providesTags: ["CAR"],
    }),
    // ✅ Single Car Fetch
    getSingleImage: builder.query({
      query: (carId: string) => ({
        url: `/images/get/${carId}`,
        method: "GET",
      }),
      providesTags: ["IMAGE"],
    }),
    // ----------------------------   SINGLE
    // ✅ Delete Country
    deleteCountry: builder.mutation({
      query: (id: string) => ({
        url: `/car-brand-countries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COUNTRY"],
    }),
    // ✅ Delete Message
    deleteMessage: builder.mutation({
      query: (messageId: string) => ({
        url: `/message/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ADMIN"],
    }),

    // ✅ Delete Car Brand
    deleteBrand: builder.mutation({
      query: (brandId: string) => ({
        url: `/car-brands/${brandId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ADMIN"],
    }),

    // ✅ Delete Car Model
    deletecarModel: builder.mutation({
      query: (modelId: string) => ({
        url: `/car-models/${modelId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CARS"],
    }),

    // ✅ Delete Workshop
    deleteWorkShop: builder.mutation({
      query: (id: string) => ({
        url: `/workshops/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WORKSHOP"],
    }),

    // ✅ Delete Car
    deleteCar: builder.mutation({
      query: (id: string) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CAR"],
    }),
    // ✅ Delete Image
    deleteImageType: builder.mutation({
      query: (id: string) => ({
        url: `/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["IMAGE"],
    }),
    // ----------------------------   UPDATE
    // update car
    updateCar: builder.mutation({
      query: ({ id, payload }: { id: string; payload: any }) => ({
        url: `/cars/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CAR"],
    }),
    // ✅ Update Workshop
    updateWorkShop: builder.mutation({
      query: ({ id, payload }: { id: string; payload: any }) => ({
        url: `/workshops/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["WORKSHOP"],
    }),
    // ✅ Update Workshop
    updateImage: builder.mutation({
      query: ({ id, payload }: { id: string; payload: any }) => ({
        url: `/images/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["IMAGE"],
    }),
    // ✅ Update Car Model
    updateCarModel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/car-models/${id}`,
        method: "PATCH", // ← Try changing to "PUT"
        body: data,
      }),
      invalidatesTags: ["CARS"],
    }),
  }),

  overrideExisting: false,
});

export const {
  // ✅ Create
  useCreateCountryMutation,
  useCreateCarBrandMutation,
  useCreateCarModelMutation,
  useCreateImageMutation,

  // ✅ Get All
  useGetDashBoardQuery,
  useAllBrandQuery,
  useAllCarModelQuery,
  useAllWorkShopQuery,
  useAllMessageQuery,
  useAllCarQuery,
  useAllCountryQuery,
  useImageTypeQuery,

  // ✅ Get Single
  useGetSingleCarModelQuery,
  useGetBrandByIdQuery,
  useGetSingleWorkShopQuery,
  useGetSingleCarQuery,
  useGetSingleImageQuery,
  useLogoTypeQuery,

  // ✅ Delete
  useDeleteCountryMutation,
  useDeleteMessageMutation,
  useDeleteBrandMutation,
  useDeletecarModelMutation,
  useDeleteWorkShopMutation,
  useDeleteCarMutation,
  useDeleteImageTypeMutation,

  // ✅ Update
  useUpdateCarMutation,
  useUpdateWorkShopMutation,
  useUpdateImageMutation,
  useUpdateCarModelMutation,
} = adminAPI;

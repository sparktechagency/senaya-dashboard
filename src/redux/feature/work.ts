import { baseApi } from "../baseApi";

export const workApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkCategory: builder.mutation({
      query: (body) => ({
        url: "/works-categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WORKCATEGORY"],
    }),

    createWork: builder.mutation({
      query: (body) => ({
        url: "/works",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WORK"],
    }),
    createWorkByFile: builder.mutation({
      query: (body) => ({
        url: "/works/xlxs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WORK"],
    }),
    createSpare: builder.mutation({
      query: (body) => ({
        url: "/spare-parts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SPARE"],
    }),


    // ✅ All WorkList
    workList: builder.query({
      query: () => ({
        url: "/works",
        method: "GET",
      }),
      providesTags: ["WORK"],
    }),

    // ✅ All SpareQuery
    spareList: builder.query({
      query: () => ({
        url: "/spare-parts",
        method: "GET",
      }),
      providesTags: ["SPARE"],
    }),
    // ✅ Work Category
    workCategory: builder.query({
      query: () => ({
        url: "/works-categories/unpaginated",
        method: "GET",
      }),
      providesTags: ["WORKCATEGORY"],
    }),
    // DELETE WORKS
    deleteWork: builder.mutation({
      query: (workId) => ({
        url: `/works/${workId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WORK"],
    }),
    // DELETE WORKS
    deleteSpare: builder.mutation({
      query: (workId) => ({
        url: `/spare-parts/${workId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SPARE"],
    }),
    // DELETE WORKSCATEGORY
    deleteWorkCategory: builder.mutation({
      query: (workId) => ({
        url: `/works-categories/${workId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WORKCATEGORY"],
    }),
    // UPDATE
       updateWorkCategory: builder.mutation({
      query: ({ id, payload }: { id: string; payload: any }) => ({
        url: `/works-categories/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["WORKCATEGORY"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateWorkMutation,
  useCreateWorkByFileMutation,
  useCreateSpareMutation,
  useWorkListQuery,
  useCreateWorkCategoryMutation,
  useSpareListQuery,
  useDeleteWorkMutation,
  useDeleteSpareMutation,
  useWorkCategoryQuery,
  useDeleteWorkCategoryMutation,
  useUpdateWorkCategoryMutation
} = workApi;

import { baseApi } from "../baseApi";

// Define response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// Update setting payload - just the data without ID
interface UpdateSettingPayload {
  termsConditions?: string;
  privacyPolicy?: string;
  aboutUs?: string;
  [key: string]: any; // Allow other properties
}

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // FIXED: Remove the id parameter, just send the data directly
    updateSetting: builder.mutation<ApiResponse, UpdateSettingPayload>({
      query: (data) => ({
        url: `/settings`,
        method: "PUT",
        body: data, 
      }),
      invalidatesTags: ["SETTING"],
    }),

    getPrivacyPolicy: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/settings/privacy-policy",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // About us
    getAboutUs: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/settings/aboutus",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // Support
    getSupport: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/settings/support",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // Team of SERVICE
      getTeamOfService: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/settings/termsOfService",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // Team of SERVICE
      getAllSetting: builder.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPrivacyPolicyQuery,useGetAboutUsQuery,useGetSupportQuery,useGetTeamOfServiceQuery, useUpdateSettingMutation ,useGetAllSettingQuery} = settingApi;
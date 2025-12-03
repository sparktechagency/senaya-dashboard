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
    // PRIVACY-POLICY
    updatePrivacyPolicy: builder.mutation<ApiResponse, UpdateSettingPayload>({
      query: (data) => ({
        url: `/rule/privacy-policy`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SETTING"],
    }),
    updateSupport: builder.mutation<ApiResponse, UpdateSettingPayload>({
      query: (data) => ({
        url: `/rule/support`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SETTING"],
    }),
    updateAboutUs: builder.mutation<ApiResponse, UpdateSettingPayload>({
      query: (data) => ({
        url: `/rule/about`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SETTING"],
    }),
    updateAppExplain: builder.mutation<ApiResponse, UpdateSettingPayload>({
      query: (data) => ({
        url: `/rule/app-explain`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SETTING"],
    }),
    updateService: builder.mutation<ApiResponse, UpdateSettingPayload>({
      query: (data) => ({
        url: `/rule/terms-and-conditions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SETTING"],
    }),


    // GETall data
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/rule/privacy-policy",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // Support
    getSupport: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/rule/support",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // About us
    getAboutUs: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/rule/about",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // App Explain
    getAppExplain: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/rule/app-explain",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
    // Team of SERVICE
    getService: builder.query<ApiResponse<string>, void>({
      query: () => ({
        url: "/rule/terms-and-conditions",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),





    // FIXED: Remove the id parameter, just send the data directly
    updateSetting: builder.mutation<ApiResponse, UpdateSettingPayload>({
      query: (data) => ({
        url: `/rule/terms-and-conditions`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SETTING"],
    }),




    // Team of SERVICE
    getAllSetting: builder.query({
      query: () => ({
        url: "/rule",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPrivacyPolicyQuery, useUpdateAppExplainMutation, useGetAppExplainQuery, useUpdateAboutUsMutation, useUpdateSupportMutation, useUpdatePrivacyPolicyMutation, useGetAboutUsQuery, useGetSupportQuery, useGetServiceQuery, useUpdateServiceMutation, useUpdateSettingMutation, useGetAllSettingQuery } = settingApi;
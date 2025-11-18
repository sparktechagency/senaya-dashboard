import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.senaeya.net/api/v1', 
  prepareHeaders: (headers) => {
    // Set custom headers (e.g., ngrok-skip-browser-warning)
    headers.set("ngrok-skip-browser-warning", "true");

    // Get the token from localStorage and set the Authorization header if available
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }

    return headers;
  },
});

// Create the base API with the above baseQuery
export const baseApi = createApi({
  reducerPath: "baseApi", // The name of the reducer slice for this API
  baseQuery, // Use the baseQuery defined above
<<<<<<< HEAD
  tagTypes: [ "ADMIN","CAR","CARS","AUTH","WORKSHOP","COUNTRY","SETTING","IMAGE","SPARE","WORK","PACKAGE","SUBSCRIPTION"
=======
  tagTypes: [ "ADMIN","CAR","CARS","AUTH","WORKSHOP","COUNTRY","SETTING","IMAGE","SPARE","WORK","PACKAGE","SUBSCRIPTION","DISCOUNT"
>>>>>>> 9011982415deefa3d6a6ff189b2da5e4ed29f531
  ], 
  endpoints: () => ({}), 
});

export default baseApi;

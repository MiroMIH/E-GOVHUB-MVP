import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    // Update the baseQuery function to include the token in the headers
    prepareHeaders: (headers, { getState }) => {
      // Get the token from localStorage
      const token = getToken();
      if (token) {
        // Include the token in the Authorization header
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "adminApi",
  tagTypes: ["User", "Users", "Publication","Registration"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user`,
      providesTags: ["User"],
    }),
    getUsers: build.query({
      query: () => `client/users`,
      providesTags: ["Users"],
    }),
    addUser: build.mutation({
      query: (userData) => ({
        url: `client/users`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `client/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation({
      query: ({ id, userData }) => ({
        url: `client/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    getAllPublications: build.query({
      query: () => `publication/publications`,
      providesTags: ["Publication"],
    }),
    getPublicationById: build.query({
      query: (id) => `publication/publications/${id}`,
      providesTags: (result, error, id) => [{ type: "Publication", id }],
    }),
    createPublication: build.mutation({
      query: (publicationData) => ({
        url: `publication/publications`,
        method: "POST",
        body: publicationData,
      }),
      invalidatesTags: ["Publication"],
    }),
    updatePublication: build.mutation({
      query: ({ id, publicationData }) => ({
        url: `publication/publications/${id}`,
        method: "PUT",
        body: publicationData,
      }),
      invalidatesTags: ["Publication"],
    }),
    deletePublication: build.mutation({
      query: (id) => ({
        url: `publication/publications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Publication"],
    }),
    getDashboardStats: build.query({
      query: () => `dashboard/statiques`, // Route to fetch dashboard statistics
      providesTags: ["Dashboard"], // Tag for caching
    }),

    // New endpoint to get only citizen users
    getCitizenUsers: build.query({
      query: () => `client/usersCitizens`, // Route to fetch citizen users
      providesTags: ["Users"], // Tag for caching
    }),
    getRegistrations: build.query({
      query: () => `register/registrations`, // Assuming your endpoint for fetching registrations is 'registration/registrations'
      providesTags: ["Registration"],
    }),
    deleteRegistration: build.mutation({
      query: (id) => ({
        url: `register/registration/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Registration"],
    }),
  }),
  onError: (error) => {
    console.error("An error occurred:", error);
    // Optionally handle errors here, e.g., display an error message to the user
  },
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetAllPublicationsQuery,
  useGetPublicationByIdQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
  useGetCitizenUsersQuery,
  useGetDashboardStatsQuery ,
  useGetRegistrationsQuery, 
  useDeleteRegistrationMutation,
} = api;

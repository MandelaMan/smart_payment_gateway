import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, clearUser } from "../auth/authSlice";

const baseUrl = import.meta?.env?.VITE_API_BASE || "http://localhost:3000";

// Wrap fetchBaseQuery to log requests & responses
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include", // send cookies
});

const loggingBaseQuery = async (args, api, extraOptions) => {
  console.log("➡️ API Request:", args);
  try {
    const result = await rawBaseQuery(args, api, extraOptions);
    console.log("✅ API Response:", result);
    return result;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: loggingBaseQuery,
  tagTypes: ["Auth", "BOQ", "Catalog", "Pops"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("👤 getMe success:", data);
          dispatch(setUser(data));
        } catch (err) {
          console.error("👤 getMe failed:", err);
          dispatch(clearUser());
        }
      },
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log("🔑 Login attempt with:", arg);
        try {
          const { data } = await queryFulfilled; // assume backend returns user (no password)
          console.log("✅ Login success:", data);
          dispatch(setUser(data));
        } catch (err) {
          console.error("❌ Login failed:", err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log("🚪 Logout attempt");
        try {
          await queryFulfilled;
          console.log("✅ Logout success");
        } finally {
          dispatch(clearUser());
        }
      },
    }),
    getCatalog: builder.query({
      query: () => "/catalog",
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Catalog", id: c.id })),
              { type: "Catalog", id: "LIST" },
            ]
          : [{ type: "Catalog", id: "LIST" }],
    }),
    createCatalogItem: builder.mutation({
      query: (body) => ({ url: "/catalog", method: "POST", body }),
      invalidatesTags: [{ type: "Catalog", id: "LIST" }],
    }),
    updateCatalogItem: builder.mutation({
      query: ({ id, body }) => ({ url: `/catalog/${id}`, method: "PUT", body }),
      invalidatesTags: (r, e, { id }) => [
        { type: "Catalog", id },
        { type: "Catalog", id: "LIST" },
      ],
    }),
    deleteCatalogItem: builder.mutation({
      query: (id) => ({ url: `/catalog/${id}`, method: "DELETE" }),
      invalidatesTags: (r, e, id) => [
        { type: "Catalog", id },
        { type: "Catalog", id: "LIST" },
      ],
    }),
    getPops: builder.query({
      query: () => "/pop",
      providesTags: ["Pops"],
    }),
    listBoqs: builder.query({
      query: () => "/boq",
      providesTags: ["BOQ"],
    }),
    getBoq: builder.query({
      query: (id) => `/boq/${id}`,
      providesTags: (_r, _e, id) => [{ type: "BOQ", id }],
    }),
    createBoq: builder.mutation({
      query: (payload) => ({ url: "/boq", method: "POST", body: payload }),
      invalidatesTags: ["BOQ"],
    }),
    updateBoq: builder.mutation({
      query: ({ id, body }) => ({
        url: `/boq/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "BOQ", id }, "BOQ"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetCatalogQuery,
  useCreateCatalogItemMutation,
  useUpdateCatalogItemMutation,
  useDeleteCatalogItemMutation,
  useGetPopsQuery,
  useListBoqsQuery,
  useGetBoqQuery,
  useCreateBoqMutation,
  useUpdateBoqMutation,
} = api;

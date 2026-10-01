import { ofetch } from "ofetch";

export const api = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  credentials: "include",

  headers: {
    "Content-Type": "application/json",
  },

  onRequest({ options }) {
    // Future:
    // request headers / auth logic
  },

  onResponseError({ response }) {
    // Global API error handling
    console.error("API Error:", response.status);
  },
});
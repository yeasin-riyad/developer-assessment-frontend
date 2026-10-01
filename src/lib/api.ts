import { ofetch } from "ofetch";

const api = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  credentials: "include",

  headers: {
    "Content-Type": "application/json",
  },

  onResponseError({ response }) {
    const data = response._data as
      | {
          success?: boolean;
          message?: string;
        }
      | undefined;

    const message =
      data?.message ||
      "Something went wrong. Please try again.";

    throw new Error(message);
  },
});

export default api;
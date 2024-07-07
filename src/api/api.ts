import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { persistor, RootState } from "../redux/store";
import config from "../config";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { TOAST_CLOSE_TIME_MS } from "../utils/constants";
import { ISignUpInfo } from "../redux/auth";
import { ISignIn } from "../interfaces/AuthInterfaces";
import { logout } from "../redux/user";

const baseQuery = fetchBaseQuery({
  baseUrl: config.app.serverUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token;

    if (token) headers.set("x-access-token", token);

    return headers;
  },
});

//check if user is logged on another device
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    api.dispatch(logout());
    // persistor.purge();
    toast.error("Netko se prijavio na ovaj račun preko drugog uređaja!", {
      position: "top-center",
      autoClose: TOAST_CLOSE_TIME_MS,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  return result;
};

export const api = createApi({
  reducerPath: "ownerApi",
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Restaurant", "Beach", "Device", "Sight", "Apartment"],

  endpoints: (builder) => ({
    //apartment info
    getApartmentInfo: builder.query<any, { apartmentID: string | undefined }>({
      query: ({ apartmentID }) => ({
        url: `/apartment/${apartmentID}`,
      }),
      providesTags: ["Apartment"],
    }),
    //register
    register: builder.mutation<
      { id: string; accessToken: string; type: string },
      ISignUpInfo
    >({
      query: (signUp) => ({
        url: `/register`,
        body: { ...signUp },
        method: "POST",
      }),
    }),
    //login
    login: builder.mutation<
      { token: string; type: string; id: string | undefined },
      ISignIn
    >({
      query: (singIn) => ({
        url: `/login`,
        body: { ...singIn },
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetApartmentInfoQuery,
  useRegisterMutation,
  useLoginMutation,
} = api;

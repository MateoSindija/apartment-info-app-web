import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { persistor, RootState } from "@/redux/store";
import config from "../config";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { TOAST_CLOSE_TIME_MS } from "@/utils/constants";
import { ISignUpInfo } from "@/redux/auth";
import { ISignIn } from "@/interfaces/AuthInterfaces";
import { logout } from "@/redux/user";
import {
  IApartment,
  IApartmentInfo,
  INewApartment,
} from "@/interfaces/ApartmentIntefaces";
import {
  IBeach,
  IDevice,
  INewBasicWithPostion,
  INewBeach,
  INewDevice,
  INewRestaurant,
  IRestaurant,
  IShop,
  ISight,
} from "@/interfaces/NewItemInterface";
import { IAboutUs } from "@/interfaces/AboutUsInterface";

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

  tagTypes: ["Restaurant", "Beach", "Device", "Sight", "Apartment", "Shop"],

  endpoints: (builder) => ({
    //apartment info
    getApartmentInfo: builder.query<IApartmentInfo, string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/info`,
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
    //get apartment
    getApartments: builder.query<{ apartments: IApartment[] }, void>({
      query: () => ({
        url: `/apartment/list`,
        method: "GET",
      }),
      providesTags: ["Apartment"],
    }),
    //add apartment
    addApartments: builder.mutation<void, INewApartment>({
      query: (apartment) => ({
        url: `/apartment/new`,
        body: { ...apartment },
        method: "POST",
      }),
      invalidatesTags: ["Apartment"],
    }),

    //get apartment restaurant
    getRestaurantApartments: builder.query<IRestaurant[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/restaurants`,
        method: "GET",
      }),
      providesTags: ["Restaurant"],
    }),
    //get apartment beaches
    getBeachApartments: builder.query<IBeach[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/beaches`,
        method: "GET",
      }),
      providesTags: ["Beach"],
    }),

    //get apartment devices
    getDeviceApartments: builder.query<IDevice[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/devices`,
        method: "GET",
      }),
      providesTags: ["Device"],
    }),

    //get apartment shops
    getShopApartments: builder.query<IShop[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/shops`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),
    //get apartment sights
    getSightApartments: builder.query<IShop[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/sights`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),

    //get beach
    getBeachInfo: builder.query<IBeach, string>({
      query: (beachId) => ({
        url: `/beach/${beachId}`,
        method: "GET",
      }),
      providesTags: ["Beach"],
    }),

    //add beach
    addBeach: builder.mutation<void, FormData>({
      query: (beach) => ({
        url: `/beach/new`,
        body: beach,
        method: "POST",
      }),
      invalidatesTags: ["Beach"],
    }),

    //get restaurant
    getRestaurantInfo: builder.query<IRestaurant, string>({
      query: (restaurantId) => ({
        url: `/restaurant/${restaurantId}`,
        method: "GET",
      }),
      providesTags: ["Restaurant"],
    }),

    //add restaurant
    addRestaurant: builder.mutation<void, FormData>({
      query: (restaurant) => ({
        url: `/restaurant/new`,
        body: restaurant,
        method: "POST",
      }),
      invalidatesTags: ["Restaurant"],
    }),

    //get shop
    getShopInfo: builder.query<IShop, string>({
      query: (shopId) => ({
        url: `/shop/${shopId}`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),
    //add shop
    addShop: builder.mutation<void, FormData>({
      query: (shop) => ({
        url: `/shop/new`,
        body: shop,
        method: "POST",
      }),
      invalidatesTags: ["Shop"],
    }),

    //get sight
    getSightInfo: builder.query<ISight, string>({
      query: (sightId) => ({
        url: `/sight/${sightId}`,
        method: "GET",
      }),
      providesTags: ["Sight"],
    }),

    //add sight
    addSight: builder.mutation<void, FormData>({
      query: (sight) => ({
        url: `/sight/new`,
        body: sight,
        method: "POST",
      }),
      invalidatesTags: ["Sight"],
    }),

    //get device
    getDeviceInfo: builder.query<IDevice, string>({
      query: (deviceId) => ({
        url: `/device/${deviceId}`,
        method: "GET",
      }),
      providesTags: ["Device"],
    }),

    //get about us
    getAboutUsInfo: builder.query<IAboutUs, string>({
      query: (apartmentId) => ({
        url: `/about-us/${apartmentId}`,
        method: "GET",
      }),
      providesTags: ["Apartment"],
    }),

    //add device
    addDevice: builder.mutation<void, FormData>({
      query: (device) => ({
        url: `/device/new`,
        body: device,
        method: "POST",
      }),
      invalidatesTags: ["Device"],
    }),

    //update device
    updateDevice: builder.mutation<
      void,
      { device: INewDevice; deviceId: string }
    >({
      query: ({ device, deviceId }) => ({
        url: `/device/${deviceId}`,
        body: device,
        method: "PATCH",
      }),
      invalidatesTags: ["Device"],
    }),

    //update beach
    updateBeach: builder.mutation<void, { beach: INewBeach; beachId: string }>({
      query: ({ beach, beachId }) => ({
        url: `/beach/${beachId}`,
        body: { ...beach },
        method: "PATCH",
      }),
      invalidatesTags: ["Beach"],
    }),

    //update sight
    updateSight: builder.mutation<
      void,
      { sight: INewBasicWithPostion; sightId: string }
    >({
      query: ({ sight, sightId }) => ({
        url: `/sight/${sightId}`,
        body: { ...sight },
        method: "PATCH",
      }),
      invalidatesTags: ["Sight"],
    }),
  }),
});

export const {
  useGetAboutUsInfoQuery,
  useGetSightApartmentsQuery,
  useGetShopApartmentsQuery,
  useGetDeviceApartmentsQuery,
  useGetDeviceInfoQuery,
  useGetShopInfoQuery,
  useGetSightInfoQuery,
  useGetRestaurantInfoQuery,
  useGetApartmentInfoQuery,
  useRegisterMutation,
  useLoginMutation,
  useGetApartmentsQuery,
  useAddApartmentsMutation,
  useGetRestaurantApartmentsQuery,
  useGetBeachApartmentsQuery,
  useGetBeachInfoQuery,
  useAddBeachMutation,
  useAddSightMutation,
  useAddRestaurantMutation,
  useAddDeviceMutation,
  useAddShopMutation,
} = api;

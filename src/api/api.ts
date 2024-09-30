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
  IApartmentReviewSummary,
  IBeach,
  IDevice,
  INewBasicWithPostion,
  INewBeach,
  INewDevice,
  INewRestaurant,
  IRestaurant,
  IReview,
  IShop,
  ISight,
} from "@/interfaces/NewItemInterface";
import { IAboutUs } from "@/interfaces/AboutUsInterface";
import {
  INewReservation,
  IReservation,
} from "@/interfaces/ReservationInterface";

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

  tagTypes: [
    "restaurant",
    "beach",
    "device",
    "sight",
    "apartment",
    "shop",
    "reservation",
    "reviews",
  ],

  endpoints: (builder) => ({
    //apartment info
    getApartmentInfo: builder.query<IApartmentInfo, string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/info`,
      }),
      providesTags: ["apartment"],
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
      providesTags: ["apartment"],
    }),
    //add apartment
    addApartments: builder.mutation<void, INewApartment>({
      query: (apartment) => ({
        url: `/apartment/new`,
        body: { ...apartment },
        method: "POST",
      }),
      invalidatesTags: ["apartment"],
    }),

    //get apartment reviews
    getApartmentReviews: builder.query<IApartmentReviewSummary, string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/reviews`,
        method: "GET",
      }),
      providesTags: ["reviews"],
    }),

    //get apartment restaurant
    getRestaurantApartments: builder.query<IRestaurant[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/restaurants`,
        method: "GET",
      }),
      providesTags: ["restaurant"],
    }),
    //get apartment beach
    getBeachApartments: builder.query<IBeach[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/beaches`,
        method: "GET",
      }),
      providesTags: ["beach"],
    }),

    //get apartment devices
    getDeviceApartments: builder.query<IDevice[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/devices`,
        method: "GET",
      }),
      providesTags: ["device"],
    }),

    //get apartment shops
    getShopApartments: builder.query<IShop[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/shops`,
        method: "GET",
      }),
      providesTags: ["shop"],
    }),
    //get apartment sights
    getSightApartments: builder.query<IShop[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/sights`,
        method: "GET",
      }),
      providesTags: ["shop"],
    }),
    //get apartment reservations
    getReservationApartments: builder.query<IReservation[], string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/reservations`,
        method: "GET",
      }),
      providesTags: ["reservation"],
    }),

    //get beach
    getBeachInfo: builder.query<IBeach, string>({
      query: (beachId) => ({
        url: `/beach/${beachId}`,
        method: "GET",
      }),
      providesTags: ["beach"],
    }),

    //get all beach from user
    getAllUserBeachesInfo: builder.query<IBeach[], string>({
      query: (apartmentId) => ({
        url: `/beach/${apartmentId}/list`,
        method: "GET",
      }),
      providesTags: ["beach"],
    }),

    //get all restaurants from user
    getAllUserRestaurantsInfo: builder.query<IRestaurant[], string>({
      query: (apartmentId) => ({
        url: `/restaurant/${apartmentId}/list`,
        method: "GET",
      }),
      providesTags: ["restaurant"],
    }),

    //get all sights from user
    getAllUserSightsInfo: builder.query<ISight[], string>({
      query: (apartmentId) => ({
        url: `/sight/${apartmentId}/list`,
        method: "GET",
      }),
      providesTags: ["sight"],
    }),

    //get all shops from user
    getAllUserShopsInfo: builder.query<IShop[], string>({
      query: (apartmentId) => ({
        url: `/shop/${apartmentId}/list`,
        method: "GET",
      }),
      providesTags: ["shop"],
    }),
    //get all devices from user
    getAllUserDevicesInfo: builder.query<IDevice[], string>({
      query: (apartmentId) => ({
        url: `/device/${apartmentId}/list`,
        method: "GET",
      }),
      providesTags: ["device"],
    }),

    //add beach
    addBeach: builder.mutation<void, FormData>({
      query: (beach) => ({
        url: `/beach/new`,
        body: beach,
        method: "POST",
      }),
      invalidatesTags: ["beach"],
    }),

    //get restaurant
    getRestaurantInfo: builder.query<IRestaurant, string>({
      query: (restaurantId) => ({
        url: `/restaurant/${restaurantId}`,
        method: "GET",
      }),
      providesTags: ["restaurant"],
    }),

    //get reservation
    getReservationInfo: builder.query<IReservation, string>({
      query: (reservationId) => ({
        url: `/reservation/${reservationId}`,
        method: "GET",
      }),
      providesTags: ["reservation"],
    }),

    //add restaurant
    addRestaurant: builder.mutation<void, FormData>({
      query: (restaurant) => ({
        url: `/restaurant/new`,
        body: restaurant,
        method: "POST",
      }),
      invalidatesTags: ["restaurant"],
    }),

    //add reservation
    addReservation: builder.mutation<void, INewReservation>({
      query: (reservation) => ({
        url: `/reservation/new`,
        body: { ...reservation },
        method: "POST",
      }),
      invalidatesTags: ["reservation"],
    }),

    //get shop
    getShopInfo: builder.query<IShop, string>({
      query: (shopId) => ({
        url: `/shop/${shopId}`,
        method: "GET",
      }),
      providesTags: ["shop"],
    }),
    //add shop
    addShop: builder.mutation<void, FormData>({
      query: (shop) => ({
        url: `/shop/new`,
        body: shop,
        method: "POST",
      }),
      invalidatesTags: ["shop"],
    }),

    //get sight
    getSightInfo: builder.query<ISight, string>({
      query: (sightId) => ({
        url: `/sight/${sightId}`,
        method: "GET",
      }),
      providesTags: ["sight"],
    }),

    //add sight
    addSight: builder.mutation<void, FormData>({
      query: (sight) => ({
        url: `/sight/new`,
        body: sight,
        method: "POST",
      }),
      invalidatesTags: ["sight"],
    }),

    //get device
    getDeviceInfo: builder.query<IDevice, string>({
      query: (deviceId) => ({
        url: `/device/${deviceId}`,
        method: "GET",
      }),
      providesTags: ["device"],
    }),

    //get about us
    getAboutUsInfo: builder.query<IAboutUs, string>({
      query: (apartmentId) => ({
        url: `/apartment/${apartmentId}/aboutUs`,
        method: "GET",
      }),
      providesTags: ["apartment"],
    }),

    //add device
    addDevice: builder.mutation<void, FormData>({
      query: (device) => ({
        url: `/device/new`,
        body: device,
        method: "POST",
      }),
      invalidatesTags: ["device"],
    }),

    //add existing device
    addExistingDevice: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ attractionId, apartmentId }) => ({
        url: `/device/${attractionId}/existing/${apartmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["device"],
    }),

    //add existing device
    addExistingBeach: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ attractionId, apartmentId }) => ({
        url: `/beach/${attractionId}/existing/${apartmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["beach"],
    }),

    //add existing restaurant
    addExistingRestaurant: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ attractionId, apartmentId }) => ({
        url: `/restaurant/${attractionId}/existing/${apartmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["restaurant"],
    }),

    //add existing shop
    addExistingShop: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ attractionId, apartmentId }) => ({
        url: `/shop/${attractionId}/existing/${apartmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["shop"],
    }),

    //add existing sight
    addExistingSight: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ attractionId, apartmentId }) => ({
        url: `/sight/${attractionId}/existing/${apartmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["sight"],
    }),

    //add about us
    addAboutUs: builder.mutation<void, FormData>({
      query: (aboutUs) => ({
        url: `/apartment/aboutUs`,
        body: aboutUs,
        method: "POST",
      }),
      invalidatesTags: ["apartment"],
    }),

    //update about us
    updateAboutUs: builder.mutation<void, { data: FormData; id: string }>({
      query: ({ data, id }) => ({
        url: `/apartment/${id}/aboutUs`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["apartment"],
    }),

    //update apartment
    updateApartment: builder.mutation<
      void,
      { data: INewApartment; id: string }
    >({
      query: ({ data, id }) => ({
        url: `/apartment/${id}`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["apartment"],
    }),

    //update device
    updateDevice: builder.mutation<void, { data: FormData; id: string }>({
      query: ({ data, id }) => ({
        url: `/device/${id}`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["device"],
    }),

    //update beach
    updateBeach: builder.mutation<void, { data: FormData; id: string }>({
      query: ({ data, id }) => {
        console.log(data);
        return {
          url: `/beach/${id}`,
          body: data,
          method: "PATCH",
        };
      },
      invalidatesTags: ["beach"],
    }),

    //update restaurant
    updateRestaurant: builder.mutation<void, { data: FormData; id: string }>({
      query: ({ data, id }) => ({
        url: `/restaurant/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["restaurant"],
    }),
    //update restaurant
    updateReservation: builder.mutation<
      void,
      { data: INewReservation; id: string }
    >({
      query: ({ data, id }) => ({
        url: `/reservation/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
      invalidatesTags: ["reservation"],
    }),

    //update shop
    updateShop: builder.mutation<void, { data: FormData; id: string }>({
      query: ({ data, id }) => ({
        url: `/shop/${id}`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["shop"],
    }),

    //update sight
    updateSight: builder.mutation<void, { data: FormData; id: string }>({
      query: ({ data, id }) => ({
        url: `/sight/${id}`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["sight"],
    }),

    //delete shop
    deleteShop: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ apartmentId, attractionId }) => ({
        url: `/shop/${apartmentId}/${attractionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["shop"],
    }),
    //delete restaurant
    deleteRestaurant: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ apartmentId, attractionId }) => ({
        url: `/restaurant/${apartmentId}/${attractionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["restaurant"],
    }),

    //delete beach
    deleteBeach: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ apartmentId, attractionId }) => ({
        url: `/beach/${apartmentId}/${attractionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["beach"],
    }),
    //delete sight
    deleteSight: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ apartmentId, attractionId }) => ({
        url: `/sight/${apartmentId}/${attractionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sight"],
    }),
    //delete reservation
    deleteReservation: builder.mutation<void, string>({
      query: (reservationId) => ({
        url: `/reservation/${reservationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reservation"],
    }),

    //delete device
    deleteDevice: builder.mutation<
      void,
      { apartmentId: string; attractionId: string }
    >({
      query: ({ apartmentId, attractionId }) => ({
        url: `/device/${apartmentId}/${attractionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["device"],
    }),
  }),
});

export const {
  useUpdateApartmentMutation,
  useAddExistingDeviceMutation,
  useAddExistingSightMutation,
  useAddExistingShopMutation,
  useAddExistingRestaurantMutation,
  useAddExistingBeachMutation,
  useGetAllUserBeachesInfoQuery,
  useGetAllUserRestaurantsInfoQuery,
  useGetAllUserShopsInfoQuery,
  useGetAllUserSightsInfoQuery,
  useGetAllUserDevicesInfoQuery,
  useGetApartmentReviewsQuery,
  useDeleteReservationMutation,
  useUpdateReservationMutation,
  useGetReservationInfoQuery,
  useAddReservationMutation,
  useDeleteBeachMutation,
  useDeleteRestaurantMutation,
  useDeleteDeviceMutation,
  useDeleteSightMutation,
  useDeleteShopMutation,
  useUpdateShopMutation,
  useUpdateSightMutation,
  useUpdateRestaurantMutation,
  useUpdateBeachMutation,
  useUpdateDeviceMutation,
  useAddAboutUsMutation,
  useUpdateAboutUsMutation,
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
  useGetReservationApartmentsQuery,
} = api;

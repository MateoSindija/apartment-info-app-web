import React, { useEffect } from "react";
import {
  useAddApartmentsMutation,
  useUpdateApartmentMutation,
} from "@/api/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IApartment, INewApartment } from "@/interfaces/ApartmentIntefaces";
import { NewApartmentSchema } from "@/schemas/NewItemSchemas";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import {
  fromAddress,
  fromLatLng,
  OutputFormat,
  setDefaults,
} from "react-geocode";
import { toast } from "react-toastify";
import { da } from "date-fns/locale";
import { TOAST_CLOSE_TIME_MS } from "@/utils/constants";

interface IProps {
  setIsModalOpen?: (value: ((prevState: boolean) => boolean) | boolean) => void;
  data?: IApartment;
  apartmentId?: string;
}
const NewApartmentForm = ({ setIsModalOpen, data, apartmentId }: IProps) => {
  setDefaults({
    key: import.meta.env.VITE_GOOGLE_MAP_KEY ?? "", // Your API key here.
    language: "en",
    outputFormat: OutputFormat.JSON,
    region: "hr",
  });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY ?? "",
  });
  const [addApartment, { isLoading }] = useAddApartmentsMutation();
  const [editApartment, { isLoading: isUpdating }] =
    useUpdateApartmentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
    reset,
    getValues,
    clearErrors,
  } = useForm<INewApartment>({
    resolver: zodResolver(NewApartmentSchema),
    defaultValues: {
      lat: data ? data.location.coordinates[1] : 45.815,
      lng: data ? data.location.coordinates[0] : 15.9819,
      apartmentPassword: data ? data.apartmentPassword : "",
      name: data ? data.name : "",
      address: data ? data.address : "",
    },
  });

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    setValue("lat", e.latLng?.lat() ?? 0);
    setValue("lng", e.latLng?.lng() ?? 0);

    const results = await fromLatLng(
      e.latLng?.lat() ?? 0,
      e.latLng?.lng() ?? 0,
    );

    setValue("address", results.results[0].formatted_address);
  };

  //wait for user to stop writing
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const address = getValues("address");

      if (!address) return;

      const results = await fromAddress(address);

      const lat = results.results[0].geometry.location.lat;
      const lng = results.results[0].geometry.location.lng;

      setValue("address", address);
      setValue("lat", lat);
      setValue("lng", lng);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [watch("address")]);

  const handleAddingNewApartment = async (data: INewApartment) => {
    await addApartment(data);
    if (setIsModalOpen) setIsModalOpen(false);
    toast.success("Apartment added", {
      position: "top-center",
      autoClose: TOAST_CLOSE_TIME_MS,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleUpdatingApartment = async (data: INewApartment) => {
    if (apartmentId) await editApartment({ data: data, id: apartmentId });
    toast.success("Apartment updated", {
      position: "top-center",
      autoClose: TOAST_CLOSE_TIME_MS,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <form
      className={"newApartment"}
      id={"apartmentForm"}
      onSubmit={handleSubmit(
        data ? handleUpdatingApartment : handleAddingNewApartment,
      )}
    >
      {setIsModalOpen && (
        <div className={"newApartment__header"}>Add new apartment</div>
      )}
      <label htmlFor="name">Apartment name</label>
      <input id={"name"} {...register("name")} />
      <label htmlFor="password">Password for client sign in </label>
      <input id="password" {...register("apartmentPassword")} />

      <label htmlFor="address">Apartment address</label>
      <input id="address" {...register("address")} />

      <div className={"newApartment__info"}>
        Write your apartment address or select it on the map
      </div>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ height: "300px", width: "100%" }}
          center={{ lat: watch("lat"), lng: watch("lng") }}
          mapTypeId="satellite"
          zoom={13}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
          }}
          onClick={handleMapClick}
        >
          <MarkerF
            position={{
              lat: watch("lat"),
              lng: watch("lng"),
            }}
          />
        </GoogleMap>
      )}

      {setIsModalOpen && (
        <div className={"newApartment__buttons"}>
          <button
            className={"newApartment__buttons__cancel"}
            type="button"
            disabled={isLoading || isUpdating}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            disabled={isLoading || isUpdating}
            className={"newApartment__buttons__submit"}
            type="submit"
          >
            Add apartment
          </button>
        </div>
      )}
    </form>
  );
};

export default NewApartmentForm;

import React, { useEffect } from "react";
import { useAddApartmentsMutation } from "@/api/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { INewApartment } from "@/interfaces/ApartmentIntefaces";
import { NewApartmentSchema } from "@/schemas/NewItemSchemas";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import {
  fromAddress,
  fromLatLng,
  OutputFormat,
  setDefaults,
} from "react-geocode";

interface IProps {
  setIsModalOpen: (value: ((prevState: boolean) => boolean) | boolean) => void;
}
const NewApartmentForm = ({ setIsModalOpen }: IProps) => {
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
      lat: 45.815,
      lng: 15.9819,
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
    setIsModalOpen(false);
  };

  return (
    <form
      className={"newApartment"}
      onSubmit={handleSubmit(handleAddingNewApartment)}
    >
      <div className={"newApartment__header"}>Add new apartment</div>
      <label htmlFor="name">Apartment name</label>
      <input id={"name"} {...register("name")} />

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

      <div className={"newApartment__buttons"}>
        <button
          className={"newApartment__buttons__cancel"}
          type="button"
          disabled={isLoading}
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          className={"newApartment__buttons__submit"}
          type="submit"
        >
          Add apartment
        </button>
      </div>
    </form>
  );
};

export default NewApartmentForm;

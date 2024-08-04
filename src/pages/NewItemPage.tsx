import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Sidebar from "../layout/Sidebar";
import { Button, Form, ProgressBar, Toast } from "react-bootstrap";
import {
  IBasic,
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
import { useForm } from "react-hook-form";
import {
  NewBeachSchema,
  NewDeviceSchema,
  NewItemBasicSchema,
  NewRestaurantSchema,
} from "@/schemas/NewItemSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useLocation, useParams } from "react-router-dom";
import { IAboutUs, INewAboutUs } from "@/interfaces/AboutUsInterface";
import { AboutUsSchema } from "@/schemas/AboutUsSchema";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { useDropzone } from "react-dropzone";
import { RiImageAddFill } from "react-icons/ri";
import {
  useAddAboutUsMutation,
  useAddBeachMutation,
  useAddDeviceMutation,
  useAddExistingBeachMutation,
  useAddExistingDeviceMutation,
  useAddExistingRestaurantMutation,
  useAddExistingShopMutation,
  useAddExistingSightMutation,
  useAddRestaurantMutation,
  useAddShopMutation,
  useAddSightMutation,
  useGetAboutUsInfoQuery,
  useGetAllUserBeachesInfoQuery,
  useGetAllUserDevicesInfoQuery,
  useGetAllUserRestaurantsInfoQuery,
  useGetAllUserShopsInfoQuery,
  useGetAllUserSightsInfoQuery,
  useGetBeachInfoQuery,
  useGetDeviceInfoQuery,
  useGetRestaurantInfoQuery,
  useGetShopInfoQuery,
  useGetSightInfoQuery,
  useUpdateAboutUsMutation,
  useUpdateBeachMutation,
  useUpdateDeviceMutation,
  useUpdateRestaurantMutation,
  useUpdateShopMutation,
  useUpdateSightMutation,
} from "@/api/api";
import { formatDateString, formatImageUrl } from "@/utils/functions";
import PageHeader from "@/components/PageHeader";

interface IProps {
  type: "devices" | "sights" | "shops" | "restaurants" | "beaches" | "about us";
}

type PossibleInterfaces =
  | IDevice
  | IBeach
  | IRestaurant
  | ISight
  | INewAboutUs
  | IBasic;

type PossibleNewInterfaces =
  | INewDevice
  | INewBeach
  | INewRestaurant
  | INewBasicWithPostion
  | INewAboutUs;

const ICON_SIZE = 50;
const ICON_COLOR = "#adb5bd";
const handleId = (
  type: IProps["type"],
  data: IRestaurant | IBeach | IDevice | ISight | IShop,
) => {
  if ("restaurantId" in data) {
    return data.restaurantId;
  } else if ("beachId" in data) {
    return data.beachId;
  } else if ("deviceId" in data) {
    return data.deviceId;
  } else if ("sightId" in data) {
    return data.sightId;
  } else if ("shopId" in data) {
    return data.shopId;
  } else {
    return "";
  }
};

const newDocFields = (
  docData: PossibleNewInterfaces,
  files: File[],
  apartmentId: string,
) => {
  const formData = new FormData();

  for (const key in docData) {
    if (docData.hasOwnProperty(key)) {
      const typedKey = key as keyof Partial<PossibleNewInterfaces>;
      const value = docData[typedKey];

      if (value !== undefined) {
        if (typeof value === "string" || typeof value === "number") {
          formData.append(typedKey, value.toString());
        }
      }
    }
  }

  // Handle files
  files.forEach((file) => {
    formData.append("images", file);
  });

  // Append apartmentId separately as it's always a string
  formData.append("apartmentId", apartmentId);

  return formData;
};

const updateDocFields = (
  docData: PossibleNewInterfaces,
  files: File[] | undefined,
  docImgUrls: string[] | undefined,
) => {
  const formData = new FormData();

  for (const key in docData) {
    if (docData.hasOwnProperty(key)) {
      const typedKey = key as keyof Partial<PossibleNewInterfaces>;
      const value = docData[typedKey];

      if (value !== undefined) {
        // Convert to string if necessary, based on the expected type
        formData.append(typedKey, value.toString());
      }
    }
  }

  if (docImgUrls) {
    docImgUrls.forEach((url, index) => {
      formData.append(`imagesUrlArray[${index}]`, url);
    });
  }

  if (files) {
    files.forEach((file) => {
      formData.append("images", file);
    });
  }

  return formData;
};

const NewItemPage = ({ type }: IProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY ?? "",
  });
  const formRef = useRef(null);
  const [data, setData] = useState<PossibleNewInterfaces>();
  const [files, setFiles] = useState<File[] | undefined>();
  const [docImgUrls, setDocImgUrls] = useState<string[] | undefined>();
  const url = useLocation();
  const { id, apartmentId } = useParams();

  const handleData = (
    type: IProps["type"],
    id: string | undefined,
    apartmentId: string,
  ) => {
    if (id)
      switch (type) {
        case "beaches":
          return useGetBeachInfoQuery(id);
        case "restaurants":
          return useGetRestaurantInfoQuery(id);
        case "devices":
          return useGetDeviceInfoQuery(id);
        case "sights":
          return useGetSightInfoQuery(id);
        case "shops":
          return useGetShopInfoQuery(id);

        default:
          return { data: undefined };
      }
    if (apartmentId) {
      return useGetAboutUsInfoQuery(apartmentId);
    }
    return { data: undefined };
  };
  const handleGetAttractionsFromOtherApartments = (
    type: IProps["type"],
    apartmentId: string,
    id: string | undefined,
  ) => {
    if (!id)
      switch (type) {
        case "beaches":
          return useGetAllUserBeachesInfoQuery(apartmentId);
        case "restaurants":
          return useGetAllUserRestaurantsInfoQuery(apartmentId);
        case "shops":
          return useGetAllUserShopsInfoQuery(apartmentId);
        case "sights":
          return useGetAllUserSightsInfoQuery(apartmentId);
        case "devices":
          return useGetAllUserDevicesInfoQuery(apartmentId);
        default:
          return { data: undefined };
      }

    return { data: undefined };
  };
  const { data: editData } = handleData(type, id, apartmentId ?? "");
  const { data: otherAttractions } = handleGetAttractionsFromOtherApartments(
    type,
    apartmentId ?? "",
    id,
  );

  const isEditPage = () => {
    return data !== undefined;
  };

  useEffect(() => {
    if (editData) {
      setDocImgUrls(editData.imagesUrl ?? []);
      setData(editData);
    }
    getDefaultValues(editData);
  }, [url, editData]);

  const handleAddItem = (type: IProps["type"]) => {
    switch (type) {
      case "about us":
        return useAddAboutUsMutation();
      case "sights":
        return useAddSightMutation();
      case "beaches":
        return useAddBeachMutation();
      case "devices":
        return useAddDeviceMutation();
      case "restaurants":
        return useAddRestaurantMutation();
      case "shops":
        return useAddShopMutation();
    }
  };
  const handleUpdateItem = (type: IProps["type"]) => {
    switch (type) {
      case "about us":
        return useUpdateAboutUsMutation();
      case "sights":
        return useUpdateSightMutation();
      case "beaches":
        return useUpdateBeachMutation();
      case "devices":
        return useUpdateDeviceMutation();
      case "restaurants":
        return useUpdateRestaurantMutation();
      case "shops":
        return useUpdateShopMutation();
    }
  };
  const handleAddExistingItem = (type: IProps["type"]) => {
    switch (type) {
      case "devices":
        return useAddExistingDeviceMutation();
      case "sights":
        return useAddExistingSightMutation();
      case "shops":
        return useAddExistingShopMutation();
      case "restaurants":
        return useAddExistingRestaurantMutation();
      case "beaches":
        return useAddExistingBeachMutation();
      default:
        return useAddExistingDeviceMutation();
    }
  };

  const [addItem] = handleAddItem(type);
  const [updateItem] = handleUpdateItem(type);
  const [addExistingAttraction] = handleAddExistingItem(type);

  const getDefaultValues = (data: PossibleInterfaces | undefined) => {
    if (!data) {
      setValue("terrainType", "gravel");
      setValue("lat", 45.3271);
      setValue("lng", 14.4422);
      return;
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        setValue(
          key as keyof PossibleInterfaces,
          data[key as keyof PossibleInterfaces],
        );
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const images = filterImageFiles(acceptedFiles);
    if (images.length) {
      if (images.length === 0) {
        if (images[0]) {
          setFiles([images[0]]);
          setValue("titleImage", 0);
        }
      } else {
        setFiles([...images]);
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 20,
    accept: {
      "image/*": [".jpeg", ".png", ".webp"],
    },
  });

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
  } = useForm<PossibleNewInterfaces>({
    resolver: zodResolver(handleSchemaType() as ZodType<any, any, any>),
  });

  const textareaRegisterProps =
    type !== "about us" ? register("description") : register("aboutUs");
  const titleRegisterProps =
    type !== "about us" ? register("title") : register("moto");

  function handleSchemaType() {
    switch (type) {
      case "beaches":
        return NewBeachSchema;
      case "restaurants":
        return NewRestaurantSchema;
      case "shops":
        return NewItemBasicSchema;
      case "sights":
        return NewItemBasicSchema;
      case "devices":
        return NewDeviceSchema;
      case "about us":
        return AboutUsSchema;
      default:
        return NewRestaurantSchema;
    }
  }

  function filterImageFiles(fileArray: File[] | null): File[] {
    const imageFiles: File[] = [];

    if (fileArray?.length) {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        if (file && file.type.startsWith("image/")) {
          imageFiles.push(file);
        }
      }
    }
    return imageFiles;
  }

  const deleteImageFromStorage = async (imgUrl: string) => {
    setDocImgUrls((prevState) => prevState?.filter((url) => url !== imgUrl));
  };

  const updateExistingItem = async (updatedData: PossibleNewInterfaces) => {
    clearErrors();

    if (!id) return;
    if (getValues("titleImage") === undefined) return;
    if (files === undefined && docImgUrls === undefined) {
      setError("root", { message: "Upload at least one image" });
      return;
    }

    try {
      await updateItem({
        data: updateDocFields(updatedData, files, docImgUrls),
        id: id,
      });
    } catch (e) {
      console.log(e);
    }
    setFiles([]);
  };

  const addNewItem = async (data: PossibleNewInterfaces) => {
    clearErrors();

    if (!apartmentId) return;
    if (getValues("titleImage") === undefined) return;
    if (!files) {
      setError("root", { message: "Upload at least one image" });
      return;
    }

    try {
      await addItem(newDocFields(data, files, apartmentId));
    } catch (e) {
      console.log(e);
    }
    reset();
    setFiles([]);
  };

  const addExistingItem = async (id: string) => {
    if (!apartmentId) return;
    try {
      await addExistingAttraction({
        attractionId: id,
        apartmentId: apartmentId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    setValue("lat", e.latLng?.lat() ?? 0);
    setValue("lng", e.latLng?.lng() ?? 0);
  };

  return (
    <Sidebar>
      <PageHeader
        title={isEditPage() ? `Edit ${type} entry` : `Add new ${type} entry`}
      >
        {isEditPage() ? (
          <button type="submit" form={"itemForm"}>
            <FaCheck />
            Save
          </button>
        ) : (
          <button type="submit" form={"itemForm"}>
            <FaPlus />
            Add
          </button>
        )}
      </PageHeader>
      <div className={"itemForm"}>
        <form
          id={"itemForm"}
          className={"itemForm__form"}
          onSubmit={handleSubmit(
            isEditPage() ? updateExistingItem : addNewItem,
          )}
        >
          <div className={"itemForm__form__top"}>
            <div
              className={"itemForm__form__top__dropzone"}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className={"itemForm__form__top__dropzone__inside"}>
                <RiImageAddFill size={ICON_SIZE} color={ICON_COLOR} />
                {isDragActive ? (
                  <div>Drop the files here ...</div>
                ) : (
                  <div>
                    Click to select an asset or drag and drop in this area
                  </div>
                )}
              </div>
            </div>
            <div className={"itemForm__form__top__input"}>
              <div>
                <label>{type !== "about us" ? "Title" : "Moto"}</label>
                <input
                  disabled={isSubmitting}
                  placeholder={
                    type !== "about us"
                      ? "Enter title"
                      : "Enter you company moto"
                  }
                  {...titleRegisterProps}
                />
                {"title" in errors && errors.title?.message && (
                  <div className="text-danger">{errors.title.message}</div>
                )}
                {"moto" in errors && errors.moto?.message && (
                  <div className="text-danger">{errors.moto.message}</div>
                )}
              </div>
              {"titleImage" in errors && errors.titleImage?.message && (
                <div className="text-danger">
                  Molimo odaberite jednu sliku kao title
                </div>
              )}
              {errors.root && (
                <div className="text-danger">{errors.root.message}</div>
              )}
              {type === "beaches" && (
                <div>
                  <label>Terrain type</label>
                  <select disabled={isSubmitting} {...register("terrainType")}>
                    <option value="gravel">Gravel</option>
                    <option value="sand">Sand</option>
                  </select>
                  {"terrainType" in errors && errors.terrainType?.message && (
                    <div className="text-danger">
                      {errors.terrainType.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={"itemForm__form__bottom"}>
            <div className={"itemForm__form__bottom__images"}>
              {files?.length !== 0 &&
                files?.map((file, index) => {
                  return (
                    <div
                      key={index}
                      className={"itemForm__form__bottom__images__container"}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        width="auto"
                        height="100px"
                      />
                      <button
                        className={
                          "itemForm__form__bottom__images__container__delete"
                        }
                        type={"button"}
                        disabled={isSubmitting}
                        onClick={() =>
                          setFiles(
                            files.filter((stateFile) => stateFile !== file),
                          )
                        }
                      >
                        Remove
                      </button>
                      <button
                        className={
                          "itemForm__form__bottom__images__container__titleImage"
                        }
                        type={"button"}
                        disabled={isSubmitting || watch("titleImage") === index}
                        onClick={() => setValue("titleImage", index)}
                      >
                        Title Image
                      </button>
                    </div>
                  );
                })}

              {docImgUrls?.length !== 0 &&
                docImgUrls?.map((imgUrl) => {
                  return (
                    <div
                      key={imgUrl}
                      className={"itemForm__form__bottom__images__container"}
                    >
                      <img
                        src={formatImageUrl(imgUrl)}
                        alt={formatImageUrl(imgUrl)}
                        width="auto"
                        height="100px"
                      />
                      <button
                        className={
                          "itemForm__form__bottom__images__container__delete"
                        }
                        type={"button"}
                        disabled={isSubmitting}
                        onClick={() => deleteImageFromStorage(imgUrl)}
                      >
                        Remove
                      </button>
                      <button
                        className={
                          "itemForm__form__bottom__images__container__titleImage"
                        }
                        type={"button"}
                        disabled={
                          isSubmitting || watch("titleImage") === imgUrl
                        }
                        onClick={() => setValue("titleImage", imgUrl)}
                      >
                        Title Image
                      </button>
                    </div>
                  );
                })}
            </div>
            <div className={"itemForm__form__bottom__input"}>
              <label>{type !== "about us" ? "Description" : "About Us"}</label>
              <textarea
                rows={10}
                disabled={isSubmitting}
                placeholder={
                  type !== "about us"
                    ? "Enter your description here..."
                    : "About Us"
                }
                {...textareaRegisterProps}
              />
              {"description" in errors && errors.description && (
                <div className="text-danger">{errors.description.message}</div>
              )}
              {"aboutUs" in errors && errors.aboutUs && (
                <div className="text-danger">{errors.aboutUs.message}</div>
              )}
            </div>

            {type === "restaurants" && (
              <>
                <div className={"itemForm__form__bottom__input"}>
                  <label htmlFor={"rating"}>Rating</label>
                  <input
                    id={"rating"}
                    type="number"
                    placeholder="From 1 to 5 how many stars restaurant has"
                    disabled={isSubmitting}
                    step={0.1}
                    {...register("review")}
                  />
                  {"review" in errors && errors.review?.message && (
                    <div className="text-danger">{errors.review.message}</div>
                  )}
                </div>
                <div className={"itemForm__form__bottom__input"}>
                  <label htmlFor={"reviews"}>Number of Reviews</label>
                  <input
                    id={"reviews"}
                    disabled={isSubmitting}
                    type="number"
                    placeholder="Number of reviews"
                    {...register("reviewAmount")}
                  />
                  {"reviewAmount" in errors && errors.reviewAmount?.message && (
                    <div className="text-danger">
                      {errors.reviewAmount.message}
                    </div>
                  )}
                </div>
                <div className={"itemForm__form__bottom__input"}>
                  <label>Email</label>
                  <input
                    disabled={isSubmitting}
                    type="email"
                    placeholder="Email"
                    {...register("contacts.email")}
                  />
                  {"contacts" in errors && errors.contacts?.email?.message && (
                    <div className="text-danger">
                      {errors.contacts?.email?.message}
                    </div>
                  )}
                </div>
                <div className={"itemForm__form__bottom__input"}>
                  <label>Phone Number</label>
                  <input
                    disabled={isSubmitting}
                    type="string"
                    placeholder="Phone number"
                    {...register("contacts.number")}
                  />
                  {"contacts" in errors && errors.contacts?.number?.message && (
                    <div className="text-danger">
                      {errors.contacts?.number?.message}
                    </div>
                  )}
                </div>
              </>
            )}

            {type !== "devices" && type !== "about us" && (
              <div className={"itemForm__form__bottom__input"}>
                <label>Location</label>
                <div style={{ height: "300px", width: "100%" }}>
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
                </div>
              </div>
            )}
          </div>
        </form>
        {type !== "about us" && (
          <div className={"itemForm__locale"}>
            {!isEditPage() ? (
              <>
                <div className={"itemForm__locale__title"}>
                  Add already existing {type}
                </div>
                {otherAttractions?.length !== 0 ? (
                  otherAttractions?.map((attraction) => {
                    return (
                      <div
                        className={"itemForm__locale__add"}
                        key={handleId(type, attraction)}
                      >
                        <div>{attraction.title}</div>
                        <button
                          type={"button"}
                          onClick={() =>
                            addExistingItem(handleId(type, attraction))
                          }
                        >
                          <FaPlus />
                          Add
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div>No other {type}</div>
                )}
              </>
            ) : (
              <>
                <div className={"itemForm__locale__title"}>Information</div>
                <div className={"itemForm__locale__row"}>
                  <span className={"itemForm__locale__row__desc"}>
                    Last updated
                  </span>
                  <span className={"itemForm__locale__row__value"}>
                    {formatDateString(editData?.updatedAt?.toString() ?? "")}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default NewItemPage;

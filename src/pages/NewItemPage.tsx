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
  ISight,
} from "../interfaces/NewItemInterface";
import { useForm } from "react-hook-form";
import {
  NewBeachSchema,
  NewDeviceSchema,
  NewItemBasicSchema,
  NewRestaurantSchema,
} from "../schemas/NewItemSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useLocation, useParams } from "react-router-dom";
import { IAboutUs } from "@/interfaces/AboutUsInterface";
import { AboutUsSchema } from "@/schemas/AboutUsSchema";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { useDropzone } from "react-dropzone";
import { RiImageAddFill } from "react-icons/ri";
import {
  useAddBeachMutation,
  useAddDeviceMutation,
  useAddRestaurantMutation,
  useAddShopMutation,
  useAddSightMutation,
  useGetAboutUsInfoQuery,
  useGetBeachInfoQuery,
  useGetDeviceInfoQuery,
  useGetRestaurantInfoQuery,
  useGetShopInfoQuery,
  useGetSightInfoQuery,
} from "@/api/api";
import accept from "attr-accept";
import { UseQueryHookResult } from "@reduxjs/toolkit/src/query/react/buildHooks";
import { QueryReturnValue } from "@reduxjs/toolkit/src/query/baseQueryTypes";
import { formatImageUrl } from "@/utils/functions";

interface IProps {
  type: "devices" | "sights" | "shops" | "restaurants" | "beaches" | "about us";
}

type PossibleInterfaces =
  | IDevice
  | IBeach
  | IRestaurant
  | ISight
  | IAboutUs
  | IBasic;

type PossibleNewInterfaces =
  | INewDevice
  | INewBeach
  | INewRestaurant
  | INewBasicWithPostion
  | IAboutUs;

const ICON_SIZE = 50;
const ICON_COLOR = "#adb5bd";

const newDocFields = (
  docData: PossibleNewInterfaces,
  files: File[],
  apartmentId: string,
) => {
  const formData = new FormData();

  if ("title" in docData) {
    formData.append("title", docData.title);
  }
  if ("lat" in docData) {
    formData.append("lat", docData.lat.toString());
    formData.append("lng", docData.lng.toString());
  }
  if ("description" in docData) {
    formData.append("description", docData.description);
  }
  if ("terrainType" in docData) {
    formData.append("terrainType", docData.terrainType);
  }

  if ("moto" in docData) {
    formData.append("moto", docData.moto);
  }

  if ("aboutUs" in docData) {
    formData.append("aboutUs", docData.aboutUs);
  }

  if ("review" in docData) {
    formData.append("review", docData.review.toString());
  }
  if ("reviewAmount" in docData) {
    formData.append("reviewAmount", docData.reviewAmount.toString());
  }
  if ("contacts" in docData) {
    formData.append("emailContact", docData.contacts.email);
    formData.append("phoneContact", docData.contacts.number);
  }

  formData.append("titleImage", docData.titleImage?.toString() ?? "0");
  formData.append("apartmentId", apartmentId);

  files.forEach((file) => {
    formData.append("images", file);
  });

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

  const handleData = (type: IProps["type"], id: string) => {
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
      case "about us":
        return useGetAboutUsInfoQuery(id);
    }
  };
  const { data: editData } = id ? handleData(type, id) : { data: undefined };

  useEffect(() => {
    if (id && !url.pathname.includes("new") && editData) {
      setDocImgUrls(editData.imagesUrl ?? []);
      setData(editData);
      getDefaultValues(editData);
    }
  }, [url, editData]);

  const handleAddItem = (type: IProps["type"]) => {
    switch (type) {
      case "about us":
        return useAddBeachMutation();
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

  const [addItem, { isLoading }] = handleAddItem(type);

  const getDefaultValues = (data: PossibleInterfaces | undefined) => {
    if (!data) {
      setValue("terrainType", "gravel");
      setValue("lat", 45.3271);
      setValue("lng", 14.4422);
      return;
    }
    console.log(data);

    if ("terrainType" in data) {
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("titleImage", data.titleImage);
      setValue("lat", data.location.coordinates[1]);
      setValue("lng", data.location.coordinates[0]);
      setValue("terrainType", data.terrainType);
    } else if ("review" in data) {
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("titleImage", data.titleImage);
      setValue("lat", data.location.coordinates[1]);
      setValue("lng", data.location.coordinates[0]);
      setValue("contacts.email", data.emailContact);
      setValue("contacts.number", data.phoneContact);
      setValue("reviewAmount", data.reviewAmount);
      setValue("review", data.review);
    } else if ("location" in data) {
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("titleImage", data.titleImage);
      setValue("lat", data.location.coordinates[1]);
      setValue("lng", data.location.coordinates[0]);
    } else if ("title" in data) {
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("titleImage", data.titleImage);
    } else if ("aboutUs" in data) {
      setValue("aboutUs", data.aboutUs);
      setValue("moto", data.moto);
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
    // defaultValues: getDefaultValues(editData),
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

  const updateItem = async (updatedData: PossibleNewInterfaces) => {
    clearErrors();

    if (!id) return;
    if (getValues("titleImage") === undefined) return;
    if (files === undefined && docImgUrls === undefined) {
      setError("root", { message: "Upload at least one image" });
      return;
    }

    try {
      let filesUrl: string[] | undefined = undefined;
      if (files?.length) {
        // filesUrl = await imagesUpload(files);
      }
      // const docRef = doc(db, transformToPlural(type), params?.id ?? "aboutUs");
      // await updateDoc(docRef, newDocFields(updatedData, filesUrl));
    } catch (e) {
      console.log(e);
    }
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

  const isEditPage = () => {
    if (data !== undefined) return true;
    return url.pathname.includes("edit");
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    setValue("lat", e.latLng?.lat() ?? 0);
    setValue("lng", e.latLng?.lng() ?? 0);
  };

  return (
    <Sidebar>
      <div className={"pageHeader"}>
        <div className={"pageHeader__title"}>
          {isEditPage() ? `Edit ${type} entry` : `Add new ${type} entry`}
        </div>
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
      </div>
      <div className={"itemForm"}>
        <form
          id={"itemForm"}
          className={"itemForm__form"}
          onSubmit={handleSubmit(isEditPage() ? updateItem : addNewItem)}
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
        <div className={"itemForm__locale"}></div>
      </div>
    </Sidebar>
  );
};

export default NewItemPage;

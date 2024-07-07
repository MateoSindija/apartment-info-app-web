import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Button, Form, ProgressBar } from "react-bootstrap";
import {
  INewBasicWithPostion,
  INewBeach,
  INewDevice,
  INewRestaurant,
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

interface IProps {
  type: "beach" | "attraction" | "restaurant" | "shop" | "device" | "aboutUs";
}

type PossibleInterfaces =
  | INewBasicWithPostion
  | INewBeach
  | INewRestaurant
  | INewDevice
  | IAboutUs;

const NewItemPage = ({ type }: IProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY ?? "",
  });
  const [data, setData] = useState<PossibleInterfaces | undefined>();
  const [files, setFiles] = useState<File[] | undefined>();
  const [docImgUrls, setDocImgUrls] = useState<string[] | undefined>();
  const [progress, setProgress] = useState(0);
  const params = useParams<{ id: string | undefined }>();
  const url = useLocation();

  useEffect(() => {
    getDocData();
  }, []);
  const getDefaultValues = (
    data: PossibleInterfaces | undefined,
  ): Partial<PossibleInterfaces> => {
    if (!data)
      return {
        terrainType: "gravel",
        lat: 45.3271,
        lng: 14.4422,
      };
    if ("terrainType" in data) {
      return {
        title: data.title,
        lat: data.lat,
        lng: data.lng,
        description: data.description,
        terrainType: data.terrainType,
        titleImage: data.titleImage,
      } as INewBeach;
    } else if ("review" in data) {
      return {
        title: data.title,
        lat: data.lat,
        lng: data.lng,
        description: data.description,
        review: data.review,
        reviewAmount: data.reviewAmount,
        contacts: data.contacts,
        titleImage: data.titleImage,
      } as INewRestaurant;
    } else if ("lat" in data) {
      return {
        title: data.title,
        lat: data.lat,
        lng: data.lng,
        description: data.description,
        titleImage: data.titleImage,
      } as INewBasicWithPostion;
    } else if ("title" in data) {
      return {
        title: data.title,
        description: data.description,
        titleImage: data.titleImage,
      } as INewDevice;
    } else if ("aboutUs" in data) {
      return {
        aboutUs: data.aboutUs,
        moto: data.moto,
      };
    }
    return {};
  };

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
  } = useForm<PossibleInterfaces>({
    resolver: zodResolver(handleSchemaType() as ZodType<any, any, any>),
    defaultValues: getDefaultValues(undefined),
  });

  const textareaRegisterProps =
    type !== "aboutUs" ? register("description") : register("aboutUs");
  const titleRegisterProps =
    type !== "aboutUs" ? register("title") : register("moto");

  const getDocData = async () => {
    if (type !== "aboutUs" && !params.id) return;
    // const docRef = doc(db, transformToPlural(type), params?.id ?? "aboutUs");
    // const docSnap = await getDoc(docRef);
    // const docData = docSnap.data() as PossibleInterfaces;
    // if ("imagesUrl" in docData) {
    //   setDocImgUrls(docData.imagesUrl);
    // }
    // setData({ ...docData, id: docSnap.id });
    // reset(getDefaultValues(docData));
  };
  console.log(errors);
  const imagesUpload = async (images: File[]): Promise<string[]> => {
    let urlArray: string[] = [];

    return new Promise((resolve, reject) => {
      images.map((image) => {
        const storageRef = ref(
          getStorage(),
          `images/${type}/${image.name + Math.random()}`,
        );
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
          },
          (err) => {
            reject(false);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            urlArray.push(url);

            if (urlArray.length === images.length) {
              resolve(urlArray);
            }
          },
        );
        return null;
      });
    });
  };

  function handleSchemaType() {
    switch (type) {
      case "beach":
        return NewBeachSchema;
      case "restaurant":
        return NewRestaurantSchema;
      case "shop":
        return NewItemBasicSchema;
      case "attraction":
        return NewItemBasicSchema;
      case "device":
        return NewDeviceSchema;
      case "aboutUs":
        return AboutUsSchema;
      default:
        return NewRestaurantSchema;
    }
  }

  const transformToPlural = (
    type: "beach" | "attraction" | "restaurant" | "shop" | "device" | "aboutUs",
  ) => {
    switch (type) {
      case "beach":
        return "Beaches";
      case "restaurant":
        return "Restaurants";
      case "shop":
        return "Shops";
      case "attraction":
        return "Attractions";
      case "device":
        return "Devices";
      case "aboutUs":
        return "AboutUs";
      default:
        return "Beaches";
    }
  };

  function filterImageFiles(fileList: FileList | null): File[] {
    const imageFiles: File[] = [];

    if (fileList?.length) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);

        if (file && file.type.startsWith("image/")) {
          imageFiles.push(file);
        }
      }
    }
    return imageFiles;
  }

  const handleTitleImage = (
    urlArray: string[],
    titleImage: string | number,
  ) => {
    const parsedTitleImage = parseInt(titleImage.toString());

    if (!isNaN(parsedTitleImage)) {
      if (parsedTitleImage < 0) return urlArray[0];
      return urlArray[parsedTitleImage];
    }
    return titleImage;
  };

  const handleFileUpload = (
    amount: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const images = filterImageFiles(event.currentTarget.files);
    if (images.length) {
      if (amount === "single") {
        if (images[0]) {
          setFiles([images[0]]);
          setValue("titleImage", 0);
        }
      } else {
        setFiles([...images]);
      }
    }
  };

  const newDocFields = (
    docData: PossibleInterfaces,
    filesUrl: string[] | undefined,
  ) => {
    return {
      ...("title" in docData && { title: docData.title }),
      ...(!("moto" in docData) && {
        titleImage: handleTitleImage(filesUrl ?? [], docData.titleImage ?? ""),
      }),
      ...(filesUrl?.length && { imagesUrl: arrayUnion(...filesUrl) }),
      ...("lat" in docData && { lat: docData.lat }),
      ...("lng" in docData && { lng: docData.lng }),
      ...("description" in docData && {
        description: docData.description,
      }),
      ...("terrainType" in docData && {
        terrainType: docData.terrainType,
      }),
      ...("moto" in docData && { moto: docData.moto }),
      ...("aboutUs" in docData && { aboutUs: docData.aboutUs }),
      ...("review" in docData && { review: docData.review }),
      ...("reviewAmount" in docData && {
        reviewAmount: docData.reviewAmount,
      }),
      ...("contacts" in docData && {
        contacts: {
          email: docData.contacts.email,
          number: docData.contacts.number,
        },
      }),
    };
  };

  const deleteImageFromStorage = async (imgUrl: string) => {
    setDocImgUrls((prevState) => prevState?.filter((url) => url !== imgUrl));
    // const docRef = doc(db, transformToPlural(type), params?.id ?? "");
    // await updateDoc(docRef, { imagesUrl: arrayRemove(imgUrl) });
    await deleteObject(ref(getStorage(), imgUrl));
  };

  const updateItem = async (updatedData: PossibleInterfaces) => {
    clearErrors();

    if (type !== "aboutUs" && getValues("titleImage") === undefined) return;
    if (type !== "aboutUs" && files === undefined && docImgUrls === undefined) {
      setError("root", { message: "Upload at least one image" });
      return;
    }

    try {
      let filesUrl: string[] | undefined = undefined;
      if (files?.length) {
        filesUrl = await imagesUpload(files);
      }
      // const docRef = doc(db, transformToPlural(type), params?.id ?? "aboutUs");
      // await updateDoc(docRef, newDocFields(updatedData, filesUrl));
    } catch (e) {
      console.log(e);
    }
  };

  const addNewItem = async (data: PossibleInterfaces) => {
    clearErrors();

    if (type !== "aboutUs" && getValues("titleImage") === undefined) return;
    if (type !== "aboutUs" && files === undefined) {
      setError("root", { message: "Upload at least one image" });
      return;
    }

    try {
      let filesUrl: string[] | undefined;
      if (files?.length) {
        filesUrl = await imagesUpload(files);
      }
      // await addDoc(
      //   // collection(db, transformToPlural(type)),
      //   newDocFields(data, filesUrl),
      // );
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
    <Layout>
      <Form onSubmit={handleSubmit(isEditPage() ? updateItem : addNewItem)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{type !== "aboutUs" ? "Title" : "Moto"}</Form.Label>
          <Form.Control
            disabled={isSubmitting}
            placeholder={
              type !== "aboutUs" ? "Enter title" : "Enter you company moto"
            }
            {...titleRegisterProps}
          />
          {"title" in errors && errors.title?.message && (
            <div className="text-danger">{errors.title.message}</div>
          )}
          {"moto" in errors && errors.moto?.message && (
            <div className="text-danger">{errors.moto.message}</div>
          )}
        </Form.Group>

        {type === "beach" && (
          <Form.Group className="mb-3">
            <Form.Label>Terrain type</Form.Label>
            <Form.Select disabled={isSubmitting} {...register("terrainType")}>
              <option value="gravel">Gravel</option>
              <option value="sand">Sand</option>
            </Form.Select>
            {"terrainType" in errors && errors.terrainType?.message && (
              <div className="text-danger">{errors.terrainType.message}</div>
            )}
          </Form.Group>
        )}
        <Form.Group className="mb-3" controlId="formBasicDesc">
          <Form.Label>
            {type !== "aboutUs" ? "Description" : "About Us"}
          </Form.Label>
          <Form.Control
            disabled={isSubmitting}
            as="textarea"
            placeholder={type !== "aboutUs" ? "Description" : "About Us"}
            {...textareaRegisterProps}
          />
          {"description" in errors && errors.description && (
            <div className="text-danger">{errors.description.message}</div>
          )}
          {"aboutUs" in errors && errors.aboutUs && (
            <div className="text-danger">{errors.aboutUs.message}</div>
          )}
        </Form.Group>
        {type !== "device" && type !== "aboutUs" && (
          <Form.Group className="mb-3" controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
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
          </Form.Group>
        )}

        {type === "restaurant" && (
          <>
            <Form.Group controlId="formReview" className="mb-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                type="number"
                placeholder="Review"
                disabled={isSubmitting}
                step={0.1}
                {...register("review")}
              />
              {"review" in errors && errors.review?.message && (
                <div className="text-danger">{errors.review.message}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formReviewAmount" className="mb-3">
              <Form.Label>Number of Reviews</Form.Label>
              <Form.Control
                disabled={isSubmitting}
                type="number"
                placeholder="Number of reviews"
                {...register("reviewAmount")}
              />
              {"reviewAmount" in errors && errors.reviewAmount?.message && (
                <div className="text-danger">{errors.reviewAmount.message}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
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
            </Form.Group>
            <Form.Group controlId="Number" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
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
            </Form.Group>
          </>
        )}
        {type !== "aboutUs" && (
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Upload Photos</Form.Label>
            <Form.Control
              disabled={isSubmitting}
              type="file"
              multiple={
                type === "beach" ||
                type === "restaurant" ||
                type === "attraction"
              }
              accept="image/*"
              onChange={(e) =>
                handleFileUpload(
                  type === "beach" ||
                    type === "restaurant" ||
                    type === "attraction"
                    ? "multiple"
                    : "single",
                  e as React.ChangeEvent<HTMLInputElement>,
                )
              }
            />
          </Form.Group>
        )}
        {type !== "aboutUs" && (
          <div className="d-flex flex-wrap">
            {files?.length &&
              files.map((file, index) => {
                return (
                  <div key={index} className="d-flex flex-column ms-3 mb-3">
                    <img
                      src={URL.createObjectURL(file)}
                      width="auto"
                      height="100px"
                      className="mb-1"
                    />
                    <Button
                      disabled={isSubmitting}
                      variant="danger"
                      className="mb-1"
                      onClick={() =>
                        setFiles(
                          files.filter((stateFile) => stateFile !== file),
                        )
                      }
                    >
                      Delete
                    </Button>
                    <Button
                      disabled={isSubmitting || watch("titleImage") === index}
                      variant="primary"
                      onClick={() => setValue("titleImage", index)}
                    >
                      Title Image
                    </Button>
                  </div>
                );
              })}

            {docImgUrls?.length &&
              docImgUrls.map((imgUrl) => {
                return (
                  <div key={imgUrl} className="d-flex flex-column ms-3 mb-3">
                    <img
                      src={imgUrl}
                      alt={imgUrl}
                      width="auto"
                      height="100px"
                      className="mb-1"
                    />
                    <Button
                      disabled={isSubmitting}
                      className="mb-1"
                      variant="danger"
                      onClick={() => deleteImageFromStorage(imgUrl)}
                    >
                      Delete
                    </Button>
                    <Button
                      disabled={isSubmitting || watch("titleImage") === imgUrl}
                      variant="primary"
                      onClick={() => setValue("titleImage", imgUrl)}
                    >
                      Title Image
                    </Button>
                  </div>
                );
              })}
          </div>
        )}
        {"titleImage" in errors && errors.titleImage?.message && (
          <div>Molimo odaberite jednu sliku kao title</div>
        )}
        {errors.root && (
          <div className="text-danger">{errors.root.message}</div>
        )}
        {isSubmitting && <ProgressBar now={progress} />}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isEditPage() ? "Save changes" : "Add"}
        </Button>
      </Form>
    </Layout>
  );
};

export default NewItemPage;

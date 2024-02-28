import React, { useState } from "react";
import Layout from "../components/Layout.tsx";
import { Button, Container, Form, ProgressBar } from "react-bootstrap";
import {
  INewBeach,
  INewRestaurant,
  INewBasicWithPostion,
  INewDevice,
} from "../interfaces/NewItemInterface.ts";
import { useForm } from "react-hook-form";
import {
  NewBeachSchema,
  NewRestaurantSchema,
  NewItemBasicSchema,
  NewDeviceSchema,
} from "../schemas/NewItemSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.ts";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  useLoadScript,
  OverlayView,
} from "@react-google-maps/api";
import { Marker } from "react-google-maps";
import { getValue } from "@testing-library/user-event/dist/utils/index";
interface IProps {
  type: "beach" | "attraction" | "restaurant" | "shop" | "device";
}

type PossibleInterfaces =
  | INewBasicWithPostion
  | INewBeach
  | INewRestaurant
  | INewDevice;

const NewItemPage = ({ type }: IProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY ?? "",
  });
  const [files, setFiles] = useState<File[] | undefined>();
  const [progress, setProgress] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm<PossibleInterfaces>({
    resolver: zodResolver(handleSchemaType() as ZodType<any, any, any>),
    defaultValues: {
      terrainType: "gravel",
      lng: 14.4422,
      lat: 45.3271,
    },
  });

  const imagesUpload = async (images: File[]): Promise<string[]> => {
    let urlArray: string[] = [];

    return new Promise((resolve, reject) => {
      images.map((image) => {
        const storageRef = ref(
          getStorage(),
          `images/${type}/${image.name + Math.random()}`
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
          }
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
      default:
        return NewRestaurantSchema;
    }
  }

  const handleWhatCollection = () => {
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

  const handleFileUpload = (
    amount: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const images = filterImageFiles(event.currentTarget.files);
    if (images.length) {
      if (amount === "single") {
        if (images[0]) setFiles([images[0]]);
      } else {
        setFiles([...images]);
      }
    }
  };

  const addNewItem = async (data: PossibleInterfaces) => {
    clearErrors();
    if (files?.length) {
      try {
        let filesUrl = await imagesUpload(files);
        const docRef = await addDoc(collection(db, handleWhatCollection()), {
          title: data.title,
          imagesUrl: filesUrl,
          ...("lat" in data && { lat: data.lat }),
          ...("lng" in data && { lng: data.lng }),
          ...("description" in data && { description: data.description }),
          ...("terrainType" in data && { terrainType: data.terrainType }),
          ...("review" in data && { review: data.review }),
          ...("reviewAmount" in data && { reviewAmount: data.reviewAmount }),
          ...("contacts" in data && {
            contacts: {
              email: data.contacts.email,
              number: data.contacts.number,
            },
          }),
        });
      } catch (e) {
        console.log(e);
      }
      reset();
      setFiles([]);
    } else {
      setError("root", { message: "Upload at least one image" });
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    setValue("lat", e.latLng?.lat() ?? 0);
    setValue("lng", e.latLng?.lng() ?? 0);
  };

  return (
    <Layout>
      <Form onSubmit={handleSubmit(addNewItem)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control
            disabled={isSubmitting}
            placeholder="Enter name"
            {...register("title")}
          />
          {errors.title?.message && (
            <div className="text-danger">{errors.title.message}</div>
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
          <Form.Label>Description</Form.Label>
          <Form.Control
            disabled={isSubmitting}
            as="textarea"
            placeholder="Description"
            {...register("description")}
          />
          {"description" in errors && errors.description && (
            <div className="text-danger">{errors.description.message}</div>
          )}
        </Form.Group>
        {type !== "device" && (
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
              {"contacts.email" in errors && errors["contacts"]["email"] && (
                <div className="text-danger">
                  {errors["contacts"]["email"].message}
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
              {"contacts.number" in errors && errors["contacts"]["number"] && (
                <div className="text-danger">
                  {errors["contacts"]["number"].message}
                </div>
              )}
            </Form.Group>
          </>
        )}
        {type === "beach" || type === "restaurant" || type === "attraction" ? (
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Upload Photos</Form.Label>
            <Form.Control
              disabled={isSubmitting}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                handleFileUpload(
                  "multiple",
                  e as React.ChangeEvent<HTMLInputElement>
                )
              }
            />
          </Form.Group>
        ) : (
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Upload Photos</Form.Label>
            <Form.Control
              disabled={isSubmitting}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleFileUpload(
                  "single",
                  e as React.ChangeEvent<HTMLInputElement>
                )
              }
            />
          </Form.Group>
        )}
        {files?.length && (
          <div className="d-flex flex-wrap">
            {files.map((file, index) => {
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
                    onClick={() =>
                      setFiles(files.filter((stateFile) => stateFile !== file))
                    }
                  >
                    Delete
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        {errors.root && (
          <div className="text-danger">{errors.root.message}</div>
        )}
        {isSubmitting && <ProgressBar now={progress} />}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Add
        </Button>
      </Form>
    </Layout>
  );
};

export default NewItemPage;

import { z, ZodType } from "zod"; // Add new import
import {
  INewBasicWithPostion,
  INewBeach,
  INewDevice,
  INewRestaurant,
} from "../interfaces/NewItemInterface";
import { IApartment, INewApartment } from "@/interfaces/ApartmentIntefaces";

const NumberOrString = z.union([
  z.string(), // allows strings
  z.number().refine((value) => value >= 0, {
    message: "Value must be a number greater than or equal to 0",
  }), // allows numbers greater than or equal to 0
]);

export const NewBeachSchema: ZodType<INewBeach> = z.object({
  title: z.string().min(2).max(50),
  terrainType: z.union([z.literal("sand"), z.literal("gravel")]),
  description: z.string().min(2).max(1000),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  imagesUrl: z.array(z.string()).optional(),
  titleImage: NumberOrString,
});

export const NewRestaurantSchema: ZodType<INewRestaurant> = z.object({
  title: z.string().min(2).max(50),
  review: z.coerce.number().min(1).max(5),
  reviewAmount: z.coerce.number().min(0).max(10000),
  description: z.string().min(2).max(1000),
  contacts: z.object({
    email: z.string().email(),
    number: z.string().min(2).max(50),
  }),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  imagesUrl: z.array(z.string()).optional(),
  titleImage: NumberOrString,
});

export const NewItemBasicSchema: ZodType<INewBasicWithPostion> = z.object({
  title: z.string().min(2).max(50),
  lat: z.number().min(-90).max(90),
  description: z.string().min(2).max(1000),
  lng: z.number().min(-180).max(180),
  imagesUrl: z.array(z.string()).optional(),
  titleImage: NumberOrString,
});

export const NewDeviceSchema: ZodType<INewDevice> = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(1000),
  titleImage: NumberOrString,
});

export const NewApartmentSchema: ZodType<INewApartment> = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(2).max(200),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-90).max(90),
});

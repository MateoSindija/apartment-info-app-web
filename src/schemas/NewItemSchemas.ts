import { z, ZodType } from "zod"; // Add new import
import {
  INewBasicWithPostion,
  INewBeach,
  INewDevice,
  INewRestaurant,
} from "../interfaces/NewItemInterface";

export const NewBeachSchema: ZodType<INewBeach> = z.object({
  title: z.string().min(2).max(50),
  terrainType: z.union([z.literal("sand"), z.literal("gravel")]),
  description: z.string().min(2).max(1000),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  imagesUrl: z.array(z.string()).optional(),
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
});

export const NewItemBasicSchema: ZodType<INewBasicWithPostion> = z.object({
  title: z.string().min(2).max(50),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  imagesUrl: z.array(z.string()).optional(),
});

export const NewDeviceSchema: ZodType<INewDevice> = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(1000),
  imagesUrl: z.array(z.string()).optional(),
});

import { z, ZodType } from "zod";
import { IAboutUs, INewAboutUs } from "../interfaces/AboutUsInterface";
import { NumberOrString } from "@/schemas/NewItemSchemas";

export const AboutUsSchema: ZodType<INewAboutUs> = z.object({
  moto: z.string().min(2).max(50),
  aboutUs: z.string().min(2).max(1000),
  imagesUrl: z.array(z.string()).optional(),
  titleImage: NumberOrString,
});

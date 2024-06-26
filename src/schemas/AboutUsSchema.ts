import { z, ZodType } from "zod";
import { IAboutUs } from "../interfaces/AboutUsInterface";

export const AboutUsSchema: ZodType<IAboutUs> = z.object({
  moto: z.string().min(2).max(50),
  aboutUs: z.string().min(2).max(1000),
});

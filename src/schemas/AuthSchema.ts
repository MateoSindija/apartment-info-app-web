import { z, ZodType } from "zod"; // Add new import
import { ISignIn } from "../interfaces/AuthInterfaces";

export const SignInSchema: ZodType<ISignIn> = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SignUpSchema: ZodType<ISignIn> = z.object({
  email: z.string().email(),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  password: z.string().min(8).max(100),
});

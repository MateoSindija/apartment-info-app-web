import { z, ZodType } from "zod"; // Add new import
import { ISignIn } from "../interfaces/AuthInterfaces";

const SignInSchema: ZodType<ISignIn> = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default SignInSchema;

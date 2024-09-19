import React from "react";
import { ISignIn, ISignUp } from "@/interfaces/AuthInterfaces";
import { login, signup } from "@/redux/auth";
import { setUserData } from "@/redux/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/schemas/AuthSchema";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/store";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignUp>({
    resolver: zodResolver(SignUpSchema),
  });
  const signUp = async (data: ISignUp) => {
    try {
      await dispatch(signup(data))
        .unwrap()
        .then((result: any) => {
          dispatch(setUserData(result));
          navigate("/apartment-select", { replace: true });
        });
    } catch (error: any) {
      if (error.message.includes("409")) {
        setError("root", { message: "Email already in use" });
      } else {
        setError("root", error.message);
      }
    }
  };

  return (
    <form className={"signUpForm"} onSubmit={handleSubmit(signUp)}>
      <div className={"signUpForm__header"}>Create your account</div>
      <label htmlFor="firstName">First name</label>
      <input type="firstName" id={"firstName"} {...register("firstName")} />

      <label htmlFor="lastName">Last name</label>
      <input type="lastName" id={"lastName"} {...register("lastName")} />

      <label htmlFor="email">Email</label>
      <input type="email" id={"email"} {...register("email")} />

      <label htmlFor="password">Password</label>
      <input type="password" id={"password"} {...register("password")} />
      {errors.root && <div>{errors.root.message}</div>}
      <button type={"submit"}>Sign up</button>

      <div className={"signInForm__signUp"}>
        Already a member?
        <a href="/">Sign in</a>
      </div>
    </form>
  );
};

export default SignUp;

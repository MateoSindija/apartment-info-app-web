import React from "react";
import { ISignIn } from "@/interfaces/AuthInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SignInSchema from "@/schemas/SignInSchema";
import { useNavigate } from "react-router-dom";
import { login } from "@/redux/auth";
import { useAppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/user";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignIn>({
    resolver: zodResolver(SignInSchema),
  });
  const signIn = async ({ email, password }: ISignIn) => {
    await dispatch(login({ email: email, password: password }))
      .unwrap()
      .then((result: any) => {
        dispatch(setUserData(result));
        navigate("/beaches");
      })
      .catch((error) => {
        setError("root", { message: "Wrong email or password" });
      });
  };

  return (
    <form className={"signInForm"} onSubmit={handleSubmit(signIn)}>
      <h3 className={"signInForm__header"}>Welcome back!</h3>
      <div className={"signInForm__subHeader"}>Log in to your account</div>
      <label htmlFor="email">Email</label>
      <input type="email" id={"email"} {...register("email")} />
      <label htmlFor="password">Password</label>
      <input type="password" id={"password"} {...register("password")} />
      {errors.root && <div>{errors.root.message}</div>}
      <button type={"submit"}>Login</button>
    </form>
  );
};

export default SignIn;

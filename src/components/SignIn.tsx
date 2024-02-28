import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ISignIn } from "../interfaces/AuthInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SignInSchema from "../schemas/SignInSchema.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.ts";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignIn>({
    resolver: zodResolver(SignInSchema),
  });
  const signIn = async ({ email, password }: ISignIn) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result) {
        navigate("/beaches");
      }
    } catch (e) {
      setError("root", { message: "Wrong email or password" });
    }
  };

  return (
    <Form onSubmit={handleSubmit(signIn)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          {...register("email")}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          {...register("password")}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
      {errors.root && <div>{errors.root.message}</div>}
    </Form>
  );
};

export default SignIn;

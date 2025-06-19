"use client";

import { AUTH_API } from "@/api";
import LoadingButton from "@/app/@components/Buttons/LoadingButton";
import { PasswordInput } from "@/app/@components/Input";
import InputDefault from "@/app/@components/Input/InputDefault";
import { ERROR_MSGS } from "@/constants";
import { UserIcon } from "@/icons";
import toast from "@/lib/toast";
import { validationMsgs } from "@/lib/validationMsgs";
import { useRouter } from "next/navigation";
import React from "react";
import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  username: string;
  password: string;
}

const LoginCsrContent = () => {
  const {
    register,
    handleSubmit,
    formState: { isLoading },
  } = useForm<IFormInput>();
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      console.log("ola login");

      const { ...user } = await AUTH_API.login(data);
      console.log({ user });

      localStorage.setItem("user", JSON.stringify(user));
      router.push("/conversas");
    } catch (error: any) {
      if (error.status === 403)
        toast(ERROR_MSGS.LOGIN_FAILED, { type: "error" });
      else toast(ERROR_MSGS.TRY_AGAIN, { type: "error" });

      console.debug("Login failed:", error);
    }
  };

  const validation: {
    [key in keyof IFormInput]: RegisterOptions<IFormInput, key>;
  } = {
    username: {
      required: validationMsgs.required("username"),
    },
    password: {
      required: validationMsgs.required("password"),
    },
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputDefault
        id="username"
        type="text"
        label="username"
        placeholder="username"
        icon={<UserIcon />}
        iconRight={true}
        className="mb-5"
        {...register("username", validation.username)}
      />

      <PasswordInput
        id="password"
        label="Password"
        placeholder="Password"
        iconRight={true}
        {...register("password", validation.password)}
      />

      {/* <Link
      href="/auth/forgot-password"
      className="select-none font-satoshi text-base font-medium text-dark underline duration-300 hover:text-primary dark:text-white dark:hover:text-primary"
    >
      Forgot Password?
    </Link> */}

      <LoadingButton
        label="Entrar"
        isLoading={isLoading}
        className="mt-10 h-13 w-full py-[20px] text-xl font-extrabold"
      />
    </form>
  );
};

export default LoginCsrContent;

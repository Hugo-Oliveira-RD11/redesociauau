"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/app/@components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/app/@components/Layouts/DefaultLaout";
import InputDefault from "@/app/@components/Input/InputDefault";
import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { ERROR_MSGS } from "@/constants";
import LoadingButton from "@/app/@components/Buttons/LoadingButton";
import { AUTH_API } from "@/api";
import { validationMsgs } from "@/lib/validationMsgs";
import toast from "@/lib/toast";
import { useApp } from "@/app/@context/AppContext";

interface IFormInput {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isLoading },
  } = useForm<IFormInput>();
  const { setUsuario } = useApp();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const { ...user } = await AUTH_API.login(data);
      setUsuario(user);
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
    <DefaultLayout>
      <Breadcrumb pageName="Sign In" />

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <form onSubmit={handleSubmit(onSubmit)}>
                <InputDefault
                  id="username"
                  type="text"
                  label="username"
                  placeholder="username"
                  icon="mail"
                  iconRight={true}
                  className="mb-10"
                  {...register("username", validation.username)}
                />

                <InputDefault
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  icon="lock"
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
                  className="mt-15 w-full py-[20px]"
                />
              </form>
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Faça o login na sua conta
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Bem vindo de volta!
              </h1>

              {/* <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Please sign in to your account by completing the necessary
                fields below
              </p> */}

              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;

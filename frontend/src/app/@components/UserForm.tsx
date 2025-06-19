"use client";
import React, { useEffect, useState } from "react";
import ImageUploadCard from "./ImageUploadCard";
import { EmailIcon, TelephoneIcon, UserIcon } from "@/icons";
import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { validationMsgs } from "@/lib/validationMsgs";
import { USUARIOS_API } from "@/api";
import toast from "@/lib/toast";
import { useHookFormMask } from "use-mask-input";
import Button from "./Buttons/Button";
import { useRouter } from "next/navigation";
import { PwdInput, InputDefault } from "./Input";
import { Usuario } from "@/types";

interface IFormInput {
  email: string;
  nome: string;
  data_nascimento: string;
}

interface Props {
  usuario?: Usuario | null;
  passwordBox?: boolean;
}

const UserForm: React.FC<Props> = ({ usuario, passwordBox }) => {
  const {
    register,
    handleSubmit,
    formState: { isLoading, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      nome: usuario?.nome || "",
      data_nascimento: usuario?.data_nascimento || "",
      email: usuario?.email || "",
    },
  });
  const registerWithMask = useHookFormMask(register);
  const [selectedImage, setSelectedImage] = useState<File | undefined | string>(
    usuario?.foto_perfil
  );

  const router = useRouter();

  const validation: {
    [key in keyof IFormInput]: RegisterOptions<IFormInput, key>;
  } = {
    email: {
      required: validationMsgs.required("email"),
    },
    nome: {
      required: validationMsgs.required("nome"),
    },
    data_nascimento: {
      required: validationMsgs.required("data_nascimento"),
    },
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let msg;

    if (selectedImage instanceof File)
      Object.assign(data, { foto_perfil: selectedImage });

    await USUARIOS_API.create(data as any);

    router.push("/usuarios");
    toast("Usuário cadastro com sucesso", {
      type: "success",
      style: { backgroundColor: "#020D1A", color: "#fff" },
    });
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Cadastro
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <InputDefault
                    id="email"
                    type="text"
                    label="Email"
                    placeholder="Seu email"
                    icon={<EmailIcon />}
                    error={errors.email?.message}
                    {...register("email", validation.email)}
                  />
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <InputDefault
                    id="nome"
                    type="text"
                    label="Nome de Usuário"
                    placeholder="Seu Nome"
                    icon={<UserIcon />}
                    error={errors.nome?.message}
                    {...register("nome", validation.nome)}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    label="Cancelar"
                    type="button"
                    onClick={() => router.push("/usuarios")}
                    className="rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark transition hover:bg-slate-100 hover:shadow-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-4"
                    overrideClass
                  />
                  <Button
                    label="Salvar"
                    type="submit"
                    isLoading={isLoading}
                    className="px-6 py-[7px]"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        <ImageUploadCard
          setSelectedImage={setSelectedImage}
          selectedImage={selectedImage}
        />
      </div>
    </>
  );
};

export default UserForm;

"use client";

import Breadcrumb from "../@components/Breadcrumbs/Breadcrumb";
import UserForm from "../@components/UserForm";
import DefaultLaout from "../@components/Layouts/DefaultLaout";
import useLocalStorage from "../../hooks/useLocalStorage";
import React from "react";

const CadastroPage = () => {
  return (
    <DefaultLaout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Cadastre-se" />
        <UserForm />
      </div>
    </DefaultLaout>
  );
};

export default CadastroPage;

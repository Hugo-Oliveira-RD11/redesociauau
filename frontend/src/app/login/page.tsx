import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/app/@components/Breadcrumbs/Breadcrumb";
import LoginCsrContent from "./@csr/LoginCsrContent";

const LogIn: React.FC = () => {
  return (
    <div className="absolute flex h-full h-screen w-full overflow-hidden">
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <main>
          <div className="z-0 mx-auto max-w-screen-2xl p-4 md:p-6 2xl:px-5 2xl:py-10">
            <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
              <div className="flex flex-wrap items-center">
                <div className="w-full xl:w-1/2">
                  <div className="w-full p-4 sm:p-12.5 xl:p-15">
                    <div className="mb-15">
                      <Breadcrumb pageName="Login" />
                    </div>

                    <LoginCsrContent />
                  </div>
                </div>

                <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
                  <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
                    <Link className="mb-10 inline-block" href="/">
                      <Image
                        className="hidden dark:block"
                        src={"/images/logo/logo.png"}
                        alt="Logo"
                        width={400}
                        height={32}
                      />
                      <Image
                        className="dark:hidden"
                        src={"/images/logo/logo.png"}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default LogIn;

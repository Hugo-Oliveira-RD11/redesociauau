"use client";

import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import Image from "next/image";
import "@/css/tailwind.css";
import HamburgerToogleBtn from "../Buttons/HamburgerToogleBtn";
import dynamic from "next/dynamic";
import useSidebarStore from "@/store/useSidebarStore";

const DropdownUser = dynamic(() => import("./DropdownUser"), {
  ssr: false,
});

const Header = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  return (
    <header className="sticky top-0 z-40 flex w-full justify-between border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex w-full flex-grow items-end justify-between px-4 py-5 shadow-2 md:px-5 2xl:px-10">
        <div className="">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* <!-- Hamburger Toggle BTN --> */}
            <HamburgerToogleBtn
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            {/* <!-- Hamburger Toggle BTN --> */}

            {/* <Link className="block flex-shrink-0" href="/">
              <Image
                width={50}
                height={50}
                src={"/images/logo/logo-icon.png"}
                alt="Logo"
              />
            </Link> */}
          </div>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-between xl:w-auto xl:justify-normal">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Search Form --> */}
            {/* <SearchForm /> */}
            {/* <!-- Search Form --> */}

            {/* <!-- Dark Mode Toggle --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggle --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

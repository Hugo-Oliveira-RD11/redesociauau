"use client";

import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/app/@components/Sidebar/SidebarItem";
import ClickOutside from "@/app/@components/ClickOutside";
import {
  AntenaIcon,
  ChartIcon,
  HouseIcon,
  RoboticIcon,
  UserIcon,
} from "@/icons";
import ChatIcon from "@/icons/ChatIcon";
import Button from "../Buttons/Button";
import useSidebarStore from "@/store/useSidebarStore";
import { usePathname } from "next/navigation";
// import { IUser, UserRole } from "@/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const menuGroups = [
  {
    name: "MENU PRINCIPAL",
    menuItems: [
      {
        icon: <ChartIcon />,
        label: "Dashboard",
        route: "/dashboard",
        // roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
      },
      {
        icon: <AntenaIcon />,
        label: "Captadores",
        route: "/captadores",
        // roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
      },
      {
        icon: <RoboticIcon />,
        label: "Assistente",
        route: "/assistente",
        // roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
      },
      {
        icon: <HouseIcon />,
        label: "Loja",
        route: "/loja",
        // roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
      },
      {
        icon: <ChatIcon />,
        label: "Conversas",
        route: "/conversas",
        // roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.CAPTADOR],
      },
      {
        icon: <UserIcon size="26" />,
        label: "Usuários",
        route: "/usuarios",
        // roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();
  const [user] = useLocalStorage<any>("user", null);
  const router = useRouter();

  // const groupsFiltered = menuGroups.map(({ menuItems, name }) => {
  //   const itemsFiltered = menuItems.filter((menuItem) =>
  //     menuItem.roles.includes(user.role)
  //   );
  //   return { menuItems: itemsFiltered, name };
  // });

  // useEffect(() => {
  //   menuGroups.forEach((group) => {
  //     group.menuItems.forEach((menuItem) => {
  //       if (menuItem.route === pathname) {
  //         if (!menuItem.roles.includes(user?.role)) router.push("/conversas");
  //       }
  //     });
  //   });
  // }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </Button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          {/* <nav className="mt-1 px-4 lg:px-6">
            {groupsFiltered.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pathname}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav> */}
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;

import React from "react";
import Link from "next/link"; 
import SidebarDropdown from "@/app/@components/Sidebar/SidebarDropdown";

const SidebarItem = ({ item, pageName }: any) => {
  return (
    <>
      <li>
        {
          true &&
            <Link
              href={item.route}
              className={`${pageName === item.route ? 
                "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white" : 
                "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"} group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
            >
              {item.icon}
              {item.label}
              {item.message && (
                <span >
                  {item.message}
                </span>
              )}
              {item.pro && (
                <span >
                  Pro
                </span>
              )}
              {item.children && (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.5525 7.72801C10.81 7.50733 11.1899 7.50733 11.4474 7.72801L17.864 13.228C18.1523 13.4751 18.1857 13.9091 17.9386 14.1974C17.6915 14.4857 17.2575 14.5191 16.9692 14.272L10.9999 9.15549L5.03068 14.272C4.7424 14.5191 4.30838 14.4857 4.06128 14.1974C3.81417 13.9091 3.84756 13.4751 4.13585 13.228L10.5525 7.72801Z"
                    fill=""
                  />
                </svg>
              )}
            </Link>
        }

        {item.children && (
          <div
            className={`translate transform overflow-hidden ${
              pageName !== item.route && "hidden"
            }`}
          >
            <SidebarDropdown item={item.children} />
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;

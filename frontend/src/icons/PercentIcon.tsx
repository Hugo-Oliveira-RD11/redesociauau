import React from "react";

export default (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    {...props}
  >
    <path
      d="M4 20L20 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8.26777 4.73223C9.24408 5.70854 9.24408 7.29146 8.26777 8.26777C7.29146 9.24408 5.70854 9.24408 4.73223 8.26777C3.75592 7.29146 3.75592 5.70854 4.73223 4.73223C5.70854 3.75592 7.29146 3.75592 8.26777 4.73223Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M19.2678 15.7322C20.2441 16.7085 20.2441 18.2915 19.2678 19.2678C18.2915 20.2441 16.7085 20.2441 15.7322 19.2678C14.7559 18.2915 14.7559 16.7085 15.7322 15.7322C16.7085 14.7559 18.2915 14.7559 19.2678 15.7322Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

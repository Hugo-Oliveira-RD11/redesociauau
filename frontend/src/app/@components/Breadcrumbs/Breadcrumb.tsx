import Link from "next/link";
import { ReactElement } from "react";

interface BreadcrumbProps {
  pageName: string;
  nav?: boolean;
  rightContent?: ReactElement;
  className?: string;
}

const Breadcrumb = ({
  pageName,
  nav,
  rightContent,
  className,
}: BreadcrumbProps) => {
  return (
    <div
      className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName}
      </h2>

      {rightContent && rightContent}
      {nav && (
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">{pageName}</li>
          </ol>
        </nav>
      )}
    </div>
  );
};

export default Breadcrumb;

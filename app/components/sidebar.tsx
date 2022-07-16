import { Form, NavLink } from "@remix-run/react";
import { User } from "~/models/user.server";
import C from "classnames";
type HeaderProps = {
  user: User;
  isVisibleOnMobile: boolean;
};

const Sidebar = ({ user, isVisibleOnMobile }: HeaderProps) => {
  return (
    <>
      <aside
        id="sidebar"
        className={C(
          "transition-width fixed top-0 left-0 z-20 flex h-full w-64 flex-shrink-0 flex-col pt-16 duration-75 lg:flex",
          { hidden: !isVisibleOnMobile }
        )}
        aria-label="Sidebar"
      >
        <div className="relative flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white pt-0">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex-1 space-y-1 divide-y bg-white px-3">
              <ul className="space-y-2 pb-2">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "group flex items-center rounded-lg bg-gray-100 p-2 text-base font-normal text-gray-900"
                        : "group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100"
                    }
                  >
                    <svg
                      className="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span className="ml-3">Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/budgets"
                    className={({ isActive }) =>
                      isActive
                        ? "group flex items-center rounded-lg bg-gray-100 p-2 text-base font-normal text-gray-900"
                        : "group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100"
                    }
                  >
                    <svg
                      className="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span className="ml-3">Budgets</span>
                  </NavLink>

                  <NavLink
                    to="/assets"
                    className={({ isActive }) =>
                      isActive
                        ? "group flex items-center rounded-lg bg-gray-100 p-2 text-base font-normal text-gray-900"
                        : "group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100"
                    }
                  >
                    <svg
                      className="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span className="ml-3">Assets</span>
                  </NavLink>
                </li>
              </ul>
              <div className="space-y-2 pt-2">
                {user ? (
                  <a
                    href="#"
                    className="group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100"
                  >
                    <svg
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="ml-3 flex-1 whitespace-nowrap"
                      >
                        Logout
                      </button>
                    </Form>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={C("fixed inset-0 z-10 hidden bg-gray-900 opacity-50", {
          hidden: !isVisibleOnMobile,
        })}
        id="sidebarBackdrop"
      />
    </>
  );
};

export { Sidebar };

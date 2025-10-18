/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import logo from "@/assets/logo.svg";
import { logout } from "@/redux/features/authSlice";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { LuBookOpenText, LuSchool } from "react-icons/lu";
import { MdOutlineAssignment } from "react-icons/md";
import {
  PiBookBookmark,
  PiBookOpenTextDuotone,
  PiStudentDuotone,
} from "react-icons/pi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { SiGoogleclassroom } from "react-icons/si";
import { TbCategoryPlus } from "react-icons/tb";
import { TfiAngleDown, TfiAngleUp, TfiAnnouncement } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavbarSlider = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const path = usePathname();
  const { id, resourceId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth.role);
  console.log("authState", authState);

  const navigation = [
    {
      label: "Overview",
      route: "/",
      iconPath: <RxDashboard className="w-5 lg:w-6 h-5 lg:h-6" />,
    },

    ...(authState === "Student"
      ? [
        {
          label: "Overview",
          route: "/student/overview",
          iconPath: <RxDashboard className="w-5 lg:w-6 h-5 lg:h-6" />,
        },
        {
          label: "Book",
          route: "/student/books",
          iconPath: <LuBookOpenText className="w-5 lg:w-6 h-5 lg:h-6" />,
        },
        {
          label: "Assignment",
          route: "/student/assignments",
          iconPath: <MdOutlineAssignment className="w-5 lg:w-6 h-5 lg:h-6" />,
        },
        {
          label: "Announcements",
          route: "/student/announcements",
          iconPath: <TfiAnnouncement className="w-5 lg:w-6 h-5 lg:h-6" />,
        },
      ]
      : authState === "Teacher"
        ? [
          {
            label: "Classes",
            route: "/teacher/classes",
            iconPath: <SiGoogleclassroom className="w-5 lg:w-6 h-5 lg:h-6" />,
          },
          {
            label: "Book",
            route: "/teacher/book",
            iconPath: <LuBookOpenText className="w-5 lg:w-6 h-5 lg:h-6" />,
          },
        ]
        : [
          {
            label: "Book Management",
            route: "",
            iconPath: (
              <PiBookOpenTextDuotone className="w-5 lg:w-6 h-5 lg:h-6" />
            ),
          },
          {
            label: "Schools",
            route: "/admin/schools",
            iconPath: <LuSchool className="w-5 lg:w-6 h-5 lg:h-6" />,
          },
          {
            label: "Teachers",
            route: "/admin/teachers",
            iconPath: (
              <LiaChalkboardTeacherSolid className="w-5 lg:w-6 h-5 lg:h-6" />
            ),
          },
          {
            label: "Students",
            route: "/admin/students",
            iconPath: <PiStudentDuotone className="w-5 lg:w-6 h-5 lg:h-6" />,
          },
          {
            label: "Announcements",
            route: "/admin/announcements",
            iconPath: <TfiAnnouncement className="w-5 lg:w-6 h-5 lg:h-6" />,
          },
        ]),
    {
      label: "Settings",
      route: "/settings",
      iconPath: <IoSettingsOutline className="w-5 lg:w-6 h-5 lg:h-6" />,
    },
  ];

  const handleLogOut = () => {
    dispatch(logout());
    Cookies.remove("token");
    router.push("/select-role");
  };

  return (
    <div className="h-screen bg-white">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="m-4 p-2 text-black rounded-md bg-white shadow-md lg:hidden"
      >
        {isOpen ? <IoClose size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar Content */}
      <aside className={`duration-300 flex flex-col justify-between h-[calc(100%-80px)] font-inter ${isOpen ? "w-[250px] xl:w-[286px]" : "w-[80px]"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          {isOpen && (
            <Link
              href="/"
              className="hidden lg:flex justify-center items-center gap-3 m-6 pb-6 border-b border-[#E2E8F0]"
            >
              <Image
                width={250}
                height={100}
                className="w-10 h-10"
                src={logo}
                alt="logo_image"
                priority
              />
              <p className="text-xl font-bold text-[#1E3A8A]">Dar El Chimal</p>
            </Link>
          )}

          {/* Navigation */}
          <div className={`flex flex-col ${isOpen ? "pt-0" : ""}`}>
            <ul className="m-4 lg:m-6">
              {navigation.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    onClick={() => {
                      if (item.label === "Book Management" || item.label === "Classes")
                        setShowDropdown(!showDropdown);
                    }}
                    className={`flex items-center gap-2 mb-2 rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors duration-300 ease-in-out ${!isOpen ? "justify-center py-2" : "justify-start px-4 py-2"}
                    ${path === item.route ?
                        "bg-[#1E3A8A] text-white" :
                        (
                          path === "/admin/books" ||
                          path === "/admin/book-categories" ||
                          path === "/admin/book-categories/new-book-category" ||
                          path === "/admin/books/add-new-book" ||
                          path === `/admin/books/book-overview/${id}` ||
                          path === `/admin/books/book-overview/${id}/${resourceId}`
                        ) && item.label === "Book Management" ?
                          "bg-[#1E3A8A] text-white" :
                          "text-[#7C8091]"
                      }`}
                  >
                    <div className="flex justify-center items-center">{item.iconPath}</div>
                    {isOpen && (<p className="text-sm xl:text-base">{item.label}</p>)}
                    {item.label === "Book Management" ?
                      (showDropdown ? (
                        <TfiAngleUp className="w-2 lg:w-5 h-2 lg:h-5" />
                      ) : (
                        <TfiAngleDown className="w-2 lg:w-5 h-2 lg:h-5" />
                      )) :
                      item.label === "Classes" ?
                        (showDropdown ? (
                          <TfiAngleUp className="w-2 lg:w-5 h-2 lg:h-5" />
                        ) : (
                          <TfiAngleDown className="w-2 lg:w-5 h-2 lg:h-5" />
                        )) :
                        <></>
                    }
                  </Link>
                  {(showDropdown && item.label === "Book Management") ? (
                    <div className="flex flex-col">
                      <Link
                        href="/admin/book-categories"
                        className={`text-[#1E3A8A] font-medium p-3 ${isOpen && "pl-8 ml-8"} 
                        ${(
                            path === "/admin/book-categories" ||
                            path === "/admin/book-categories/new-book-category")
                            ? "border-l-2 border-[#1E3A8A]"
                            : "border-l border-[#F3EEF6]"
                          }`}
                      >
                        {!isOpen ? <TbCategoryPlus /> : "Book Categories"}
                      </Link>
                      <Link
                        href="/admin/books"
                        className={`text-[#1E3A8A] font-medium p-3 ${isOpen && "pl-8 ml-8"} 
                        ${(
                            path === "/admin/books" ||
                            path === "/admin/books/add-new-book" ||
                            path === `/admin/books/book-overview/${id}` ||
                            path === `/admin/books/book-overview/${id}/${resourceId}`)
                            ? "border-l-2 border-[#1E3A8A]"
                            : "border-l border-[#F3EEF6]"
                          }`}
                      >
                        {!isOpen ? <PiBookBookmark /> : "Books"}
                      </Link>
                    </div>
                  ) :
                    (showDropdown && item.label === "Classes") ?
                      (<div className="flex flex-col">
                        <Link
                          href="/teacher/student"
                          className={`text-[#1E3A8A] font-medium p-3 ${isOpen && "pl-8 ml-8"} 
                          ${(
                              path === "/teacher/student" ||
                              path === "/admin/book-categories/new-book-category")
                              ? "border-l-2 border-[#1E3A8A]"
                              : "border-l border-[#F3EEF6]"
                            }`}
                        >
                          {!isOpen ? <TbCategoryPlus /> : "Student"}
                        </Link>
                        <Link
                          href=""
                          className={`text-[#1E3A8A] font-medium p-3 ${isOpen && "pl-8 ml-8"} 
                          ${(
                              path === "" ||
                              path === "/admin/books/add-new-book" ||
                              path === `/admin/books/book-overview/${id}` ||
                              path === `/admin/books/book-overview/${id}/${resourceId}`)
                              ? "border-l-2 border-[#1E3A8A]"
                              : "border-l border-[#F3EEF6]"
                            }`}
                        >
                          {!isOpen ? <PiBookBookmark /> : "Assignment"}
                        </Link>
                        <Link
                          href="/teacher/announcements"
                          className={`text-[#1E3A8A] font-medium p-3 ${isOpen && "pl-8 ml-8"} 
                          ${(
                              path === "/teacher/announcements" ||
                              path === "/admin/books/add-new-book" ||
                              path === `/admin/books/book-overview/${id}` ||
                              path === `/admin/books/book-overview/${id}/${resourceId}`)
                              ? "border-l-2 border-[#1E3A8A]"
                              : "border-l border-[#F3EEF6]"
                            }`}
                        >
                          {!isOpen ? <PiBookBookmark /> : "Announcements"}
                        </Link>
                      </div>) :
                      <></>
                  }
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer to push logout to bottom */}
          <div className="flex-grow"></div>

          {/* Logout Button */}
          <div className="mt-auto p-6">
            <button
              onClick={handleLogOut}
              className="flex items-center justify-start gap-2 text-red-400 transition-colors rounded-md bg-[#EF444433] w-full py-2 px-4"
            >
              <RiLogoutCircleRLine size={18} />
              {isOpen && <span className="text-lg">Log out</span>}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NavbarSlider;

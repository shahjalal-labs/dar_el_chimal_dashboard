"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { RiExchangeDollarLine, RiLogoutCircleRLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import Cookies from "js-cookie";
import logo from "@/assets/logo.svg";
import { RxDashboard } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { CiShop, CiUser } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useAuth } from '@/redux/features/authSlice';
import { MdBorderColor, MdEventAvailable, MdOutlineBookmarkAdded, MdProductionQuantityLimits, MdSportsHandball } from "react-icons/md";
import { GiSoccerField } from "react-icons/gi";
import { BiStore } from "react-icons/bi";
import { BsBank } from "react-icons/bs";
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavbarSlider = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector(useAuth);

  const navigation = [
    { label: "Dashboard", route: "/", iconPath: <RxDashboard className="w-6 h-6" /> },

    ...(authState.businessCategory === "PLAYGROUND"
      ? [
        {
          label: "Playground Booking",
          route: "/vendor/playground/playground-booking",
          iconPath: <MdOutlineBookmarkAdded className="w-6 h-6" />,
        },
        {
          label: "Ground Availability",
          route: "/vendor/playground/ground-availability",
          iconPath: <GiSoccerField className="w-6 h-6" />,
        },
        { label: "Bank Info", route: "/bank-info", iconPath: <BsBank className="w-6 h-6" /> },
      ] :
      authState.businessCategory === "EVENT"
        ? [
          {
            label: "Manage Event",
            route: "/vendor/event/manage-event",
            iconPath: <MdEventAvailable className="w-6 h-6" />,
          },
          {
            label: "Manage Booking",
            route: "/vendor/event/manage-booking",
            iconPath: <MdOutlineBookmarkAdded className="w-6 h-6" />,
          },
          { label: "Bank Info", route: "/bank-info", iconPath: <BsBank className="w-6 h-6" /> },
        ] :
        authState.businessCategory === "E_COMMERCE"
          ? [
            {
              label: "Order Management",
              route: "/vendor/ecommerce/order-management",
              iconPath: <MdOutlineBookmarkAdded className="w-6 h-6" />,
            },
            {
              label: "Manage On-store",
              route: "/vendor/ecommerce/manage-on-store",
              iconPath: <BiStore className="w-6 h-6" />,
            },
            {
              label: "Manage Product",
              route: "/vendor/ecommerce/manage-product",
              iconPath: <MdProductionQuantityLimits className="w-6 h-6" />,
            },
            { label: "Bank Info", route: "/bank-info", iconPath: <BsBank className="w-6 h-6" /> },
          ] :
          [
            {
              label: "Manage Customers",
              route: "/admin/manage-customers",
              iconPath: <CiUser className="w-6 h-6" />,
            },
            {
              label: "Manage Vendors",
              route: "/admin/manage-vendor",
              iconPath: <CiShop className="w-6 h-6" />,
            },
            {
              label: "Sports Category",
              route: "/admin/sports-category",
              iconPath: <MdSportsHandball className="w-6 h-6" />,
            },
            {
              label: "Manage Orders",
              route: "/admin/manage-order",
              iconPath: <MdBorderColor className="w-6 h-6" />,
            },
            {
              label: "Manage Transactions",
              route: "/admin/manage-transactions",
              iconPath: <RiExchangeDollarLine className="w-6 h-6" />,
            },
          ]
    ),
    { label: "Settings", route: "/settings", iconPath: <IoSettingsOutline className="w-6 h-6" /> },
  ];


  const handleLogOut = () => {
    dispatch(logout());
    Cookies.remove("token");
    router.push("/login");
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
      <aside
        className={`duration-300 flex flex-col justify-between h-[calc(100%-80px)] font-inter ${isOpen ? "w-[250px] xl:w-[286px]" : "w-[80px]"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          {isOpen && (
            <Link href="/" className="hidden lg:flex justify-start m-6 pb-6 border-b border-[#E2E8F0]">
              <Image
                width={250}
                height={100}
                className="w-28"
                src={logo}
                alt="logo_image"
                priority
              />
            </Link>
          )}

          {/* Navigation */}
          <div className={`flex flex-col ${isOpen ? "pt-0" : ""}`}>
            <ul className="m-4 lg:m-6">
              {navigation.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    className={`flex items-center gap-2 mb-2 rounded-lg hover:bg-[#FF6B00] hover:text-white transition-colors duration-300 ease-in-out 
                      ${!isOpen ? 'justify-center py-2' : 'justify-start px-4 py-2'
                      }
                    ${path === item.route
                        ? "bg-[#FF6B00] text-white"
                        : "text-[#7C8091]"
                      }`}
                  >
                    <div className="flex justify-center items-center">{item.iconPath}</div>
                    {isOpen && <p className="text-sm xl:text-base">{item.label}</p>}
                  </Link>
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
              className="flex items-center justify-start gap-2 text-[#7C8091] hover:text-red-400 transition-colors rounded-md hover:bg-[#EF444433] w-full py-2 px-4"
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

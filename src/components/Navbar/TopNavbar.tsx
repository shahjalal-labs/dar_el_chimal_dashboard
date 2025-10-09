/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Badge, Modal, message as AntMessage } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import user from "@/assets/User.png";
import Image from "next/image";
import { useGetMyProfileQuery } from "@/redux/api/settingsApi";
import { useGetMyNotificationsQuery } from "@/redux/api/notificationApi";
import Link from "next/link";

const TopNavbar = () => {

  const { data: profileData } = useGetMyProfileQuery(undefined);
  const { data: notificationsData } = useGetMyNotificationsQuery(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const unreadCount = notificationsData?.result?.notifications?.filter((n: any) => !n.isRead).length;

  return (
    <>
      <div className="bg-white flex justify-between items-center gap-2 h-[80px] lg:h-[90px] fixed z-20 top-0 left-[80px] lg:left-[250px] xl:left-[286px] right-0 w-[calc(100%-80px)] lg:w-[calc(100%-250px)] xl:w-[calc(100%-286px)] md:px-6">
        <div className="scale-75 md:scale-100">
          <h1 className="text-xl md:text-2xl text-black font-bold">Overview</h1>
        </div>

        <div className="flex justify-end items-center gap-2 lg:gap-4 scale-75 md:scale-100">
          {/* Notification Icon */}
          <Link
            href='/notifications'
            className="bg-[#F5F3F6] rounded-full px-2 py-1 h-full cursor-pointer"
            // onClick={() => setIsModalOpen(true)}
          >
            <Badge count={unreadCount} size="small">
              <IoMdNotificationsOutline className="w-6 h-6 text-black" />
            </Badge>
          </Link>

          {/* Profile */}
          <Link href='/settings' className="flex justify-center items-center gap-3 text-[#636F85] font-medium rounded-3xl h-full cursor-pointer">
            <Image
              src={profileData?.result?.profileImage || user}
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-10 h-10"
              priority
            />
            <div>
              <p className="text-black font-medium">{profileData?.result?.fullName || "Priscilla Lily"}</p>
              <p className="text-[#79767B] text-sm">{profileData?.result?.loginUserName || "Admin"}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Notifications Modal */}
      <Modal
        title="Notifications"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {notificationsData?.result?.notifications?.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications found.</p>
        ) : (
          <ul className="space-y-4 max-h-[400px] overflow-y-auto">
            {notificationsData?.result?.notifications?.map((notif: any) => (
              <li
                key={notif.id}
                className={`border rounded-lg p-3 shadow-sm ${notif.isRead ? "bg-white" : "bg-[#F0F9FF]"
                  }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.body.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {
                        new Date(notif.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }
                    </p>
                  </div>

                  {/* <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${notif.isRead
                        ? "bg-gray-200 text-gray-600"
                        : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {notif.isRead ? "Read" : "Unread"}
                    </span>

                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-xs text-blue-500 hover:underline cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
};

export default TopNavbar;

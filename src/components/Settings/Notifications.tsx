/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetMyNotificationsQuery } from "@/redux/api/notificationApi";
import { formatDistanceToNow } from "date-fns";
import { TbClipboardText } from "react-icons/tb";

const Notifications = () => {
  const { data, isLoading } = useGetMyNotificationsQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="">
      {/* Notifications Card */}
      <div className="bg-white rounded-xl p-6">
        {/* Title */}
        <h1 className="text-[#1E1E1E] text-2xl font-semibold mb-6">
          Notifications
        </h1>

        {/* Notification List */}
        <div className="space-y-4">
          {data?.result?.length > 0 ? (
            data?.result?.map((notification: any) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0"
              >
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  <div className="bg-[#EEF2FF] p-2 rounded-md">
                    <TbClipboardText className="text-[#1E3A8A] text-xl" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h2 className="text-[#262626] font-medium text-sm sm:text-base">
                    {notification.content}
                  </h2>
                  <p className="text-[#6B7280] text-xs sm:text-sm mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No notifications found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { messaging } from "@/lib/firebase";
import { useLoginMutation, useStudentLoginMutation } from "@/redux/api/authApi";
import { setUserToken } from "@/redux/features/authSlice";
import { AppDispatch } from "@/redux/store/store";
import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Modal, Spin } from "antd";
import { getToken, Messaging } from "firebase/messaging";
import Cookies from "js-cookie";
import { Bell, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { LuLockKeyhole } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import LeftSide from "./LeftSide";

const customIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#fff" }} spin />
);

const isNotificationSupported = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
};

const requestPermission = async () => {
  if (!isNotificationSupported()) {
    throw new Error("Notifications are not supported on this device/browser");
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      if (!messaging) {
        throw new Error("Messaging service is unavailable");
      }

      const token = await getToken(messaging as Messaging, {
        vapidKey:
          "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
      });
      return token;
    } catch (err) {
      console.error("Error getting FCM token:", err);
      throw err;
    }
  } else {
    throw new Error("Notification permission denied");
  }
};

interface JWTPayload {
  role?: string;
  [key: string]: any;
}

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<
    "pending" | "granted" | "denied" | "skipped"
  >("pending");

  const route = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: any) => state.auth.role);

  const [login, { isLoading, error }] = useLoginMutation();
  const [studentLoginFn] = useStudentLoginMutation();

  useEffect(() => {
    if (!isNotificationSupported()) {
      setNotificationEnabled(false);
      setNotificationStatus("skipped");
      setNotificationModalVisible(false);
      return;
    }

    if (Notification.permission === "default") {
      setNotificationModalVisible(true);
      setNotificationStatus("pending");
    } else if (Notification.permission === "granted") {
      setNotificationEnabled(true);
      setNotificationStatus("granted");
      getFcmToken();
    } else {
      setNotificationStatus("denied");
    }
  }, []);

  const getFcmToken = async () => {
    try {
      if (!isNotificationSupported() || !messaging) {
        setFcmToken(null);
        return null;
      }

      const token = await getToken(messaging as Messaging, {
        vapidKey:
          "BM5LMmA2cx23HK13GdLZqkQEGz0wl7-NszqL6q08D1RnfCuKnkhExvQvPs64VVkVjUgME36mLbpXWpEFFpFEgnM",
      });
      setFcmToken(token);
      return token;
    } catch (err) {
      console.error("Error getting FCM token:", err);
      setFcmToken(null);
      return null;
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const token = await requestPermission();
      if (token) {
        setNotificationEnabled(true);
        setFcmToken(token);
        setNotificationStatus("granted");
        toast.success("Notifications enabled successfully!");
      }
    } catch (err) {
      console.error("Failed to enable notifications:", err);
      setFcmToken(null);
      setNotificationStatus("denied");
      toast.error(
        "Failed to enable notifications. Please check your browser settings.",
      );
    } finally {
      setNotificationModalVisible(false);
    }
  };

  const handleSkipNotifications = () => {
    setNotificationModalVisible(false);
    setFcmToken(null);
    setNotificationStatus("skipped");
    toast.info("You will not get notify for any notification");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      userName: userName,
      password: password,
    };

    try {
      if (role === "Student") {
        const studentBody = {
          userName: userName,
          password: password,
          fcmToken: fcmToken || "",
        };

        const response = await studentLoginFn(studentBody).unwrap();
        const token = response?.result?.accessToken;
        

        if (response.success) {
          toast.success(response.message);
          Cookies.set("token", token);
          dispatch(setUserToken(token));
          route.push("/student/overview");
        } else {
          toast.error(response?.data?.message || "Login failed!");
        }
        return;
      }
      if (role === "Teacher") {
        const studentBody = {
          userName: userName,
          password: password,
          fcmToken: fcmToken || "",
        };

        const response = await studentLoginFn(studentBody).unwrap();
        
        const token = response?.result?.accessToken;

        if (response.success) {
          toast.success(response.message);
          Cookies.set("token", token);
          dispatch(setUserToken(token));
          route.push("/");
        } else {
          toast.error(response?.data?.message || "Login failed!");
        }
        return;
      }

      const response = await login(body).unwrap();
      const token = response?.result?.accessToken;
      let decodedPayload: JWTPayload = {};

      if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        decodedPayload = JSON.parse(atob(base64));
      }

      if (response.success) {
        if (role !== decodedPayload.role) {
          toast.error("Please select the correct role!");
        } else {
          toast.success(response.message);
          Cookies.set("token", token);
          dispatch(setUserToken(token));
          route.push("/");
        }
      } else {
        toast.error(response?.data?.message || "Login failed!");
      }
    } catch (error) {
      toast.error(
        (error as any)?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Notification Permission Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#54BB52]" />
            <span>Enable Notifications</span>
          </div>
        }
        open={notificationModalVisible}
        onCancel={handleSkipNotifications}
        footer={[
          <Button
            key="skip"
            variant="outline"
            onClick={handleSkipNotifications}
          >
            Skip for Now
          </Button>,
          <Button
            key="enable"
            onClick={handleEnableNotifications}
            className="bg-[#54BB52] hover:bg-[#54BB52] ml-3"
          >
            Enable Notifications
          </Button>,
        ]}
        className="rounded-lg"
      >
        <div className="py-4">
          <p className="text-gray-700 mb-2">
            Stay updated with important alerts and messages by enabling
            notifications.
          </p>
          <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-md">
            <Bell className="h-5 w-5 text-[#54BB52] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#54BB52]">
                What to expect:
              </p>
              <ul className="text-xs text-[#54BB52] mt-1 list-disc pl-4">
                <li>Important account notifications</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            You can not get notify for any notification.
          </p>
        </div>
      </Modal>

      <LeftSide />

      <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#F9F9F9]">
        <div className="w-full max-w-sm">
          <div className="flex-grow"></div>

          <div className="lg:space-y-10 space-y-6 lg:px-0 px-4">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-black">
                Welcome back, {role}!
              </h2>
              <p className="mt-2 text-lg text-[#636F85]">
                {"Please sign in using your provided credentials."}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* User Name Field */}
              <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3">
                <Label htmlFor="userName" className="sr-only">
                  Email
                </Label>
                <FaRegUser className="text-[#718096] w-6 h-6" />
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="User name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3 relative">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <LuLockKeyhole className="text-[#718096] w-6 h-6" />
                <div className="">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="outline-none"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="mb-4">
                  <Alert
                    message={
                      (error as any)?.data?.message ||
                      (typeof error === "object" && "message" in error
                        ? (error as any).message
                        : "An error occurred")
                    }
                    type="error"
                    showIcon
                  />
                </div>
              )}

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`${
                      rememberMe ? "accent-[#1E3A8A]" : "accent-white"
                    } h-5 w-5`}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-black cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="text-[#1E3A8A] hover:underline font-medium"
                  >
                    Forgot Password
                  </button>
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white font-bold rounded-lg transition-colors mt-4"
              >
                {isLoading ? (
                  <>
                    Logging... <Spin indicator={customIcon} />
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

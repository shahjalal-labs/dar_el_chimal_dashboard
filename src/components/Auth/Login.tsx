/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/api/authApi";
import { Alert, Spin } from "antd";
import { toast } from "sonner";
import { LoadingOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { setUser, setUserToken } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LeftSide from "./LeftSide";
import { LuLockKeyhole } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";

const customIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#fff" }} spin />
);

interface JWTPayload {
  role?: string;
  [key: string]: any;
}

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const route = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: any) => state.auth.role);

  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      userName: userName,
      password: password,
    };

    try {
      const response = await login(body).unwrap();
      const token = response?.result?.accessToken;
      let decodedPayload: JWTPayload = {};

      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        decodedPayload = JSON.parse(atob(base64));
      }

      if (response.success) {
        if (role !== decodedPayload.role) {
          toast.error("Please select the correct role!")
        }
        else {
          toast.success(response.message);
          Cookies.set("token", response?.result?.accessToken);
          dispatch(setUserToken(response?.result?.accessToken));
          route.push("/");
        }
      }
      else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      console.log("Execution completed.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <LeftSide />

      <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#F9F9F9]">
        <div className="w-full max-w-sm">

          <div className="flex-grow"></div>

          <div className="lg:space-y-10 space-y-6 lg:px-0 px-4">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-black">Welcome back, {role}!</h2>
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
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
                    className={`${rememberMe ? "accent-[#1E3A8A]" : "accent-white"} h-5 w-5`}
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

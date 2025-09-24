/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { useLoginMutation } from "@/redux/api/authApi";
import { Alert, Spin } from "antd";
import { toast } from "sonner";
import { LoadingOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { setUser, setUserToken } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import LeftSide from "./LeftSide";

const customIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#fff" }} spin />
);

interface JWTPayload {
  role?: string;
  businessCategory?: string;
  [key: string]: any;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const route = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      email: email,
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
        toast.success(response.message);

        Cookies.set("token", response?.result?.accessToken);
        dispatch(setUser(decodedPayload));
        dispatch(setUserToken(response?.result?.accessToken));

        if (response?.result?.isBankInfo) {
          route.push("/");
        } else {
          route.push("/bank-info");
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
      {/* Left Side - Ocean Background */}
      <LeftSide />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#F9F9F9]">
        <div className="w-full max-w-sm">
          {/* Logo and Brand */}
          <div className="flex items-center justify-start mb-4 px-6 pt-6 xl:px-0">
            <Image
              src={logo}
              height={200}
              width={200}
              alt="Logo"
              className="w-44 h-44"
              priority
            />
          </div>

          <div className="flex-grow"></div>

          {/* Login Form */}
          <div className="lg:space-y-10 space-y-6 lg:px-0 px-4">
            <div className="text-start">
              <h2 className="text-2xl font-semibold text-[#3F3D56]">Hey! Welcome back</h2>
              <p className="mt-1 text-[#7C8091]">
                {"Sign In to your account"}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <MdOutlineMail className="text-[#718096] w-6 h-6" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3 relative">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <CiLock className="text-[#718096] w-6 h-6" />
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
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-[#3F3D56] cursor-pointer text-xs"
                  >
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="text-[#FF6B00] hover:underline font-medium text-sm"
                  >
                    Forgot Password
                  </button>
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#FF6B00] hover:bg-[#FF6B0080] text-white font-bold rounded-lg transition-colors mt-4"
              >
                {isLoading ? (
                  <>
                    Logging <Spin indicator={customIcon} />
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center mt-4">
                <span className="text-[#7C8091]">
                  {"Don't have an account? "}
                </span>
                <Link href='/register'>
                  <button
                    type="button"
                    className="text-[#FF6B00] hover:underline font-bold"
                  >
                    Register Here
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

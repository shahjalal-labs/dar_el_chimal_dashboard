/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useChangePasswordMutation } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Eye, EyeIcon, EyeOff, EyeOffIcon, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiSpinner } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const AccountSection = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [ChangePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (data?.oldPassword === data?.newPassword) {
      toast.error("New password must not be similar to the previous!");
    } else {
      try {
        const body = {
          oldPassword: data?.oldPassword,
          newPassword: data?.newPassword,
        };

        const response = await ChangePassword(body);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          dispatch(logout());
          Cookies.remove("token");
          router.push("/login");
        } else if (response?.error) {
          if ("data" in response.error && response.error.data) {
            toast.error(
              (response.error.data as { message?: string })?.message ||
              "An unknown error occurred."
            );
          } else if ("message" in response.error) {
            toast.error(response.error.message);
          } else {
            toast.error("An unknown error occurred.");
          }
        }
      } catch (err) {
        toast.warning((err as any)?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-[#F6F6F6] pb-6 mb-6">
        <h1 className="text-lg font-medium text-[#30373D]">Password</h1>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Update your account password</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Card className="p-0">
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Old Password */}
            <div>
              <Label
                htmlFor="old-password"
                className="text-sm font-medium text-[#30373D]"
              >
                Old Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Input your old password"
                  {...register("oldPassword")}
                  className="px-5 py-4"
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-sm font-medium text-[#30373D]"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Input your new password"
                  {...register("newPassword")}
                  className={`${errors?.newPassword ? "border-red-500" : ""
                    } px-5 py-4`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors?.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="text-[#8C91A2] text-xs">
                Min 8 Characters with a combination of letters and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-[#30373D]"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword")}
                  className={`${errors?.confirmPassword ? "border-red-500" : ""
                    } px-5 py-4`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors?.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8ACC]"
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-2">
                  Changing...
                  <div className="animate-spin">
                    <PiSpinner className="h-4 w-4" />
                  </div>
                </div>
              ) : (
                <span>Change Password</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSection;

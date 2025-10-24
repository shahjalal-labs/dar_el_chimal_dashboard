"use client";

import React, { useState } from 'react';
import { useResetPasswordMutation } from '@/redux/api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PiSpinner } from 'react-icons/pi';
import LeftSide from './LeftSide';
import { Button } from '../ui/button';

const resetPasswordSchema = z
    .object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [resetPass, { isLoading }] = useResetPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onSubmit",
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            const body = {
                newPassword: data?.newPassword,
            };
            const response = await resetPass(body).unwrap();
            if (response?.success) {
                toast.success(response?.message);
                localStorage.removeItem("email");
                localStorage.removeItem("otp");
                router.push("/login");
            }
            else {
                if (typeof response?.error === 'object' && response?.error !== null) {
                    if ('data' in response?.error && response.error.data) {
                        toast.error((response.error.data as { message?: string })?.message || "An unknown error occurred.");
                    } else if ('message' in response?.error) {
                        toast.error(response.error.message);
                    } else {
                        toast.error("An unknown error occurred.");
                    }
                }
            }
        }
        catch (err) {
            console.log("Error:", err);
        }
    };

    return (
        <div className="flex min-h-screen">
            <LeftSide />

            <div className="w-full lg:w-1/2 bg-[#F9F9F9] flex justify-center items-center">
                <div className="w-full px-5 md:px-0 md:max-w-sm m-auto">
                    <div className="space-y-2 mt-6 mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-outfit font-semibold">
                            Reset Password!
                        </h1>
                        <p className="text-sm md:text-base font-normal font-inter text-slate-700">
                            Enter a different password than the previous one
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="new-password"
                                className="text-sm md:text-[18px] font-outfit text-gray-600"
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    placeholder="********"
                                    type={showPassword ? "text" : "password"}
                                    {...register("newPassword")}
                                    required
                                    className={`w-full bg-white rounded-lg px-4 py-2 ${errors.newPassword ? "border-red-500" : "border-[#98A2B3]"
                                        } pr-10`}
                                />
                                <Button
                                    type="button"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
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
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="confirm-password"
                                className="text-sm md:text-[18px] font-outfit text-[#475467]"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    placeholder="********"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    required
                                    className={`w-full bg-white rounded-lg px-4 py-2 ${errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-[#98A2B3]"
                                        } pr-10`}
                                />
                                <Button
                                    type="button"
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
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white font-bold rounded-lg mt-2 flex justify-center items-center font-outfit text-[18px] py-[10px] cursor-pointer transition-colors duration-300 ease-in-out"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center gap-2">
                                    Saving...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div>
                            ) : (
                                <span>Save & Sign In</span>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
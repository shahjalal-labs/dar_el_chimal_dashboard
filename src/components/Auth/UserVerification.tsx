"use client";

import React from "react";
import Image from "next/image";
import preview from "@/assets/Previews.svg";
import logo from "@/assets/logo.svg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/Input-Otp";
import { PiSpinner } from "react-icons/pi";
import { useOtpUserMutation } from "@/redux/api/authApi";
import { setUserToken } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";

const otpSchema = z.object({
    otp: z
        .string()
        ?.length(4, "OTP must be exactly 4 digits")
        .regex(/^[0-9]+$/, "OTP must contain only numbers"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function UserVerification() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [otpUser, { isLoading }] = useOtpUserMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
    });

    const onSubmit = async (data: OTPFormData) => {
        try {
            const body = {
                otpCode: data?.otp
            }
            const response = await otpUser(body).unwrap();
            if (response.success) {
                dispatch(setUserToken(response?.result?.accessToken));
                toast.success(response?.message);
                router.push("/upload-files");
                reset();
            }
        } catch (err) {
            if (typeof err === 'object' && err !== null) {
                if ('data' in err && err.data) {
                    const message = (err.data as { message?: string })?.message || "An unknown error occurred.";
                    toast.error(message);
                } else if ('message' in err) {
                    toast.error((err as { message?: string }).message || "An unknown error occurred.");
                } else {
                    toast.error("An unknown error occurred.");
                }
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Ocean Background */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <Image
                    src={preview}
                    alt="Fishing boat in blue ocean waters"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

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
                            <h2 className="text-2xl font-semibold text-[#3F3D56]">Verification code</h2>
                            <p className="mt-1 text-[#7C8091]">
                                {"We have sent a verification code to your"}
                            </p>
                        </div>

                        <div className="w-full space-y-8 bg-[#F8F8F8] rounded-2xl">
                            {/* OTP Input Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="flex justify-center">
                                    <Controller
                                        name="otp"
                                        control={control}
                                        render={({ field }) => (
                                            <InputOTP {...field} maxLength={6}>
                                                <InputOTPGroup className="flex gap-6">
                                                    {[...Array(4)].map((_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="md:h-[56px] md:w-[55.67px] h-[36px] w-[35.67px] rounded-[8px] border border-[#98A2B3]"
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        )}
                                    />
                                </div>

                                {/* OTP Error Message */}
                                {errors.otp && (
                                    <p className="text-center text-sm text-red-500">
                                        {errors?.otp?.message}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white font-bold rounded-lg mt-2 flex justify-center items-center font-outfit text-[18px] py-[10px] cursor-pointer transition-colors duration-300 ease-in-out"
                                >
                                    {isLoading ? (
                                        <div className="flex justify-center items-center gap-2">
                                            Verifing...
                                            <div className="animate-spin">
                                                <PiSpinner className="h-4 w-4" />
                                            </div>
                                        </div>
                                    ) : (
                                        <span>Verify</span>
                                    )}
                                </button>

                                <div className="text-center">
                                    <p className="text-xl text-slate-600">Don&apos;t receive the code?</p>
                                    <Link href={"/register"} className="text-[#1E3A8A] hover:underline">
                                        Resent
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import Image from "next/image";
// import preview from "@/assets/Previews.svg";
// import logo from "@/assets/logo.svg";
// import { useCreateUserMutation } from "@/redux/api/authApi";
// import { Alert, Spin } from "antd";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { LoadingOutlined } from "@ant-design/icons";
// import { Eye, EyeOff } from "lucide-react";
// import { FaRegUser } from "react-icons/fa";
// import {
//     MdLockOutline,
//     MdOutlineMail,
// } from "react-icons/md";
// import Link from "next/link";
// import { TbCategory } from "react-icons/tb";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
// } from "../ui/select";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store/store";
// import { setUserToken } from "@/redux/features/authSlice";
// import { AsYouType } from "libphonenumber-js";

// const customIcon = (
//     <LoadingOutlined style={{ fontSize: 24, color: "#fff" }} spin />
// );

// type CountryType = {
//     code: string;
//     name: string;
//     flag: string;
//     dialCode: string;
// };

// const countryOptions: CountryType[] = [
//     { code: "BH", name: "Bahrain", flag: "https://flagcdn.com/w40/bh.png", dialCode: "+973" },
//     { code: "QA", name: "Qatar", flag: "https://flagcdn.com/w40/qa.png", dialCode: "+974" },
//     { code: "SA", name: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png", dialCode: "+966" },
//     { code: "KW", name: "Kuwait", flag: "https://flagcdn.com/w40/kw.png", dialCode: "+965" },
//     { code: "AE", name: "United Arab Emirates", flag: "https://flagcdn.com/w40/ae.png", dialCode: "+971" },
//     { code: "OM", name: "Oman", flag: "https://flagcdn.com/w40/om.png", dialCode: "+968" },
//     { code: "TR", name: "Turkey", flag: "https://flagcdn.com/w40/tr.png", dialCode: "+90" },
//     { code: "TN", name: "Tunisia", flag: "https://flagcdn.com/w40/tn.png", dialCode: "+216" },
//     { code: "MA", name: "Morocco", flag: "https://flagcdn.com/w40/ma.png", dialCode: "+212" },
//     { code: "BD", name: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png", dialCode: "+880" },
//     { code: "GB", name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png", dialCode: "+44" },
//     { code: "US", name: "United States", flag: "https://flagcdn.com/w40/us.png", dialCode: "+1" },
// ];

// export default function Register() {
//     const [formData, setFormData] = useState({
//         fullName: "",
//         phone: countryOptions[0].dialCode,
//         category: "",
//     });
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [countryCode, setCountryCode] = useState(countryOptions[0].code);
//     const [selected, setSelected] = useState<CountryType>(countryOptions[0]);

//     const route = useRouter();
//     const dispatch = useDispatch<AppDispatch>();
//     const [Register, { isLoading, error }] = useCreateUserMutation();

//     const handleInputChange = (key: string, value: string) => {
//         setFormData((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     const handleRegister = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const body = {
//             username: formData.fullName,
//             email: email,
//             phoneNumber: formData.phone,
//             password: password,
//             businessCategory: formData.category,
//             countryCode: countryCode,
//         };

//         try {
//             const response = await Register(body).unwrap();
//             if (response?.success) {
//                 dispatch(setUserToken(response?.result?.verifyToken));
//                 toast.success(
//                     response?.message +
//                     "!" +
//                     " Your OTP " +
//                     "(" +
//                     response?.result?.otpCode +
//                     ")"
//                 );
//                 route.push("/verify-user");
//             } else {
//                 toast.error(response?.data?.message);
//             }
//         } catch (error) {
//             console.error("An error occurred:", error);
//         } finally {
//             console.log("Execution completed.");
//         }
//     };

//     return (
//         <div className="min-h-screen flex">
//             {/* Left Side - Ocean Background */}
//             <div className="hidden lg:flex lg:w-1/2 relative">
//                 <Image
//                     src={preview}
//                     alt="Fishing boat in blue ocean waters"
//                     fill
//                     className="object-cover"
//                     priority
//                 />
//             </div>

//             {/* Right Side - Form */}
//             <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#F9F9F9]">
//                 <div className="w-full max-w-sm">
//                     {/* Logo */}
//                     <div className="flex items-center justify-start mb-4 px-6 pt-6 xl:px-0">
//                         <Image
//                             src={logo}
//                             height={200}
//                             width={200}
//                             alt="Logo"
//                             className="w-44 h-44"
//                             priority
//                         />
//                     </div>

//                     <div className="lg:space-y-10 space-y-6 lg:px-0 px-4">
//                         <div className="text-start">
//                             <h2 className="text-2xl font-semibold text-[#3F3D56]">
//                                 Create Your Account
//                             </h2>
//                             <p className="mt-1 text-[#7C8091]">
//                                 Create account and enjoy all services
//                             </p>
//                         </div>

//                         <form onSubmit={handleRegister} className="space-y-4">
//                             {/* Full Name */}
//                             <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3">
//                                 <Label htmlFor="fullName" className="sr-only">
//                                     Full name
//                                 </Label>
//                                 <FaRegUser className="text-[#718096] w-6 h-6" />
//                                 <input
//                                     id="fullName"
//                                     name="fullName"
//                                     type="text"
//                                     placeholder="Full name"
//                                     value={formData.fullName}
//                                     onChange={(e) =>
//                                         handleInputChange("fullName", e.target.value)
//                                     }
//                                     className="outline-none"
//                                     required
//                                 />
//                             </div>

//                             {/* Phone */}
//                             <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3 relative">
//                                 <Label htmlFor="phone" className="sr-only">
//                                     Phone
//                                 </Label>
//                                 {/* <MdOutlinePhonelinkLock className="text-[#718096] w-6 h-6" /> */}
//                                 <Image
//                                     src={selected.flag}
//                                     height={50}
//                                     width={50}
//                                     alt={selected.name}
//                                     className="w-5 h-4 object-cover"
//                                     priority
//                                 />
//                                 <input
//                                     id="phone"
//                                     name="phone"
//                                     type="tel"
//                                     placeholder="Phone"
//                                     value={formData.phone}
//                                     onChange={(e) => {
//                                         const formatted = new AsYouType(
//                                             selected.code as any // or as CountryCode if imported
//                                         ).input(e.target.value);
//                                         handleInputChange("phone", formatted);
//                                     }}
//                                     className="outline-none"
//                                     required
//                                 />
//                             </div>

//                             {/* Email */}
//                             <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3">
//                                 <Label htmlFor="email" className="sr-only">
//                                     Email
//                                 </Label>
//                                 <MdOutlineMail className="text-[#718096] w-6 h-6" />
//                                 <input
//                                     id="email"
//                                     name="email"
//                                     type="email"
//                                     placeholder="Email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="outline-none"
//                                     required
//                                 />
//                             </div>

//                             {/* Password */}
//                             <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3 relative">
//                                 <Label htmlFor="password" className="sr-only">
//                                     Password
//                                 </Label>
//                                 <MdLockOutline className="text-[#718096] w-6 h-6" />
//                                 <div>
//                                     <input
//                                         id="password"
//                                         name="password"
//                                         type={showPassword ? "text" : "password"}
//                                         placeholder="Password"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         className="outline-none"
//                                         required
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff className="h-5 w-5" />
//                                         ) : (
//                                             <Eye className="h-5 w-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Error */}
//                             {error && (
//                                 <div className="mb-4">
//                                     <Alert
//                                         message={
//                                             (error as any)?.data?.message ||
//                                             (typeof error === "object" && "message" in error
//                                                 ? (error as any).message
//                                                 : "An error occurred")
//                                         }
//                                         type="error"
//                                         showIcon
//                                     />
//                                 </div>
//                             )}

//                             {/* Category */}
//                             <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3">
//                                 <Label htmlFor="category" className="sr-only">
//                                     Category
//                                 </Label>
//                                 <TbCategory className="text-[#718096] w-6 h-6" />
//                                 <select
//                                     id="category"
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={(e) =>
//                                         handleInputChange("category", e.target.value)
//                                     }
//                                     className="w-full flex items-center gap-2 outline-none"
//                                     required
//                                 >
//                                     <option value="" disabled>
//                                         Category
//                                     </option>
//                                     <option value="PLAYGROUND">Playground Vendor</option>
//                                     <option value="EVENT">Event Organizer</option>
//                                     <option value="E_COMMERCE">Ecommerce Vendor</option>
//                                 </select>
//                             </div>

//                             {/* Country */}
//                             <div className="border border-[#DCE4E8] rounded-3xl bg-[#FFFFFF] flex items-center gap-2 px-4 py-3">
//                                 <Label htmlFor="country" className="sr-only">
//                                     Country
//                                 </Label>
//                                 <Select
//                                     onValueChange={(value) => {
//                                         const chosen = countryOptions.find(
//                                             (c) => c.code === value
//                                         );
//                                         if (chosen) {
//                                             setSelected(chosen);
//                                             setCountryCode(chosen.code);
//                                             setFormData((prev) => ({
//                                                 ...prev,
//                                                 phone: chosen.dialCode,
//                                             }));
//                                         }
//                                     }}
//                                 >
//                                     <SelectTrigger className="border-none">
//                                         {selected && (
//                                             <div className="flex items-center gap-4">
//                                                 <Image
//                                                     src={selected.flag}
//                                                     height={50}
//                                                     width={50}
//                                                     alt={selected.name}
//                                                     className="w-5 h-4 object-cover"
//                                                     priority
//                                                 />
//                                                 <span>{selected.name}</span>
//                                             </div>
//                                         )}
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {countryOptions.map((country) => (
//                                             <SelectItem key={country.code} value={country.code}>
//                                                 <div className="flex items-center gap-2">
//                                                     <Image
//                                                         src={country.flag}
//                                                         height={50}
//                                                         width={50}
//                                                         alt={country.name}
//                                                         className="w-5 h-4 object-cover"
//                                                         priority
//                                                     />
//                                                     <span>{country.name}</span>
//                                                 </div>
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Sign Up */}
//                             <Button
//                                 type="submit"
//                                 className="w-full h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white font-bold rounded-lg transition-colors mt-4"
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         Signing... <Spin indicator={customIcon} />
//                                     </>
//                                 ) : (
//                                     "Sign Up"
//                                 )}
//                             </Button>

//                             {/* Login Link */}
//                             <div className="text-center mt-8">
//                                 <span className="text-[#7C8091]">
//                                     Already have an account?{" "}
//                                 </span>
//                                 <Link href="/login">
//                                     <button
//                                         type="button"
//                                         className="text-[#1E3A8A] hover:underline font-bold"
//                                     >
//                                         Log In
//                                     </button>
//                                 </Link>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
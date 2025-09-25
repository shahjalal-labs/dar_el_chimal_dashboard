/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PiSpinner } from 'react-icons/pi';
import { useAddBankInfoMutation } from '@/redux/api/authApi';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import Image from 'next/image';

type CountryType = {
    code: string;
    name: string;
    flag: string;
};

const countryOptions: CountryType[] = [
    { code: "BH", name: "Bahrain", flag: "https://flagcdn.com/w40/bh.png" },
    { code: "QA", name: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
    { code: "SA", name: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png" },
    { code: "KW", name: "Kuwait", flag: "https://flagcdn.com/w40/kw.png" },
    { code: "AE", name: "United Arab Emirates", flag: "https://flagcdn.com/w40/ae.png" },
    { code: "OM", name: "Oman", flag: "https://flagcdn.com/w40/om.png" },
    { code: "TR", name: "Turkey", flag: "https://flagcdn.com/w40/tr.png" },
    { code: "TN", name: "Tunisia", flag: "https://flagcdn.com/w40/tn.png" },
    { code: "MA", name: "Morocco", flag: "https://flagcdn.com/w40/ma.png" },
    { code: "BD", name: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png" },
    { code: "GB", name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "US", name: "United States", flag: "https://flagcdn.com/w40/us.png" },
];

const BankInfo = () => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [selected, setSelected] = useState<CountryType>(countryOptions[0]);
    const [formData, setFormData] = useState<Record<string, string>>({
        countryCode: countryOptions[0].code,
        account_holder_name: "",
        email: "",
        account_number: "",
        bank_name: "",
        bank_address: "",
        iban: "",
        swift_code: "",
        sort_code: "",
        branch_name: "",
        routing_number: "",
    });

    const [AddBankInfo, { isLoading }] = useAddBankInfoMutation();

    const handleChange = (value: string, field: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = {
            account_holder_name: formData.account_holder_name,
            email: formData.email,
            account_number: formData.account_number,
            bank_name: formData.bank_name,
            bank_address: formData.bank_address,
            iban: formData.iban,
            swift_code: formData.swift_code,
            sort_code: formData.sort_code,
            branch_name: formData.branch_name,
            routing_number: formData.routing_number,
            countryCode: formData.countryCode,
        }

        try {
            const response = await AddBankInfo({ body }).unwrap();
            if (response.success) {
                toast.success(response.message || 'Bank info added successfully');
                closeRef.current?.click();
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div>
            <h1 className="text-xl md:text-2xl font-semibold">Add Your Bank Information</h1>
            <p className="text-sm text-gray-600 mt-0.5">
                Provide your bank information carefully!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-white p-6 rounded-lg xl:w-2/3">
                {/* Country Code Select */}
                <div>
                    <Label htmlFor="country">Country</Label>
                    <div className="border border-[#DCE4E8] bg-[#FFFFFF] rounded-lg flex items-center gap-2 px-4 py-3 mt-2">
                        <Select
                            value={formData.countryCode}
                            onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, countryCode: value }));
                                const found = countryOptions.find((c) => c.code === value);
                                if (found) setSelected(found);
                            }}
                        >
                            <SelectTrigger className="border-none">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={selected.flag}
                                        height={50}
                                        width={50}
                                        alt={selected.name}
                                        className="w-5 h-4 object-cover"
                                        priority
                                    />
                                    <span>{selected.name}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {countryOptions.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={country.flag}
                                                height={50}
                                                width={50}
                                                alt={country.name}
                                                className="w-5 h-4 object-cover"
                                                priority
                                            />
                                            <span>{country.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Account Holder Name */}
                <div>
                    <Label>Account Holder Name</Label>
                    <Input
                        placeholder="Account Holder Name"
                        value={formData.account_holder_name}
                        onChange={(e) => handleChange(e.target.value, "account_holder_name")}
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <Label>Email</Label>
                    <Input
                        type='email'
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleChange(e.target.value, "email")}
                        required
                    />
                </div>

                {/* Account Number */}
                <div>
                    <Label>Account Number</Label>
                    <Input
                        placeholder="Account Number"
                        value={formData.account_number}
                        onChange={(e) => handleChange(e.target.value, "account_number")}
                        required
                    />
                </div>

                {/* Bank Name */}
                <div>
                    <Label>Bank Name</Label>
                    <Input
                        placeholder="Bank Name"
                        value={formData.bank_name}
                        onChange={(e) => handleChange(e.target.value, "bank_name")}
                        required
                    />
                </div>

                {/* Bank Address */}
                {(formData.countryCode === "BH" || formData.countryCode === "BD" || formData.countryCode === "US") && (
                    <div>
                        <Label>Bank Address</Label>
                        <Input
                            placeholder="Bank Address"
                            value={formData.bank_address}
                            onChange={(e) => handleChange(e.target.value, "bank_address")}
                            required
                        />
                    </div>
                )}

                {/* IBAN */}
                {["BH", "QA", "SA", "KW", "AE", "OM", "TR"].includes(formData.countryCode) && (
                    <div>
                        <Label>IBAN</Label>
                        <Input
                            placeholder="IBAN"
                            value={formData.iban}
                            onChange={(e) => handleChange(e.target.value, "iban")}
                            required
                        />
                    </div>
                )}

                {/* Swift Code */}
                {["BH", "QA", "SA", "KW", "AE", "OM", "TR"].includes(formData.countryCode) && (
                    <div>
                        <Label>Swift Code</Label>
                        <Input
                            placeholder="Swift Code"
                            value={formData.swift_code}
                            onChange={(e) => handleChange(e.target.value, "swift_code")}
                            required
                        />
                    </div>
                )}

                {/* Sort Code */}
                {formData.countryCode === "GB" && (
                    <div>
                        <Label>Sort Code</Label>
                        <Input
                            placeholder="Sort Code"
                            value={formData.sort_code}
                            onChange={(e) => handleChange(e.target.value, "sort_code")}
                            required
                        />
                    </div>
                )}

                {/* Branch Name */}
                {formData.countryCode === "BD" && (
                    <div>
                        <Label>Branch Name</Label>
                        <Input
                            placeholder="Branch Name"
                            value={formData.branch_name}
                            onChange={(e) => handleChange(e.target.value, "branch_name")}
                            required
                        />
                    </div>
                )}

                {/* Routing Number */}
                {formData.countryCode === "US" && (
                    <div>
                        <Label>Routing Number</Label>
                        <Input
                            placeholder="Routing Number"
                            value={formData.routing_number}
                            onChange={(e) => handleChange(e.target.value, "routing_number")}
                            required
                        />
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-fit bg-[#1E3A8A] hover:bg-[#1E3A8ACC]"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center gap-2">
                                Saving...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <span>Save Bank Info</span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BankInfo;
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useState } from 'react';
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { GrUpload } from 'react-icons/gr';
import Image from 'next/image';
import { Button } from '../ui/button';
import { PiSpinner } from 'react-icons/pi';
import { useAddStoreMutation } from '@/redux/api/ecommerce/store';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

interface FormState {
    name: string;
    countryCode: string;
    deliveryCharge: string;
    vat: string;
    storeImage: File | null;
}

type CountryType = {
    code: string;
    name: string;
    flag: string;
};

const countryOptions = [
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

const AddStoreModal = () => {
    const [selected, setSelected] = useState<CountryType>(countryOptions[0]);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState<FormState>({
        name: '',
        countryCode: '',
        deliveryCharge: '',
        vat: '',
        storeImage: null,
    });

    const [AddStore, { isLoading }] = useAddStoreMutation();

    const handleChange = (value: string, field: keyof FormState) => {
        setFormData(prev => ({ ...prev, [field]: value as any }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData(prev => ({ ...prev, storeImage: e.target.files![0] }));
        }
    };

    const removeLogo = () => {
        setFormData(prev => ({ ...prev, storeImage: null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.warning('Store name is required');
            return;
        }

        const payload = {
            name: formData.name,
            countryCode: formData.countryCode,
            deliveryCharge: formData.deliveryCharge,
            vat: formData.vat,
            location: {
                type: "Point",
                address: "123 Sunset Blvd, Dhaka, Bangladesh",
                coordinates: [
                    "90.4125",
                    "23.8103"
                ]
            }
        };

        const storeData = new FormData();
        storeData.append('bodyData', JSON.stringify(payload));

        if (formData.storeImage) {
            storeData.append('storesImage', formData.storeImage);
        }

        try {
            const response = await AddStore(storeData).unwrap();
            if (response.success) {
                toast.success(response.message);
                closeRef.current?.click();
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || 'Something went wrong');
        }
    };

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl max-h-[80vh] overflow-y-auto p-6" showCloseButton>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Store</DialogTitle>
                <DialogDescription>Fill out the form below to add a new store.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Store Name */}
                <div>
                    <Label>Store Name</Label>
                    <Input
                        placeholder="Enter store name"
                        value={formData.name}
                        onChange={e => handleChange(e.target.value, 'name')}
                        required
                    />
                </div>

                {/* Country */}
                <div className="w-full">
                    <Label>Country</Label>
                    <Select
                        value={formData.countryCode}
                        onValueChange={(value) => {
                            setSelected(countryOptions.find((c) => c.code === value)!);
                            handleChange(value, 'countryCode');
                        }}
                    >
                        <SelectTrigger className="mt-2 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <Image src={selected.flag} height={50} width={50} alt={selected.name} className="w-5 h-4" />
                                <span>{selected.name}</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {countryOptions.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                    <div className="flex items-center gap-2">
                                        <Image src={country.flag} height={50} width={50} alt={country.name} className="w-5 h-4" />
                                        <span>{country.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Delivery Charge */}
                <div>
                    <Label>Delivery Charge</Label>
                    <Input
                        type='number'
                        placeholder="Enter delivery charge"
                        value={formData.deliveryCharge}
                        onChange={e => handleChange(e.target.value, 'deliveryCharge')}
                        required
                    />
                </div>

                {/* VAT */}
                <div>
                    <Label>VAT</Label>
                    <Input
                        type='number'
                        placeholder="Enter VAT (e.g., 0.02)"
                        value={formData.vat}
                        onChange={e => handleChange(e.target.value, 'vat')}
                        required
                    />
                </div>

                {/* Store Image */}
                <div>
                    <Label>Store Image</Label>
                    <label>
                        <div className="border border-dashed rounded-lg p-10 mt-2 flex flex-col items-center gap-2 cursor-pointer">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <GrUpload className="h-8 w-8 m-auto text-gray-400" />
                            <span className="text-center text-gray-400">Upload image</span>
                        </div>
                    </label>

                    {formData.storeImage && (
                        <div className="relative mt-4">
                            <Image
                                src={URL.createObjectURL(formData.storeImage)}
                                height={100}
                                width={100}
                                alt="store"
                                className="w-full h-full object-cover rounded"
                                priority
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 text-xs px-2 py-1"
                                onClick={removeLogo}
                            >
                                X
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-fit bg-[#1E3A8A] hover:bg-[#1E3A8ACC]">
                        {isLoading ? (
                            <div className="flex justify-center items-center gap-2">
                                Adding...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <span>Add Store</span>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default AddStoreModal;

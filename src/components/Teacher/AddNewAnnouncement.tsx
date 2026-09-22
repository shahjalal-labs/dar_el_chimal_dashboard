/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAnnouncementDate } from "@/redux/features/announcementSlice";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";
import {
    useCreateAnnouncementMutation,
    useGetTeacherOverviewQuery,
} from "@/redux/api/teacher/overviewApi";
import { useParams, useRouter } from "next/navigation";
import { TfiAngleLeft } from "react-icons/tfi";

interface AnnouncementFormData {
    announcementTitle: string;
    announcement: string;
    announcementDate: string;
}

const AddNewAnnouncement = () => {
    const router = useRouter();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const { data: teacherOverviewData } = useGetTeacherOverviewQuery(undefined);
    const teacherGrades = React.useMemo(
        () => teacherOverviewData?.result?.grades || [],
        [teacherOverviewData]
    );

    const [selectedGradeId, setSelectedGradeId] = useState<string>(
        id && id !== "all" ? (id as string) : ""
    );

    React.useEffect(() => {
        if (id && id !== "all") {
            setSelectedGradeId(id as string);
        } else if (!selectedGradeId && teacherGrades.length > 0) {
            setSelectedGradeId(teacherGrades[0].id);
        }
    }, [id, teacherGrades, selectedGradeId]);

    const [formData, setFormData] = useState<AnnouncementFormData>({
        announcementTitle: "",
        announcement: "",
        announcementDate: "",
    });

    const [CreateAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedGradeId) {
            toast.warning("Please select a class");
            return;
        }

        const body = {
            title: formData.announcementTitle,
            anouncement: formData.announcement,
            postdate: formData.announcementDate,
        };

        try {
            const response = await CreateAnnouncement({ id: selectedGradeId, body }).unwrap();
            if (response.success) {
                toast.success(response.message);
                setFormData({ announcementTitle: "", announcement: "", announcementDate: "" }); // reset form
                router.back();
            }
        } catch (error: any) {
            toast.warning(error?.data?.message || "Something went wrong");
        }
    };

    const isButtonDisabled =
        !formData.announcementTitle || !formData.announcement || !formData.announcementDate;

    return (
        <div>
            {/* Header */}
            <div className='mb-6 flex flex-col-reverse md:flex-row justify-between md:items-center'>
                <div>
                    <h1 className="text-2xl font-bold mb-3">Add New Announcement</h1>
                    <p className="font-medium">
                        <span className="text-[#72727299]">Announcement</span>
                        <span className="text-[#72727299] px-2">/</span>
                        Add New Announcement
                    </p>
                </div>
                <Button onClick={() => router.back()} className='mb-6 md:mb-0 bg-white/80 text-black hover:text-white cursor-pointer w-fit'><TfiAngleLeft />Back</Button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl space-y-5 p-10">
                {/* Class / Grade */}
                <div>
                    <Label>Class / Grade</Label>
                    <select
                        value={selectedGradeId}
                        onChange={(e) => {
                            const newGradeId = e.target.value;
                            setSelectedGradeId(newGradeId);
                            router.replace(`/teacher/classes/${newGradeId}/add-new-announcement`);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white mt-2"
                        required
                    >
                        <option value="" disabled>
                            {teacherGrades.length === 0 ? "No classes assigned" : "Select Class / Grade"}
                        </option>
                        {teacherGrades.map((g: any) => (
                            <option key={g.id} value={g.id}>
                                {g.grade}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <Label>Title</Label>
                    <Input
                        name="announcementTitle"
                        type="text"
                        value={formData.announcementTitle}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Announcement */}
                <div>
                    <Label>Announcement</Label>
                    <Textarea
                        name="announcement"
                        value={formData.announcement}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <Label>Date</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                type="button"
                                className={`w-full bg-white border border-gray-300 rounded-lg px-5 py-3 justify-between mt-2 ${formData.announcementDate ? "text-gray-800" : "text-gray-400"
                                    }`}
                            >
                                {formData.announcementDate
                                    ? new Date(formData.announcementDate).toLocaleDateString()
                                    : "Select date"}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-72 overflow-hidden p-2 bg-white border border-gray-300 rounded-3xl shadow-lg"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={
                                    formData.announcementDate ? new Date(formData.announcementDate) : undefined
                                }
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    if (!date) {
                                        dispatch(setAnnouncementDate(null));
                                        setFormData((prev) => ({ ...prev, announcementDate: "" }));
                                        return;
                                    }
                                    dispatch(setAnnouncementDate(date));
                                    setFormData((prev) => ({
                                        ...prev,
                                        announcementDate: date.toISOString(),
                                    }));
                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="px-6 border-[#636F85] text-[#636F85]"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isButtonDisabled}
                        className={`px-6 text-white font-medium border border-[#1E3A8A] transition-all duration-300 ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center gap-2">
                                Saving...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            "Save Announcement"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddNewAnnouncement;
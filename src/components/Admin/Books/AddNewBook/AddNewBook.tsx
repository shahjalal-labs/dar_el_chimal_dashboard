"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoLink } from "react-icons/go";
import { MdOutlineDataset } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import General from "./General";
import Resource from "./Resource";
import Grade from "./Grade";

const AddNewBook = () => {
    const [tab, setTab] = useState("general");

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold mb-3">
                    {
                        tab === "general" ?
                            "Add New Book" :
                            tab === "resources" ?
                                "Add Resources" :
                                "Add New Grade Mapping"
                    }
                </h1>
                <p className="font-medium">
                    <span className="text-[#72727299]">Book Management</span>
                    <span className="text-[#72727299] px-2">/</span>
                    {
                        tab === "general" ?
                            "Add New Book" :
                            tab === "resources" ?
                                "Add Resources" :
                                "Add New Grade Mapping"
                    }
                </p>
            </div>

            <div className="p-6 bg-white rounded-xl mt-6">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="flex gap-2 border-b border-gray-200 pb-2 mb-4">
                        <TabsTrigger
                            value="general"
                            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "general"
                                ? "bg-[#F8F8F8] text-[#1E3A8A]"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            <MdOutlineDataset /> General
                        </TabsTrigger>
                        <TabsTrigger
                            value="resources"
                            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "resources"
                                ? "bg-[#F8F8F8] text-[#1E3A8A]"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            <GoLink /> Resources
                        </TabsTrigger>
                        <TabsTrigger
                            value="grade"
                            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "grade"
                                ? "bg-[#F8F8F8] text-[#1E3A8A]"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            <RiGraduationCapLine /> Grade Mapping
                        </TabsTrigger>
                    </TabsList>

                    {/* ------------------- GENERAL TAB ------------------- */}
                    <TabsContent value="general">
                        <General />
                    </TabsContent>

                    {/* ------------------- RESOURCES TAB ------------------- */}
                    <TabsContent value="resources">
                        <Resource />
                    </TabsContent>

                    {/* ------------------- RESOURCES TAB ------------------- */}
                    <TabsContent value="grade">
                        <Grade />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AddNewBook;
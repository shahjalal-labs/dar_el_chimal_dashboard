"use client";

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import BasicSection from "./BasicSection"
// import Notifications from "./Notifications"
import AccountSection from "./AccountSection"
import { TooltipProvider } from "../ui/tooltip"

type SettingsSection = "basic" | "account" | "notifications"

export default function Settings() {
    const [activeSection, setActiveSection] = useState<SettingsSection>("basic")

    const sidebarItems = [
        { id: "basic" as const, label: "Basic" },
        { id: "account" as const, label: "Account" },
        // { id: "notifications" as const, label: "Notifications" },
    ]

    return (
        <TooltipProvider>
            <div className="md:flex gap-6">
                {/* Sidebar */}
                <div className="md:w-1/3 lg:w-1/4 bg-white h-fit rounded-lg">
                    <div className="p-6">
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${activeSection === item.id ? "bg-[#FF6B00] text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <span className="font-medium">{item.label}</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:w-2/3 lg:w-3/4 flex-1 p-6 bg-white mt-6 md:mt-0">
                    {/* Basic Section */}
                    {activeSection === "basic" && (
                        <BasicSection />
                    )}
                    {/* Account Section */}
                    {activeSection === "account" && (
                        <AccountSection />
                    )}
                    {/* Notifications Section */}
                    {/* {activeSection === "notifications" && (
                        <Notifications />
                    )} */}
                </div>
            </div>
        </TooltipProvider>
    )
}

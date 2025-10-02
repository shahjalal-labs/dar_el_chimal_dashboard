"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ReactNode } from "react";
import { RootState } from "@/redux/store/store";

type UserRole = "Student" | "Teacher" | "Admin";

interface RoleGuardProps {
    role: UserRole;
    children: ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ role, children }) => {
    const authState = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (authState.role !== role) {
            toast.warning("You are not authorized to view this page.");
            router.push("/");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (authState.role === role) ? children : null;
};

export default RoleGuard;

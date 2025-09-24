"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ReactNode } from "react";
import { RootState } from "@/redux/store/store";

type UserRole = "ADMIN" | "VENDOR";
type UserCategory = "PLAYGROUND" | "EVENT" | "E_COMMERCE" | null;

interface RoleGuardProps {
    role: UserRole;
    category: UserCategory;
    children: ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ role, category, children }) => {
    const authState = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (authState.role !== role && authState.businessCategory !== category) {
            toast.warning("You are not authorized to view this page.");
            router.push("/");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ((authState.role === role) || (authState.businessCategory === category)) ? children : null;
};

export default RoleGuard;

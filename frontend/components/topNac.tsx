"use client";
import ROUTES from "@/lib/routes/route";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios/api";
import { LocalRepo } from "@/lib/core/local.repo";

export default function TopNav() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>({});
    const handleLogOut = async (e:any) => {
        e.preventDefault();
        LocalRepo.clearToken();
        router.push(ROUTES.LOGIN);
    };

    const getProfile = async () => {
        try {
            const response = await api.get("/employee/account");
            setProfile(response.data.data[0]);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                        <Image
                            src={profile.image}
                            width={36}
                            height={36}
                            alt="Avatar"
                            className="rounded-full"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel onClick={() => router.push(`/profile`)}>
                        My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/settings`)}>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/support`)}>
                        Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

"use client";
import api from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams } from "next/navigation";

import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
// import { RadioGroup, RadioGroup.Option, RadioGroup.Option.Label, RadioGroup.Option.Input } from "@/components/ui/radio-group"

export default function Component() {
    const router = useRouter();

    const [account, setAccount] = useState<any>([]);
    const [token, setToken] = useState("");
    const fetchAccount = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem("token");
            console.log(storedToken);
            if (!storedToken) {
                router.push("/login");
                return;
            }

            const response = await api.get("/employee/account", {
            });
            console.log("asdasdasdasd");
            console.log(response.data.data[0]);

            setAccount(response.data.data[0]);
        } catch (error) {
            console.error("Failed to fetch account:", error);

        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            fetchAccount();
        }
    }, [router, fetchAccount, token]);
    return (
        <div className="mx-auto max-w-4xl my-10">
            <div className="px-4 space-y-6 sm:px-6">
                <header className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <img src="/placeholder.svg" alt="Avatar" width="96" height="96" className="rounded-full" />
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{account.name}</h1>
                            <Button size="sm">Change photo</Button>
                        </div>
                    </div>
                </header>
                <div className="space-y-8">
                    <Card>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="E.g. Jane Doe" defaultValue={account.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="E.g. jane@example.com" defaultValue={account.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" placeholder="E.g. jane@example.com" defaultValue={account.phone} />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Textarea id="bio" placeholder="Enter your bio" className="mt-1" style={{ minHeight: "100px" }} defaultValue={account.address} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applied at</TableHead>
                                    <TableHead className="hidden md:table-cell"></TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>






                            </TableBody>
                        </Table>
                    </Card>
                </div>
                <div className="pt-6">
                    <Button>Save</Button>
                </div>
            </div>
        </div>
    )
}
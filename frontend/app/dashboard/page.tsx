"use client";
import Image from "next/image";

import { ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import router, { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "@/api/api";
import TopNav from "@/components/topNac";
import CompanyService from "../service/companyService";
const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
];
const companyService = new CompanyService();
export default function Dashboard() {
    const router = useRouter();
    const [companies, setCompanies] = useState<any[]>([]);
    const [token, setToken] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        weburl: ''
    });

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await api.post('/company/signup', formData);
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    const handleLogOut = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        localStorage.clear();
    };

    const fetchCompanyList = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem("token");
            console.log(storedToken);
            if (!storedToken) {
                router.push("/login");
                return; // Exit function if no token
            }

            // const response = await api.get("/company/all/base", {
            //     headers: {
            //         Authorization: `Bearer ${storedToken}`,
            //     },
            // });

            const response = await companyService.getCompanies();
            console.log(response.data.list);
            setCompanies(response.data.list);
        } catch (error) {
            console.error("Failed to fetch company list:", error);

        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            fetchCompanyList();
        }
    }, [router, fetchCompanyList, token]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <TopNav />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <div className="ml-auto flex items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="h-8 gap-1">
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Company</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add Company</DialogTitle>
                                            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">Name</Label>
                                                <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="email" className="text-right">Email</Label>
                                                <Input id="email" value={formData.email} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="password" className="text-right">Password</Label>
                                                <Input id="password" value={formData.password} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                                <Input id="phone" value={formData.phone} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="address" className="text-right">Address</Label>
                                                <Input id="address" value={formData.address} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="weburl" className="text-right">Web URL</Label>
                                                <Input id="weburl" value={formData.weburl} onChange={handleChange} className="col-span-3" />
                                            </div>


                                            <DialogFooter>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Байгууллага</CardTitle>
                                    <CardDescription>Manage your products and view their sales performance.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead className="hidden md:table-cell">Created at</TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <Dialog>
                                                {companies?.map((company) => (

                                                    <TableRow key={company.id} onClick={() => router.push(`/dashboard/detail/${company.id}`)}>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Image
                                                                alt="Product image"
                                                                className="aspect-square rounded-md object-cover"
                                                                height="64"
                                                                src={company.image ? company.image : "/placeholder.svg"}
                                                                width="64"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">{company.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{company.email}</Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">{company.createdAt}</TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>

                                                ))}

                                                <DialogContent className="sm:max-w-[625px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Internship Name</DialogTitle>
                                                        <DialogDescription>Internship Type</DialogDescription>
                                                    </DialogHeader>

                                                    {/* <Table>
                                                        <TableCaption>A list of your recent invoices.</TableCaption>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-[100px]">Invoice</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead>Method</TableHead>
                                                                <TableHead className="text-right">Amount</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {invoices.map((invoice) => (
                                                                <TableRow key={invoice.invoice}>
                                                                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                                                    <TableCell>{invoice.paymentStatus}</TableCell>
                                                                    <TableCell>{invoice.paymentMethod}</TableCell>
                                                                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <Button size="sm" className="h-8 gap-1">
                                                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Student</span>
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>

                                                    </Table> */}
                                                    <DialogFooter>
                                                        <Button type="submit">Save changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong> products
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}

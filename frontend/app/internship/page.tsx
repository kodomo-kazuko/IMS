"use client";
import Image from "next/image";

import { Check, ChevronsUpDown, ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
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

import api from "@/api/api";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import TopNav from "@/components/topNac";


export default function Internship() {
    const router = useRouter();
    const [internships, setInternships] = useState<any[]>([]);
    const [internTypes, setInternTypes] = useState<any[]>([]);
    const [token, setToken] = useState("");
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        enrollmentEndDate: '',
        startDate: '',
        endDate: '',
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
            const response = await api.post('/internship/create', formData);
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };
    const handleLogOut = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        localStorage.clear();
    };

    const fetchIntroductionType = useCallback(async () => {
        const storedToken = localStorage.getItem("token");
        try {
            const response = await api.get("/internship/types");
            console.log(response.data.data);
            setInternTypes(response.data.data);
        } catch (error) {
            console.error("Failed to fetch intoduction Type:", error);

        }
    }, []);

    const fetchCompanyList = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem("token");
            console.log(storedToken);
            if (!storedToken) {
                router.push("/login");
                return;
            }

            const response = await api.get("/internship/all/base");
            console.log(response.data.data.list);
            setInternships(response.data.data.list);
        } catch (error) {
            console.error("Failed to fetch company list:", error);

        }
    }, [router]);

    useEffect(() => {
        fetchIntroductionType();
        fetchCompanyList();
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
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Internship</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add Internshp</DialogTitle>
                                            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">


                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="title" className="text-right">
                                                    Title
                                                </Label>
                                                <Input id="title" value={formData.title} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="type" className="text-right">
                                                    Type
                                                </Label>
                                                <Input id="type" value={formData.type} onChange={handleChange} className="col-span-3" />
                                            </div>

                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="enrollmentEndDate" className="text-right">
                                                    Enrollment End Date
                                                </Label>
                                                <Input id="enrollmentEndDate" value={formData.enrollmentEndDate} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="startDate" className="text-right">
                                                    Start date
                                                </Label>
                                                <Input id="startDate" value={formData.startDate} onChange={handleChange} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="endDate" className="text-right">
                                                    End date
                                                </Label>
                                                <Input id="endDate" value={formData.endDate} onChange={handleChange} className="col-span-3" />
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
                                    <CardTitle>Дадлага
                                    </CardTitle>
                                    <CardDescription>Manage your products and view their sales performance.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>

                                                <TableHead>Title</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Profession</TableHead>
                                                <TableHead className="hidden md:table-cell">Deadline</TableHead>
                                                <TableHead className="hidden md:table-cell">Start Date</TableHead>
                                                <TableHead className="hidden md:table-cell">End Date</TableHead>

                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <Dialog>
                                                {/* <TableRow>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Image
                                                                alt="Product image"
                                                                className="aspect-square rounded-md object-cover"
                                                                height="64"
                                                                src="/placeholder.svg"
                                                                width="64"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            Laser Lemonade Machine
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">Draft</Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            $499.99
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            25
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            2023-07-12 10:42 AM
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                    >
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
                                                    </TableRow> */}

                                                {internships?.map((internship) => (
                                                    <DialogTrigger asChild key={internship.id}>
                                                        <TableRow key={internship.id}>

                                                            <TableCell className="font-medium">{internship.title}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">{internship.type}</Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">{internship.type}</Badge>
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">{internship.enrollmentEndDate}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{internship.startDate}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{internship.endDate}</TableCell>
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
                                                    </DialogTrigger>
                                                ))}

                                                <DialogContent className="sm:max-w-[625px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Internship name</DialogTitle>
                                                        <DialogDescription>Internship profession</DialogDescription>
                                                    </DialogHeader>

                                                    <DialogFooter>
                                                        <Button type="submit">Apply</Button>
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

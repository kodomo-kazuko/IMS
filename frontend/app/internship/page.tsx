"use client";
import {
    MoreHorizontal,
    PlusCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api from "@/api/api";
import TopNav from "@/components/topNac";
import toast from "react-hot-toast";
import InternshipService from "../service/internshipService";

const internshipService = new InternshipService();

export default function Internship() {
    const router = useRouter();
    const [internships, setInternships] = useState<any[]>([]);
    const [token, setToken] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        enrollmentEndDate: "",
        startDate: "",
        endDate: "",
    });

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await api.post("/internship/create", formData);
            console.log(response.data);
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };


    const fetchInternshipList = useCallback(async () => {
        try {
            const response = await internshipService.getInternships();
            console.log(response.data.list);
            setInternships(response.data.list);
        } catch (error: any) {
            console.error("Failed to fetch internship list:", error);
            toast.error(error.response.data.message);
        }
    }, [router]);

    useEffect(() => {
        fetchInternshipList();
    }, [router, fetchInternshipList, token]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <TopNav />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <div className="ml-auto flex items-center gap-2">
                                <Button
                                    size="sm"
                                    className="h-8 gap-1"
                                    onClick={() => router.push("/internship/form")}
                                >
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Add Internship
                                    </span>
                                </Button>

                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Дадлага</CardTitle>
                                    <CardDescription>
                                        Manage your products and view their sales performance.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Profession</TableHead>
                                                <TableHead>Salary</TableHead>
                                                <TableHead>Number of applicants</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Deadline
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Start Date
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    End Date
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <Dialog>
                                                {internships?.map((internship) => (
                                                    <DialogTrigger asChild key={internship.id}>
                                                        <TableRow key={internship.id}>
                                                            <TableCell className="font-medium">
                                                                {internship.title}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {internship.type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {internship.type}
                                                                </Badge>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {internship.salary === false
                                                                        ? "Unpaid"
                                                                        : "Paid"}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {/* <Badge variant="outline">
                                                                    {
                                                                        internship.Requirement[0]?.approvedApps
                                                                            .length
                                                                    }
                                                                    /{internship.Requirement[0]?.studentLimit}
                                                                </Badge> */}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {internship.enrollmentEndDate.slice(0, 10)}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {internship.startDate.slice(0, 10)}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {internship.endDate.slice(0, 10)}
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
                                                                            <span className="sr-only">
                                                                                Toggle menu
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" >
                                                                        <DropdownMenuLabel>
                                                                            Actions
                                                                        </DropdownMenuLabel>
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
                                                        <DialogDescription>
                                                            Internship profession
                                                        </DialogDescription>
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
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
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

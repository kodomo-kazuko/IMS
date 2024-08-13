"use client";
import api from "@/lib/axios/api";
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

export default function Component({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const [applications, setApplications] = useState<any[]>([]);
    const [student, setStudent] = useState<any>('');
    const [token, setToken] = useState("");
    const fetchStudent = useCallback(async () => {
        try {

            const response = await api.get(`/company/${params.slug}`, {
                params: {
                    studentId: params.slug,
                }
            });

            setStudent(response.data.data[0]);

        } catch (error) {
            console.error("Failed to fetch student application list:", error);
        }
    }, [router]);
    const fetchStudentApplicationList = useCallback(async () => {
        try {
            const response = await api.get("/application/all/base", {
                params: {
                    studentId: params.slug,
                }
            });
            console.log(response.data.data.list);

            setApplications(response.data.data.list);
        } catch (error) {
            console.error("Failed to fetch student application list:", error);

        }
    }, [router]);

    useEffect(() => {
            fetchStudentApplicationList();
            fetchStudent();
    }, [router, fetchStudentApplicationList]);
    return (
        <div className="mx-auto max-w-4xl my-10">
            <div className="px-4 space-y-6 sm:px-6">
                <header className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <img src="/placeholder.svg" alt="Avatar" width="96" height="96" className="rounded-full" />
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{student.name}</h1>
                            <Button size="sm">Change photo</Button>
                        </div>
                    </div>
                </header>
                <div className="space-y-8">
                    <Card>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" readOnly placeholder="E.g. Jane Doe" defaultValue={student.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" readOnly placeholder="E.g. jane@example.com" defaultValue={student.email} />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Textarea id="bio" readOnly placeholder="Enter your bio" className="mt-1" style={{ minHeight: "100px" }} defaultValue={student.address} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea id="description" readOnly placeholder="Enter your Description" className="mt-1" style={{ minHeight: "100px" }} defaultValue={student.address} />
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


                                {applications.map((application) => (

                                    <TableRow key={application.id}>

                                        <TableCell className="font-medium">
                                            {application.type}
                                        </TableCell>
                                        <TableCell>
                                            {application.internship.company.name}
                                        </TableCell>
                                        <TableCell>
                                            {application.status}
                                        </TableCell>
                                        <TableCell>
                                            {application.appliedAt}
                                        </TableCell>

                                    </TableRow>

                                ))}



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
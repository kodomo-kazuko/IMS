"use client";
import api from "@/api/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StudentTabsComponent from "@/components/student/StudentTabs";
import StudentTable from "@/components/student/StudentApplyTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { RadioGroup, RadioGroup.Option, RadioGroup.Option.Label, RadioGroup.Option.Input } from "@/components/ui/radio-group"

export default function Component({ params }: { params: { slug: string } }) {
    const router = useRouter();

    const [applications, setApplications] = useState<any[]>([]);
    const [student, setStudent] = useState<any>('');
    const [token, setToken] = useState("");
    const fetchStudent = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem("token");
            console.log(storedToken);
            if (!storedToken) {
                router.push("/login");
                return;
            }

            const response = await api.get(`/student/${params.slug}`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
                params: {
                    studentId: params.slug,
                }
            });

            console.log(response.data.data[0]);

            setStudent(response.data.data[0]);

        } catch (error) {
            console.error("Failed to fetch student application list:", error);
        }
    }, [router]);
    const fetchStudentApplicationList = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem("token");
            console.log(storedToken);
            if (!storedToken) {
                router.push("/login");
                return;
            }

            const response = await api.get("/application/all/base", {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
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
        const token = localStorage.getItem("token");
        console.log(params.slug)
        if (!token) {
            router.push("/login");
        } else {
            fetchStudentApplicationList();
            fetchStudent();
        }
    }, [router, fetchStudentApplicationList, token]);
    return (

        <div className="mx-auto max-w-4xl my-10">
            <div className="px-4 space-y-6 sm:px-6">
                <header className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <img src="/placeholder.svg" alt="Avatar" width="96" height="96" className="rounded-full" />
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{student.name}</h1>
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
                        </CardContent>
                    </Card>

                    <StudentTabsComponent applied={applications} accepted={applications} />
                </div>
            </div>

        </div>

    )
}
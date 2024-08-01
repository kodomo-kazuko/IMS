"use client";
import api from "@/api/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StudentTabsComponent from "@/components/student/StudentTabs";

// import { RadioGroup, RadioGroup.Option, RadioGroup.Option.Label, RadioGroup.Option.Input } from "@/components/ui/radio-group"

import ApplicationService from "@/app/service/applicationService";

const applicationService = new ApplicationService();
export default function Component({ params }: { params: { slug: string } }) {
    const router = useRouter();

    const [applications, setApplications] = useState<any[]>([]);
    const [student, setStudent] = useState<any>('');
    const [token, setToken] = useState("");
    const [applied, setApplied] = useState<any[]>([]);
    const [accepted, setAccepted] = useState<any[]>([]);
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

    const fetchApplications = useCallback(async () => {
        try {
            const appliedResponse = await applicationService.getApplications("pending", params.slug);
            const acceptedResponse = await applicationService.getApplications("approved", params.slug);
            setApplied(appliedResponse.list);
            setAccepted(acceptedResponse.list);
            console.log(applied)
            console.log(accepted)
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        }
    }, [params.slug]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            fetchStudent();
            fetchApplications();
        }
    }, [router, fetchApplications, token]);

    return (

        <div className="mx-auto max-w-4xl my-10">
            <div className="px-4 space-y-6 sm:px-6">
                <header className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <img src={student.image} alt="Avatar" width="96" height="96" className="rounded-full" />
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
                            <div className="space-y-2">
                                <Label>CV</Label>
                                <Input id="cv" placeholder="E.g. jane@example.com" type="file" />
                            </div>
                        </CardContent>
                    </Card>

                    <StudentTabsComponent applied={applied} accepted={accepted} />
                </div>
            </div>

        </div>

    )
}
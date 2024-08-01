"use client";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api from "@/api/api";
import TopNav from "@/components/topNac";
import toast from "react-hot-toast";
import InternshipService from "../service/internshipService";
import InternshipTable from "@/components/internship/InternshipTable";

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
                                    <InternshipTable internships={internships} />
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

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
import api from "@/lib/axios/api";
import TopNav from "@/components/topNac";
import toast from "react-hot-toast";
import InternshipService from "../service/internshipService";
import InternshipTable from "@/components/internship/InternshipTable";
import useAuth from "../auth/useAuth";

const internshipService = new InternshipService();

export default function Internship() {
    useAuth()
    const router = useRouter();
    const [internships, setInternships] = useState<any[]>([]);

    const fetchInternshipList = useCallback(async () => {
        const response = await internshipService.getInternships();
        console.log(response.data.list);
        setInternships(response.data.list);
    }, [router]);

    useEffect(() => {
        fetchInternshipList(); 
    }, [router, fetchInternshipList]);

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

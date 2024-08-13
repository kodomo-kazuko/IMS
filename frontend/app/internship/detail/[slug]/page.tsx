"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios/api";
import { useEffect, useState } from "react";


export default function Component({ params }: { params: { slug: string } }) {

    const [internship, setInternship] = useState<any>({});
    const fetchInternship = async () => {
        
        try {
            const response = await api.get(`/internship/${params.slug}`);
            console.log(response.data.data);
            setInternship(response.data.data);
        } catch (error) {
            console.error("Failed to fetch internship list:", error);
        }
    }

    useEffect(() => {
        fetchInternship();
    }, []);
    return (
        <div className="mx-auto max-w-4xl my-10">
            <div className="px-4 space-y-6 sm:px-6">
                
                <div className="space-y-8">
                    <Card>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Title</Label>
                                <p>{internship?.title}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Type</Label>
                                <p>{internship?.type}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Salary</Label>
                                <p>{(internship?.salary) ? "PAID": "FREE"}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div>Language</div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">

                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div>Change Password</div>
                            <div>For your security, please do not share your password with others.</div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="pt-6">
                    <Button>Save</Button>
                </div>
            </div>
        </div>
    )
}
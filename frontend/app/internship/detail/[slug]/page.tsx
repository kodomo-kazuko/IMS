"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroup.Option, RadioGroup.Option.Label, RadioGroup.Option.Input } from "@/components/ui/radio-group"

export default function Component() {
    return (
        <div className="mx-auto max-w-4xl my-10">
            <div className="px-4 space-y-6 sm:px-6">
                <header className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <img src="/placeholder.svg" alt="Avatar" width="96" height="96" className="rounded-full" />
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">Meadow Richardson</h1>
                            <Button size="sm">Change photo</Button>
                        </div>
                    </div>
                </header>
                <div className="space-y-8">
                    <Card>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="E.g. Jane Doe" defaultValue="Meadow Richardson" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="E.g. jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Biography</Label>
                                <Textarea id="bio" placeholder="Enter your bio" className="mt-1" style={{ minHeight: "100px" }} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div>Language</div>
                            <div>Choose your preferred language</div>
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
                                <Input type="password" id="current-password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input type="password" id="new-password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input type="password" id="confirm-password" />
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
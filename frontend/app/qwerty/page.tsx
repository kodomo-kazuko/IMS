import StudentTable from "@/components/student/StudentApplyTable"
import StudentTabsComponent from "@/components/student/StudentTabs"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function TabsDemo() {
    return (
        <div className="mx-auto max-w-4xl my-10">
            <header className="space-y-2">
                <div className="flex items-center space-x-3">
                    <img src="/placeholder.svg" alt="Avatar" width="96" height="96" className="rounded-full" />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">asd</h1>
                    </div>
                </div>
            </header>
            <div className="space-y-8">
                <Card>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" readOnly placeholder="E.g. Jane Doe" defaultValue="asd" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" readOnly placeholder="E.g. jane@example.com" defaultValue="asd" />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Textarea id="bio" readOnly placeholder="Enter your bio" className="mt-1" style={{ minHeight: "100px" }} defaultValue="asd" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <Tabs defaultValue="applied" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="applied">Account</TabsTrigger>
                            <TabsTrigger value="accepted">Password</TabsTrigger>

                        </TabsList>
                        <TabsContent value="applied">
                            <StudentTable headers={["Company", "Type", "Status", "Applied at", "Start Date", "End Date"]} data={[]} />
                        </TabsContent>
                        <TabsContent value="accepted">
                            <StudentTable headers={["Company", "Type", "Status", "Applied at", "Start Date", "End Date"]} data={[]} />
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>


    )
}

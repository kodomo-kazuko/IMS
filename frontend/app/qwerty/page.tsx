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

export default function TabsDemo() {
    return (
        <Card>
            <Tabs defaultValue="applied" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="applied">Account</TabsTrigger>
                    <TabsTrigger value="accepted">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="applied">

                </TabsContent>
                <TabsContent value="accepted">

                </TabsContent>
            </Tabs>
        </Card>
    )
}

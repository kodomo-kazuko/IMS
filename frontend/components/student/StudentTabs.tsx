import { Card } from '@mui/material';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import React from 'react';
import StudentTable from './StudentApplyTable';


// interface Application {
//     company: string;
//     type: string;
//     status: string;
//     appliedAt: string;
//     startDate: string;
//     endDate: string;
// }

// Define the props for the TabsComponent
import prisma from '@/prisma/prisma';
interface TabsComponentProps {
    applied: prisma.Application[];
    accepted: prisma.Application[];
}

const StudentTabsComponent: React.FC<TabsComponentProps> = ({ applied, accepted }) => {
    return (
        <Tabs defaultValue="applied" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
            </TabsList>
            <TabsContent value="applied">
                <Card>
                    <StudentTable headers={["Company", "Type", "Status", "Applied at", "Start Date", "End Date"]} data={applied} type='applied' />
                </Card>
            </TabsContent>
            <TabsContent value="accepted">
                <Card>
                    <StudentTable headers={["Company", "Type", "Status", "Applied at", "Start Date", "End Date"]} data={accepted} type='approved' />
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default StudentTabsComponent;

import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
interface Internship {
    id: string;
    title: string;
    type: string;
    profession: string;
    salary: boolean;
    enrollmentEndDate: string;
    startDate: string;
    endDate: string;
    Requirement?: { approvedApps: any[]; studentLimit: number }[];
}

interface InternshipTableProps {
    internships: Internship[];
}

const InternshipTable: React.FC<InternshipTableProps> = ({ internships }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Profession</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Number of applicants</TableHead>
                    <TableHead className="hidden md:table-cell">Deadline</TableHead>
                    <TableHead className="hidden md:table-cell">Start Date</TableHead>
                    <TableHead className="hidden md:table-cell">End Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <Dialog>
                    {internships?.map((internship) => (
                        <DialogTrigger asChild key={internship.id}>
                            <TableRow key={internship.id}>
                                <TableCell className="font-medium">{internship.title}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{internship.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{internship.profession}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{internship.salary ? 'Paid' : 'Unpaid'}</Badge>
                                </TableCell>
                                <TableCell>
                                    {/* <Badge variant="outline">
                                        {internship.Requirement[0]?.approvedApps.length}/{internship.Requirement[0]?.studentLimit}
                                    </Badge> */}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {internship.enrollmentEndDate.slice(0, 10)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {internship.startDate.slice(0, 10)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {internship.endDate.slice(0, 10)}
                                </TableCell>
                            </TableRow>
                        </DialogTrigger>
                    ))}
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Internship name</DialogTitle>
                            <DialogDescription>Internship profession</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="submit">Apply</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TableBody>
        </Table>
    );
};

export default InternshipTable;

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface TableProps {
    headers: string[];
    data: any[]
}


const StudentTable: React.FC<TableProps> = ({ headers, data }) => {
    return (
        <Table className="table-auto w-full">
            <TableHeader>
                <TableRow>
                    {headers.map((header, index) => (
                        <TableHead key={index} className="px-4 py-2">{header}</TableHead>
                    ))}
                    <TableHead className="hidden md:table-cell"></TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((application, index) => (
                    <TableRow key={index} className="border-t">
                        <TableCell className="font-medium px-4 py-2">{application.internship.company.name}</TableCell>
                        <TableCell className="px-4 py-2">{application.type}</TableCell>
                        <TableCell className="px-4 py-2">{application.status}</TableCell>
                        <TableCell className="px-4 py-2">{application.appliedAt}</TableCell>
                        <TableCell className="px-4 py-2">{application.startDate}</TableCell>
                        <TableCell className="px-4 py-2">{application.endDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
export default StudentTable
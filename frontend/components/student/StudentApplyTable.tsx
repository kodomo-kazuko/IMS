import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface TableProps {
    headers: string[];
    data: any[]
    type: string
}
import prisma from '@/prisma/prisma';

const StudentTable: React.FC<TableProps> = ({ headers, data, type }) => {
    prisma.ApplicationStatus
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
                        <TableCell className="px-4 py-2">{application.appliedAt.slice(0, 10)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
export default StudentTable
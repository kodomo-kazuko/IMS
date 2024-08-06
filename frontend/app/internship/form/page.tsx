"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ComboboxDemo from "@/components/combobox";
import InternshipService from "@/app/service/internshipService";
import toNewArray from "@/utils/toArray";
import DatePickerDemo from "@/components/datepicker";
import { Checkbox } from "@/components/ui/checkbox";

const FormSchema = z.object({
    title: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    type: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    enrollmentEndDate: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    salary: z.boolean().refine((val) => val === true, {
        message: "Please read and accept the terms and conditions",
    }),
});

const internshipService = new InternshipService();
export default function InputForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            type: "",
            enrollmentEndDate: "",
            startDate: "",
            endDate: "",
            salary: false,
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(form.getValues());
        const response = await internshipService.createInternship(form.getValues());
        console.log(response);
        if (response.success) {
            toast.success("You submitted the following values");
            router.push("/internship");
        } else {
            console.log("fuck you its not working go to toilet and touch your self");
        }
    }
    const [type, setType] = useState<any[]>([]);
    const fetchTypeList = useCallback(async () => {
        try {
            const response = await internshipService.getTypes();
            setType(toNewArray(response.data));
            console.log(toNewArray(response.data))
        } catch (error: any) {
            console.error("Failed to fetch internship list:", error);
            toast.error(error.response.data.message);
        }
    }, [router]);

    useEffect(() => {
        fetchTypeList();
        console.log(form.getValues())
    }, [fetchTypeList, form, router]);


    return (
        <div className="flex min-h-screen w-full flex-col justify-center items-center bg-muted/40">
            <h1 className="text-3xl font-bold">Internship Add</h1>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <br />
                                    <FormControl>
                                        <ComboboxDemo
                                            value={field.value}
                                            onChange={field.onChange}
                                            frameworks={type}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="enrollmentEndDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enrollment End Date</FormLabel>
                                    <br />
                                    <FormControl>
                                        <DatePickerDemo value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <br />
                                    <FormControl>
                                        <DatePickerDemo value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <br />
                                    <FormControl>
                                        <DatePickerDemo value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salary</FormLabel>
                                    <br />
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

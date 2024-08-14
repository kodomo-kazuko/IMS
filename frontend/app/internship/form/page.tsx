"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form"; // Import useFieldArray
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
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  type: z.string().min(2, { message: "Type must be at least 2 characters." }),
  enrollmentEndDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  salary: z.boolean(),
  requirements: z.array(z.object({
    majorId: z.number().min(1, { message: "Major ID is required." }),
    studentLimit: z.number().min(1, { message: "Student limit must be at least 1." }),
  })).min(1, { message: "At least one requirement is required." }), // Ensure at least one requirement
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
      requirements: [{ majorId: 1, studentLimit: 10 }], // Initialize with one requirement
    },
  });
  
  const { fields, append, remove } = useFieldArray({ // Use useFieldArray
    control: form.control,
    name: "requirements", // Field name for requirements
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
      const response = await internshipService.createInternship(data);
      console.log(response);
      if (response.success) {
        toast.success("Internship created successfully!");
        router.push("/internship");
      } else {
        toast.error("Failed to create internship. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  const [type, setType] = useState<any[]>([]);
  const fetchTypeList = useCallback(async () => {
    try {
      const response = await internshipService.getTypes();
      setType(toNewArray(response.data));
    } catch (error: any) {
      console.error("Failed to fetch internship types:", error);
      toast.error(error.response?.data?.message || "Failed to fetch types.");
    }
  }, [router]);

  useEffect(() => {
    fetchTypeList();
  }, [fetchTypeList]);

  return (
    <div className="flex min-h-screen w-full flex-col justify-center items-center bg-muted/40 ">
      <div className="rounded-lg bg-[#ffffff] border-borderColor border p-16">
        <h1 className="text-3xl font-bold">Create Internship</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Internship Title" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <ComboboxDemo
                        value={field.value}
                        onChange={field.onChange}
                        frameworks={type}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="enrollmentEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enrollment End Date</FormLabel>
                    <FormControl>
                      <DatePickerDemo
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
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
                    <FormControl>
                      <DatePickerDemo
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
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
                    <FormControl>
                      <DatePickerDemo
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Requirements</h2>
              {fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`requirements.${index}.majorId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major ID</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Major ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`requirements.${index}.studentLimit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Limit</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Student Limit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <br />
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" className="mt-4" onClick={() => append({ majorId: 1, studentLimit: 10 })}>
                Add Requirement
              </Button>
            </div>
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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

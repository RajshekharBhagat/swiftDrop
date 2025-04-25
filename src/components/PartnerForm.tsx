"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DeliveryPartner } from "@/models/DeliveryPartner.model";
import { partnerSchema } from "@/schema/partner.schema";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type PartnerFormData = z.infer<typeof partnerSchema> & { _id?: string };
interface PartnerFormProps {
  formHeading?: string;
  selectedPartner?: DeliveryPartner;
  buttonText?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}
const PartnerForm = ({
  buttonText,
  formHeading,
  selectedPartner,
  onCancel,
  onSuccess,
}: PartnerFormProps) => {
  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      areas: [],
      shift: {
        start: "",
        end: "",
      },
      status: "active",
    },
  });

  useEffect(() => {
    if (selectedPartner) {
      form.reset({
        _id: selectedPartner._id || "",
        name: selectedPartner.name || "",
        email: selectedPartner.email || "",
        phone: selectedPartner.phone || "",
        areas: selectedPartner.areas || [],
        shift: {
          start: selectedPartner.shift.start || "",
          end: selectedPartner.shift.end || "",
        },
        status: selectedPartner.status || "active",
      });
    }
  }, [selectedPartner, form]);

  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { mutate: partnerRegister, isPending: registerPending } = useMutation({
    mutationFn: async (data: PartnerFormData) => {
      const res = await axios.post("/api/partner", data);
      return res.data;
    },
    onSuccess: () => {
      toast("Partner registered successfully!");
      form.reset();
      onSuccess?.();
      router.push("/partner");
    },
    onError: (error: any) => {
      toast(error?.response?.data?.error || "Failed to register partner");
    },
  });

  const { mutate: deletePartner,isPending: deletePending } = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/partner/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast("Partner Deleted"), setIsDialogOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast(error?.response.data.error || "Failed to delete partner.");
      setIsDialogOpen(false);
    },
  });

  const { mutate: updatePartner, isPending: updatePending } = useMutation({
    mutationFn: async (updatedData: PartnerFormData) => {
      const res = await axios.put(
        `/api/partner/${updatedData._id}`,
        updatedData
      );
      return res.data;
    },
    onSuccess: () => {
      toast("Profile Updated.");
    },
    onError: (error: any) => {
      toast(error?.response.data.error || "Failed to updated partner details.");
    },
  });

  const onSubmit = async (values: PartnerFormData) => {
    console.log("Submitting form with:", values);
    if (selectedPartner) {
      updatePartner(values);
    } else {
      partnerRegister(values);
    }
  };

  const handleAddArea = () => {
    form.setValue("areas", [...form.watch("areas"), ""]);
  };

  return (
    <div className="rounded-lg ring ring-violet-300 max-w-3xl w-full flex flex-col items-center mx-auto p-4 bg-violet-50">
      <span className="text-2xl font-bold tracking-tight text-violet-500 ">
        {formHeading}
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="bg-violet-100" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">InActive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("areas").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`areas.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area {index + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" onClick={handleAddArea} variant="outline">
            + Add Area
          </Button>

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="shift.start"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Shift Start</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shift.end"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Shift End</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex item-center justify-between">
            <Button isLoading={registerPending || updatePending} type="submit" disabled={registerPending || updatePending}>
              {registerPending || updatePending
                ? buttonText
                  ? "Updating..."
                  : "Submitting..."
                : buttonText
                ? buttonText
                : "Register"}
            </Button>

            {selectedPartner ? (
              <Dialog open={isDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    Do you really want to delete this partner ?
                  </DialogTitle>
                  <DialogFooter>
                    <Button isLoading={deletePending} loadingText="" variant={'destructive'} onClick={() => deletePartner(selectedPartner._id)}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PartnerForm;

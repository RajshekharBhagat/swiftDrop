"use client";
import { orderSchema } from "@/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { error } from "console";

type OrderFormDataType = z.infer<typeof orderSchema>;

const OrderForm = () => {
  const form = useForm<OrderFormDataType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer: {
        name: "",
        phone: "",
        address: "",
      },
      area: "",
      items: [
        {
          name: "",
          quantity: 1,
          price: 0,
        },
      ],
      status: "pending",
      scheduledFor: "",
      totalAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { mutate: createOrder } = useMutation({
    mutationFn: async (FormData: OrderFormDataType) => {
      const { data: response } = await axios.post<ApiResponse>(
        "/api/order",
        FormData
      );
      return response;
    },
    onSuccess: (response: ApiResponse) => {
      if(response.success) {
        toast(response.message);
        form.reset();
      }
      toast(response.message);
    },
    onError: (error: any) => {
      toast(error.message || 'Something went wrong');
    },
  });

  const onSubmit = async (values: OrderFormDataType) => {
    try {
      createOrder(values);
      console.log('Order Form Values: ', values)
    } catch (error) {
      console.log('Failed to create Order: ', error)
    }
  };

  const items = form.watch("items");
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Set the total amount in the form
  React.useEffect(() => {
    form.setValue("totalAmount", totalAmount);
  }, [totalAmount, form]);


  return (
    <div className="rounded-lg ring ring-violet-300 max-w-3xl w-full flex flex-col items-center mx-auto p-4 bg-violet-50">
      <span className="text-2xl font-bold tracking-tight text-violet-500 mb-2">
        Create Order Form
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <div className="border border-violet-300 rounded-lg p-3">
            <p className="text-sm text-violet-500 font-semibold mb-3">
              Customer Details
            </p>
            <FormField
              control={form.control}
              name="customer.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-violet-50"
                      placeholder="customer name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-violet-50"
                      placeholder="customer address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone no.</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-violet-50"
                      placeholder="customer phone no."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border border-violet-300 rounded-lg p-3 space-y-4">
            <p className="text-sm text-violet-500 font-semibold mb-3">
              Item Details
            </p>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-4 gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{index + 1} Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Quantity</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Priced</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant={"outline"}
                  className="text-red-500 min-w-5"
                  size={"sm"}
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant={"outline"}
              onClick={() => append({ name: "", price: 0, quantity: 0 })}
            >
              Add
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input placeholder="area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduledFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled For</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem className="flex item-center gap-2">
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input value={form.watch('totalAmount')} readOnly className="cursor-not-allowed bg-gray-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;

"use client";
import { Order } from "@/models/Order.model";
import React from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { DeliveryPartner } from "@/models/DeliveryPartner.model";

interface AssignButtonProps {
  order:Order & {assignedTo: DeliveryPartner};
}

const AssignButton = ({ order}: AssignButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate: assign, isPending } = useMutation({
    mutationFn: async () => {
      const { data: response } = await axios.post<ApiResponse>(
        `/api/order/${order._id}/assign`
      );
      return response;
    },
    onSuccess: (response: ApiResponse) => {
        if(response.success) {
            toast(response.message);
            queryClient.invalidateQueries({queryKey:['orders']})
        } else {
            toast(response.message)
        }
    },
    onError: (error: any) => {
        const message = error.response.data.message || error.message || 'Something went wrong.'
      toast(message);
    },
  });

  if(order.assignedTo) {
    return (
      <div className="flex flex-col items-start">
        <h1 className="text-sm md:text-lg text-gray-700 font-semibold">Delivery Partner Details:</h1>
        <h1 className="text-sm md:text-lg text-gray-700">{order.assignedTo.name}</h1>
        <p className="text-xs md:text-sm text-gray-700">{order.assignedTo.phone}</p>
      </div>
    )
  }
  if(order.status === 'cancelled') {
    return <div></div>
  }
  return <Button variant={'outline'} onClick={() => assign()}>Assign Partner</Button>;
};

export default AssignButton;

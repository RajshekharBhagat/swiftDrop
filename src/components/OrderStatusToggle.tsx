import { Order } from "@/models/Order.model";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderStatusToggleType } from "@/validators/orderStatusToggleValidator";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface OrderStatusToggleProps {
  order: Order;
}
const OrderStatusToggle = ({ order }: OrderStatusToggleProps) => {
  const router = useRouter()
  const queryClient = useQueryClient();
  const {mutate: orderStatusChange, isPending} = useMutation({
    mutationFn: async (payload: OrderStatusToggleType) => {
      const {data: response} = await axios.put<ApiResponse>(`/api/order/${order._id}/status`,payload);
      return response
    },
    onSuccess: (response: ApiResponse) => {
      if(response.success) {
        toast(response.message);
        queryClient.invalidateQueries({queryKey: ['orders']})
        router.refresh();
      } else {
        toast(response.message);
      }
    },
    onError: (error: any) => {
      toast(error.message || 'Something went wrong. Please try again....')
    }
  });

  const handleChange = (newStatus:"pending" | "assigned" | "picked" | "delivered") => {
    orderStatusChange({status:newStatus})
  }

  return (
    <Select value={order.status} onValueChange={handleChange} disabled={isPending || order.status === 'delivered' || order.status === 'cancelled'}>
      <SelectTrigger className={cn(order.status === 'cancelled' ? 'text-red-500': order.status === 'delivered' ? 'text-green-500' : null,'bg-violet-200')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="assigned">Assigned</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default OrderStatusToggle;

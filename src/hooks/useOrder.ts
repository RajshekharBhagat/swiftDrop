import { DeliveryPartner } from "@/models/DeliveryPartner.model";
import { Order } from "@/models/Order.model";
import { ApiResponse } from "@/types/ApiResponse";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useOrder = () => {
    return useQuery<Order[]>({
        queryKey: ['orders'],
        queryFn: async() => {
            const response = await axios.get<ApiResponse>('/api/order');
            return response.data.data;
        },
        staleTime: 0,
        refetchOnMount: true,
    })
}
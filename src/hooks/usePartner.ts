import { DeliveryPartner } from "@/models/DeliveryPartner.model";
import { ApiResponse } from "@/types/ApiResponse";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const usePartners = () => {
    return useQuery<DeliveryPartner[]>({
        queryKey: ['partners'],
        queryFn: async() => {
            const res = await axios.get<ApiResponse>('/api/partner');
            return res.data.data;
        }
    })
}
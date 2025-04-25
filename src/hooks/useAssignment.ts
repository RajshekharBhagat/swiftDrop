import { Assignment } from "@/models/Assignment.model";
import { DeliveryPartner } from "@/models/DeliveryPartner.model";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useAssignment = () => {
    return useQuery<Assignment[]>({
        queryKey: ['assignment'],
        queryFn: async () => {
            const response = await axios.get('/api/assignment');
            return response.data.data;
        }
    })
}
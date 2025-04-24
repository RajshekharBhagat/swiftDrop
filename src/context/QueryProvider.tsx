'use client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactNode } from "react";

interface QueryProviderType {
    children: ReactNode;
}

const QueryProvider = ({children}: QueryProviderType) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}

export default QueryProvider;
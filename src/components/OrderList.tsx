"use client";
import { useOrder } from "@/hooks/useOrder";
import { cn } from "@/lib/utils";
import { Divide, HomeIcon, Loader, PlusCircleIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import OrderStatusToggle from "./OrderStatusToggle";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AssignButton from "./AssignButton";
import { Order } from "@/models/Order.model";
import { DeliveryPartner } from "@/models/DeliveryPartner.model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";

const OrderList = () => {
  const { data: orderList, isLoading } = useOrder();

  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredOrders = useMemo(() => {
    return orderList?.filter((order) => {
      const statusMatch = statusFilter === 'all' ? true : order.status === statusFilter;
      const areaMatch = areaFilter ? order.area.includes(areaFilter) : true;
      const dateMatch = dateFilter
        ? new Date(order.createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        : true;
      return statusMatch && areaMatch && dateMatch;
    });
  }, [orderList, statusFilter, areaFilter, dateFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:min-h-screen min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="size-20 animate-spin text-violet-300" />
          <span className="text-lg text-gray-500 font-semibold">Loading</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex flex-wrap gap-4 p-4 border-b border-gray-200">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          className="w-[200px]"
          placeholder="Filter by Area"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
        />

        <Input
          type="date"
          className="w-[180px]"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      <div className="max-w-6xl mx-auto w-full space-y-4 mt-10 px-4">
        {filteredOrders?.map((order) => (
          <div
            key={order._id}
            className="bg-violet-300 p-4 rounded-lg shadow-md "
          >
            <div className="grid grid-cols-1 md:grid-cols-3 space-y-4 md:space-y-0">
              <div className="flex flex-col gap-1.5">
                <h1 className="md:text-lg text-sm text-violet-700 font-bold">
                  {order.customer.name}
                </h1>
                <p className="md:text-sm text-xs text-zinc-700">
                  {order.customer.address}
                </p>
                <p className="md:text-sm text-xs text-zinc-700">
                  {order.customer.phone}
                </p>
              </div>
              <div className="flex flex-col item-start gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold hidden md:inline">
                    Status
                  </span>
                  <OrderStatusToggle order={order} />
                </div>
                <span className="text-sm font-semibold flex gap-1.5">
                  Area: <p>{order.area}</p>
                </span>
                <span className="text-sm font-semibold flex gap-1.5">
                  Date: <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </span>
              </div>
              <div className="flex flex-col items-start">
                <div>
                  <AssignButton
                    order={order as Order & { assignedTo: DeliveryPartner }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;

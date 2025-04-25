"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useAssignment } from "@/hooks/useAssignment";
import { Loader2, MoveLeftIcon, OctagonAlert } from "lucide-react";
import { DeliveryPartner } from "@/models/DeliveryPartner.model";
import { cn } from "@/lib/utils";
import { Order } from "@/models/Order.model";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

const AssignmentTable = () => {
  const { data: assignments, isLoading } = useAssignment();
  if (isLoading) {
    return (
      <div className="flex flex-col md:min-h-screen min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="size-20 animate-spin text-violet-300" />
          <span className="text-lg text-gray-500 font-semibold">Loading</span>
        </div>
      </div>
    );
  }
  if (!assignments || assignments.length === 0) {
    return (
      <div className="flex flex-col md:min-h-screen min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center">
          <OctagonAlert className="size-20 animate-bounce text-violet-300" />
          <span className="text-lg text-gray-500 font-semibold">
            No Deliver Partners found.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Table className="bg-violet-300 rounded-sm">
        <TableCaption>Assignment History</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-violet-600">
              Order Id
            </TableHead>
            <TableHead className="font-bold text-violet-600">
              Partner Name
            </TableHead>
            <TableHead className="font-bold text-violet-600">Status</TableHead>
            <TableHead className="font-bold text-violet-600">Time</TableHead>
            <TableHead className="font-bold text-violet-600">
              Total Amount
            </TableHead>
            <TableHead className="font-bold text-violet-600">
              Failure Reason
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments?.map((assignment) => {
            const partner = assignment.partnerId as DeliveryPartner;
            const order = assignment.orderId as Order;
            if (!order?._id) return;
            console.log(order);
            return (
              <TableRow key={assignment._id}>
                <TableCell>{order._id.toString()}</TableCell>
                <TableCell>{partner?.name ? partner?.name : "NA"}</TableCell>
                <TableCell
                  className={cn(
                    "font-semibold",
                    assignment.status === "failed"
                      ? "text-red-500"
                      : "text-green-500"
                  )}
                >
                  {assignment.status}
                </TableCell>
                <TableCell>
                  {new Date(assignment.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell>
                  {assignment.reason ? assignment.reason : "NA"}{" "}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignmentTable;

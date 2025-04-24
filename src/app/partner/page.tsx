"use client";
import PartnerForm from "@/components/PartnerForm";
import PartnerList from "@/components/PartnerList";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePartners } from "@/hooks/usePartner";
import {
  CircleXIcon,
  CrossIcon,
  DoorClosedIcon,
  HomeIcon,
  PlusCircleIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState<boolean>(false);
  const { data: partnerList, isPending } = usePartners();
  const activePartners = partnerList?.filter(
    (partner) => partner.status === "active"
  );
  const activePartnersCount = activePartners?.length || 0;

  const handleFormSuccess = () => {
    setIsPartnerFormOpen(false);
  };
  return (
    <div className="flex flex-col items-center">
      <div className="w-full items-center gap-2 flex justify-between p-3">
        <span className="flex items-center justify-center text-violet-900 font-bold tracking-tighter text-2xl md:text-3xl xl:text-6xl">
          <span className="font-extrabold text-violet-500">S</span>wift
          <span className="font-extrabold text-violet-500">D</span>rop
        </span>
        <div className="flex items-center gap-4">
          <Link
            className="text-sm flex items-center gap-1.5 bg-white rounded-full p-1.5 font-semibold text-gray-500"
            href={"/"}
          >
            <HomeIcon className="text-violet-500 size-6 md:size-4" />
            <h1 className="hidden md:inline">Home</h1>
          </Link>
          <div className="text-sm flex items-center gap-1.5 bg-white rounded-full p-1.5 font-semibold text-gray-500">
            <User className="text-violet-500 size-6 md:size-4" />
            <span className="hidden md:inline">Active Users</span> {activePartnersCount}
          </div>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setIsPartnerFormOpen(!isPartnerFormOpen)}
            className="p-1.5 flex items-center gap-2 bg-white rounded-full"
          >
            {isPartnerFormOpen ? (
              <CircleXIcon className="text-violet-500 size-6 md:size-4" />
            ) : (
              <PlusCircleIcon className="text-violet-500 size-6 md:size-4" />
            )}

            <span className="text-gray-500 text-sm hidden md:inline">
              {isPartnerFormOpen ? "Close" : "Create Partner"}
            </span>
          </Button>
        </div>
      </div>
      {isPartnerFormOpen ? (
        <PartnerForm
          formHeading="Partner Registration Form"
          onCancel={() => setIsPartnerFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <PartnerList />
      )}
    </div>
  );
};

export default page;

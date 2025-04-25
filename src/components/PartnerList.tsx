"use client";
import { usePartners } from "@/hooks/usePartner";
import { cn } from "@/lib/utils";
import { Loader, OctagonAlert, Pencil } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import PartnerForm from "./PartnerForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

const PartnerList = () => {
  const { data: partners, isLoading, error } = usePartners();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null
  );
  if (error) {
    return notFound();
  }
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
  if (!partners || partners.length === 0) {
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
    <div className="max-w-6xl mx-auto w-full space-y-4 mt-10 px-4">
      {partners.map((partner) => {
        const isOpen = selectedPartnerId === partner._id;
        return (
          <div
            key={partner._id}
            className=" p-4 bg-violet-300 rounded-lg shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 space-y-3">
              <div>
                <p className="md:text-lg text-sm font-bold">{partner.name}</p>
                <p className="md:text-sm text-xs text-zinc-700">
                  {partner.email}
                </p>
                <p className="md:text-sm text-xs text-zinc-700">
                  {partner.phone}
                </p>
              </div>
              <div className="flex flex-col space-y-3 justify-center">
                <span className="flex items-center gap-2 md:text-md text-xs font-semibold">
                  Shift:{" "}
                  <p>
                    {partner.shift.start} to {partner.shift.end}
                  </p>
                </span>
                <span className="flex gap-1.5 md:text-md text-xs font-semibold">
                  Areas:
                  {partner.areas.map((area, index) => (
                    <p key={index}>
                      {area}
                      {index !== partner.areas.length ? "," : "."}
                    </p>
                  ))}
                </span>
                <span className="flex items-center gap-2 md:text-md text-xs font-semibold">
                  Current Load: {partner.currentLoad}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-xs md:text-lg font-semibold">
                  Status:{" "}
                  <p
                    className={cn(
                      "",
                      partner.status === "inactive"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {partner.status === "inactive" ? "InActive" : "Active"}
                  </p>
                </span>
                <Dialog
                  open={isOpen}
                  onOpenChange={(open) =>
                    setSelectedPartnerId(open ? partner._id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      className="rounded-full"
                      onClick={() => setSelectedPartnerId(partner._id)}
                    >
                      <Pencil className="text-white" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md p-5 max-h-[90vh] overflow-y-auto">
                    <DialogTitle></DialogTitle>
                    <PartnerForm
                      formHeading="Partner Profile"
                      onSuccess={() => setSelectedPartnerId(null)}
                      selectedPartner={partner}
                      buttonText="Update"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PartnerList;

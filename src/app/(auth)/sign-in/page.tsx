"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signinSchema } from "@/schema/sign-in.schema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LucideEye, LucideEyeOff } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isHide, setIsHide] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });
    if (result?.error) {
      setIsLoading(false);
      toast(result.error);
    }
    if (result?.url) {
      setIsLoading(false);
      router.replace("/");
    }
  };

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col items-center md:justify-center md:mt-0 mt-20 md:px-2.5 px-6">
      <div className="max-w-md w-full bg-violet-100 rounded-lg mx-auto ring ring-violet-200">
        <span className="flex items-center justify-center text-violet-900 font-bold tracking-tighter text-2xl md:text-3xl xl:text-4xl">
          <span className="font-extrabold text-violet-500">S</span>wift
          <span className="font-extrabold text-violet-500">D</span>rop
        </span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 px-6 py-2.5"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="email"
                      className="bg-violet-50 placeholder:font-semibold placeholder:text-zinc-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2.5">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        type={isHide ? "password" : "text"}
                        placeholder="Password"
                        className="bg-violet-50 placeholder:font-semibold placeholder:text-zinc-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div
                onClick={() => setIsHide(!isHide)}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    class: isHide ? "bg-primary/10 hover:bg-primary/10" : null,
                  })
                )}
              >
                {isHide ? (
                  <LucideEyeOff className="w-4 h-4 text-violet-500" />
                ) : (
                  <LucideEye className="w-4 h-4 text-violet-500" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="flex-1  bg-violet-400 text-black hover:bg-violet-500"
                type="submit"
              >
                Login
              </Button>
              <Link
                href={"/sign-up"}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    class: "text-center flex-1 inline-block truncate",
                  })
                )}
              >
                Create Account
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;

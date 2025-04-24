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
import { SignUpSchema } from "@/schema/sign-up.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from 'axios';
import { LucideEye, LucideEyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const Page = () => {
  const [isHide, setIsHide] = useState<boolean>(true);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {mutate: signup} = useMutation({
    mutationFn: async(FormData: z.infer<typeof SignUpSchema>) => {
      const {email,password} = FormData
      const payload: z.infer<typeof SignUpSchema> = {
        email,
        password,
      }
      const { data } = await axios.post('/api/auth/sign-up',payload);
      return data;
    },
    onSuccess: () => {
      toast('Account Created')
      router.push('/sign-in')
    },
    onError: (error: AxiosError) => {
      console.log('Error Creating Account: ', error);
      if(error.response) {
        const {data, status} = error.response as {data:ApiResponse, status: number}
        if(status === 409) {
          return toast('Conflict Error',{
            description: data.message,
          })
        }
        if(status === 422) {
          return toast('Invalid Input')
        }
      }
      toast('Something went wrong.',{
        description: error.message,
      })
    }
  })


  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    console.log(data)
    const {email,password} = data
    signup({email,password})
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
                Create Account
              </Button>
              <Link
                href={'/sign-in'}
                className={cn(buttonVariants({variant: 'outline', class: 'text-center flex-1 inline-block truncate'}))}
              >
               Go to Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;

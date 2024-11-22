"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, register } from "@/actions/auth";
import { authenticationFormSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const AuthenticationForm = () => {
  const [formType, setFormType] = useState<"login" | "register">("login");

  const form = useForm<z.infer<typeof authenticationFormSchema>>({
    resolver: zodResolver(authenticationFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [formType, form]);

  const onSubmit = async (values: z.infer<typeof authenticationFormSchema>) => {
    if (formType === "login") {
      const res = await login(values);
      toast(res.message);
    } else if (formType === "register") {
      const res = await register(values);
      toast(res.message);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="h-max w-[300px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-md border border-border p-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your_username" {...field} />
                  </FormControl>
                  <FormDescription>Please enter your username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="**********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Please enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {formType === "login"
                ? "Login"
                : formType === "register"
                  ? "Register"
                  : null}
            </Button>
            {formType === "login" ? (
              <p className="text-sm">
                Don&apos;t have an account?{" "}
                <span
                  className="cursor-pointer underline"
                  onClick={() => setFormType("register")}
                >
                  Register
                </span>
              </p>
            ) : (
              <p className="text-sm">
                Already have an account?{" "}
                <span
                  className="cursor-pointer underline"
                  onClick={() => setFormType("login")}
                >
                  Login
                </span>
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import InputError from "@/components/InputError";
import { RegisterErrorType } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const FormSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(50),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.",
      }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const Register = () => {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [errors, setErrors] = useState<RegisterErrorType>({});

  const submitForm = (
    event: { preventDefault: () => void },
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    event.preventDefault();

    register({
      name,
      email,
      password,
      password_confirmation,
      setErrors,
    });
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof FormSchema>, event: any) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //   setName(values.name)
    //   setEmail(values.email)
    //   setPassword(values.password)
    //   setPasswordConfirmation(values.password_confirmation)
    submitForm(
      event,
      values.name,
      values.email,
      values.password,
      values.password_confirmation
    );
    console.log(
      values.name,
      values.email,
      values.password,
      values.password_confirmation
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[400px]">
        <Card className="dark">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Enter your email below to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-gray-100">Username</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent text-gray-100"
                          placeholder=""
                          {...field}
                          // onChange={event => setName(event.target.value)}
                          // value={name}
                        />
                      </FormControl>
                      <FormMessage />
                      <InputError messages={errors.name} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-gray-100">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="bg-transparent text-gray-100"
                          placeholder=""
                          {...field}
                          // value={email}
                          // onChange={event => setEmail(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                      <InputError messages={errors.email} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-gray-100">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-transparent text-gray-100"
                          placeholder=""
                          {...field}
                          // value={password}
                          // onChange={event => setPassword(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                      <InputError messages={errors.password} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-gray-100">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-transparent text-gray-100"
                          placeholder=""
                          {...field}
                          // value={passwordConfirmation}
                          // onChange={event => setPasswordConfirmation(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;

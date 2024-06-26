'use client'

import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { LoginErrorType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthSessionStatus from "../AuthSessionStatus";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email({message: 'Invalid email address'}),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Vous êtes pas respectable avec ce mot de passe foireux'
  }),
  remember: z.boolean().default(false).optional(),
});

const Login = () => {
  const router = useRouter()
  
  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard'
  });

  const [errors, setErrors] = useState<LoginErrorType>({})
  const [status, setStatus] = useState<string | null>(null)
  const [shouldRemember, setShouldRemember] = useState(false)

  useEffect(() => {
    if (router.reset?.length > 0 && Object.keys(errors).length === 0) {
      setStatus(atob(router.reset))
    } else {
      setStatus(null)
    }
  
  })
  
  // console.log(Object.keys(errors).length === 0);
  
  const submitForm = async (
    event: { preventDefault: () => void },
    email: string,
    password: string,
    remember: boolean
  ) => {
    event.preventDefault();

    login({email, password, remember, setErrors, setStatus});
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>, event: any) {
    console.log(event, values.email, values.password, shouldRemember);
    
    submitForm(
      event,
      values.email,
      values.password,
      shouldRemember
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[400px]">
        <Card className="dark">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to log into your account</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthSessionStatus className={'mb-4'} status={status} />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-100">Email</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-transparent text-gray-100"
                          placeholder="email@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                      <InputError messages={errors.email} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-100">Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          className="bg-transparent text-gray-100"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                      <InputError messages={errors.password} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2 my-8 cursor-pointer">
                          <Checkbox id="remember" onCheckedChange={(event: boolean) =>
                                setShouldRemember(event)}/>
                          <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Remember me
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage/>
                      <InputError messages={errors.password} />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div>
              <Link
                  href="/forgot-password"
                  className="underline text-sm text-gray-600 hover:text-gray-900">
                  Forgot your password?
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
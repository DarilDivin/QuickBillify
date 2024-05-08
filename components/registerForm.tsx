'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormEventHandler, useState } from "react"
import { useAuth } from "@/hooks/auth"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: 'Username must be at least 2 characters.'
    }).max(50),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long."
    }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match", 
});

interface RegisterProps {
    handleSubmit?: FormEventHandler<HTMLFormElement> | undefined;
}

const RegisterForm = ({ handleSubmit }: RegisterProps) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const submitForm = event => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    })
   
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof FormSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      submitForm
      console.log(values)
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-gray-100">Username</FormLabel>
                  <FormControl>
                    <Input 
                        className="bg-transparent text-gray-100" 
                        placeholder="shadcn" {...field} 
                        onChange={event => setName(event.target.value)}
                        value={name}
                    />
                  </FormControl>
                  <FormMessage />
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
                        placeholder="shadcn" {...field}
                        value={email}
                        onChange={event => setEmail(event.target.value)} 
                    />
                  </FormControl>
                  <FormMessage />
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
                        placeholder="" {...field} 
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-gray-100">Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                        type="password" 
                        className="bg-transparent text-gray-100" 
                        placeholder="" {...field} 
                        value={passwordConfirmation}
                        onChange={event => setPasswordConfirmation(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
    )
}


export default RegisterForm
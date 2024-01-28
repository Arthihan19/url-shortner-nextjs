"use client";

import React from "react";

import {Icons} from "@/components/icons"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {signIn} from "next-auth/react";
import {toast} from "@/components/ui/use-toast";
import * as z from "zod"

const formSchema = z.object({
    email: z.string().email().min(1),
})

export function AuthCard() {
    const [isSigningIn, setIsSigningIn] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [loading, setLoading] = React.useState(false);

    async function SignInWithEmail() {
        const result = formSchema.safeParse({email})
        if (!result.success) {
            return toast({
                title: "Invalid email",
                description: "Please check you have entered the correct email",
                variant: "destructive",
            });
        }

        setLoading(true);
        const signInResult = await signIn("email", {
            email: email,
            callbackUrl: `${window.location.origin}`,
            redirect: false,
        });

        setLoading(false);
        if (!signInResult?.ok) {
            return toast({
                title: "Well this did not work...",
                description: "Something went wrong, please try again",
                variant: "destructive",
            });
        }

        return toast({
            title: "Check your email",
            description: "A magic link has been sent to you",
        });
    }

    const onEmailChange = (newEmailValue: string) => {
        setEmail(newEmailValue);
    }

    return (
        <Card className="w-full md:w-7/12">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">{isSigningIn ? "Login to an account" : "Create an account"}</CardTitle>
                <CardDescription>
                    Enter your email below to {isSigningIn ? "login to your account" : "create your account"}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com"
                           onChange={(e) => onEmailChange(e.target.value)}/>
                </div>
                <div className="flex justify-center content-center flex-col w-full text-center items-center">
                    <Button className="w-full" onClick={SignInWithEmail} disabled={loading}>
                        {loading ? <Icons.spinner className="animate-spin"/> : isSigningIn ? "Login" : "Create account"}
                    </Button>
                    <span className="mt-4 underline text-foreground/60 hover:text-foreground cursor-default w-fit"
                          onClick={() => !loading && setIsSigningIn(!isSigningIn)}>{!isSigningIn ? "Login instead" : "Create an account instead"}</span>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex justify-center content-center flex-col w-full text-center">
                    <div className="relative mb-3">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() =>
                        signIn("github", {
                            callbackUrl: `${window.location.origin}`,
                        })
                    }>
                        {loading ? <Icons.spinner className="animate-spin"/> : <><Icons.gitHub
                            className="mr-2 h-4 w-4"/>
                            GitHub</>}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

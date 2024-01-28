"use client"

import {FormProvider, useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import React, {useEffect} from "react";
import {toast} from "@/components/ui/use-toast";
import {Icons} from "@/components/icons";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

const formSchema = z.object({
    longUrl: z.string().url().max(250),
    customName: z.string()
        .min(4)
        .max(12)
        .optional()
        .or(z.literal('')),
    length: z.number().int().min(4).max(12).optional(),
})

export default function Create() {
    const {status, data: session} = useSession();

    const [loading, setLoading] = React.useState(false);
    const [shortUrl, setShortUrl] = React.useState("")
    const [error, setError] = React.useState("")

    useEffect(() => {
        if (status !== "loading" && !session) {
            redirect("/auth");
        }
    }, [session]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            longUrl: "",
            customName: "",
            length: 4,
        },
    })

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied to Clipboard",
                description: "Short URL has been copied to your clipboard.",
            });
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        setError("");
        setShortUrl("");
        setLoading(true);
        const requestData = {
            longUrl: values.longUrl,
            customName: values.customName || undefined,
            length: values.length || undefined,
        };

        fetch('/api/shorturl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setLoading(false);

                    return;
                }

                setShortUrl(window.location.origin + "/shorturl/" + data.id);
                setLoading(false);
                form.reset();
            })
            .catch((error) => {
                setLoading(false);

                return toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            });
    }


    function prependHttp(url: string) {
        if (!/^https?:\/\//i.test(url)) {
            return `http://${url}`;
        }
        return url;
    }

    function handleLongUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
        const updatedUrl = prependHttp(event.target.value);
        form.setValue('longUrl', updatedUrl, {shouldValidate: true});
    }

    return (
        <Card className="py-2 w-full md:w-7/12">
            <CardHeader>
                <CardTitle className="text-2xl">Create a short url</CardTitle>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="flex justify-center items-center flex-col w-full">
                    <FormProvider {...form}>
                        <FormField
                            control={form.control}
                            name="longUrl"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Long url</FormLabel>
                                    <FormControl>
                                        <Input placeholder="www.google.com" {...field} onChange={handleLongUrlChange}/>
                                    </FormControl>
                                    <FormDescription>
                                        This is the long url you want to shorten
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customName"
                            render={({field}) => (
                                <FormItem className="mt-5 w-full">
                                    <FormLabel>Custom name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="myshorturl" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a custom name (*optional)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center mt-5 lg:w-1/2 w-full sm:flex-row flex-col">
                            <FormField
                                control={form.control}
                                name="customName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Size</FormLabel>
                                        <FormControl>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="4" {...field}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="4">4</SelectItem>
                                                        <SelectItem value="8">8</SelectItem>
                                                        <SelectItem value="12">12</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Provide a short url id size
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {loading || status === "loading" ? <Icons.spinner className="animate-spin"/> :
                                <Button type="submit" className="sm:mt-0 mt-5">Create</Button>}
                        </div>
                    </FormProvider>
                </CardContent>
                <CardFooter className="flex justify-center items-center">
                    {
                        error !== "" &&
                        <div className="mt-4 p-4 bg-red-50 rounded-lg">
                            <p className="text-center text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    }
                    {
                        shortUrl !== "" &&
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                             onClick={() => copyToClipboard(shortUrl)}>
                            <p className="text-center text-sm text-gray-700">
                                Click to copy short URL
                            </p>
                            <p className="text-center text-md font-medium">
                                {shortUrl}
                            </p>
                        </div>
                    }
                </CardFooter>
            </form>
        </Card>
    );
}

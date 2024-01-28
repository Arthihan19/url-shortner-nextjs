"use client";

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {Label} from "@/components/ui/label";
import {Icons} from "@/components/icons";

interface Props {
    params: { id: string };
}

export default function ShortUrlRedirectPage({params}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [longUrl, setLongUrl] = useState("");

    useEffect(() => {
        fetch(`/api/shorturl/${params.id.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(response => response.json())
            .then((data: any) => {
                setLongUrl(data.longUrl);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);

                return toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            });
    }, []);

    const handleRedirect = () => {
        if (longUrl) {
            window.open(longUrl, "_blank", "noopener");
        }
    };

    return (
        <>
            {loading ? <Icons.spinner className="animate-spin h-10 w-10" /> :
                (
                    <>
                        {longUrl ?
                            <div className="flex flex-col items-center justify-center p-4">
                                <Label className="mb-2 text-xl font-bold">You are about to be redirected to:</Label>
                                <div className="mb-4 bg-gray-100 px-4 py-3 border-2 rounded-xl max-w-md w-full break-words">
                                    <span className="text-blue-600 text-lg">{longUrl}</span>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={handleRedirect}>Redirect</Button>
                                    <Button onClick={() => router.push("/")} variant="destructive">Cancel</Button>
                                </div>
                            </div>
                            :
                            <Label className="text-xl font-bold">Short url not found...</Label>
                        }
                    </>
                )
            }
        </>
    );
}
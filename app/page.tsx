"use client"

import {useSession} from "next-auth/react";
import React, {useEffect} from "react";
import {redirect} from "next/navigation";
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {format} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";

export default function Home() {
    const {status, data: session} = useSession();

    const [shortUrls, setShortUrls] = React.useState<any>([])
    const [page, setPage] = React.useState(1)
    const [loadingFirstTime, setLoadingFirstTime] = React.useState(true)
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (status !== "loading" && !session) {
            redirect("/auth");
        }
    }, [session]);

    useEffect(() => {
        setLoading(true)
        fetch(`/api/shorturl?page=${page}&limit=${10}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data: any) => {
                setShortUrls([...data.shortUrls]);
                setLoading(false);
                setLoadingFirstTime(false);
            })
            .catch((error) => {
                setLoading(false);
                setLoadingFirstTime(false);

                return toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            });
    }, []);

    const loadMore = () => {
        setLoading(true);
        fetch(`/api/shorturl?page=${page + 1}&limit=${10}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data: any) => {
                setShortUrls([...shortUrls, ...data.shortUrls]);
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
        setPage(page + 1);
    }

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'PPP');
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied to Clipboard",
                description: "URL has been copied to your clipboard.",
            });
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this URL?")) {
            return;
        }

        fetch(`/api/shorturl/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data: any) => {
                if (data.error) {
                    return toast({
                        title: "Error",
                        description: data.error,
                        variant: "destructive",
                    });
                }

                setShortUrls(shortUrls.filter((url: any) => url.id !== id));
                toast({
                    title: "Deleted",
                    description: "Short URL has been successfully deleted.",
                });
            })
            .catch((error) => {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            });
    };

    function renderShortUrls() {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {shortUrls.map((url: any) => (
                    <Card key={url.id} className="mb-4 w-full bg-white shadow-md rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">{formatDate(url.createdAt)}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <Label
                                className="cursor-pointer p-2 bg-gray-100 border border-gray-300 rounded mb-2 hover:bg-gray-200 truncate"
                                onClick={() => copyToClipboard(url.longUrl)} >
                                Long URL: <span className="break-all">{url.longUrl}</span>
                            </Label>
                            <Label
                                className="cursor-pointer p-2 bg-gray-100 border border-gray-300 rounded mb-4 hover:bg-gray-200 truncate"
                                onClick={() => copyToClipboard(window.location.origin + '/shorturl/' + url.id)}>
                                Short URL: <span className="break-all">{window.location.origin + '/shorturl/' + url.id}</span>
                            </Label>
                            <div className="flex justify-end">
                                <Button onClick={() => handleDelete(url.id)} variant="destructive">Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-start items-center w-full px-4 py-2">
            <h1 className="text-2xl font-medium mb-4">Created short urls</h1>
            {loadingFirstTime ? <Icons.spinner className="animate-spin w-10 h-10"/> : (
                <>
                    {shortUrls.length > 0 ? renderShortUrls() : <span>No short urls created yet.</span>}
                    <div className="mt-4">
                        {loading ? <Icons.spinner className="animate-spin"/> :
                            <Button onClick={loadMore}>Load more</Button>}
                    </div>
                </>
            )}
        </div>
    );
}
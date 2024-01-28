"use client"

import * as React from "react"
import Link, {LinkProps} from "next/link"
import {useRouter} from "next/navigation"
import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import LoginButton from "@/app/components/LoginButton";
import LogoutButton from "@/app/components/LogoutButton";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";

interface Props {
}

export function MobileNav(props:Props) {
    const { status, data: session } = useSession();
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden w-full justify-between items-center"
                >
                    <Link href="/" className="flex items-center space-x-2">
                        <Icons.logo className="h-6 w-6"/>
                        <span className="font-bold text-lg">ShortURL</span>
                    </Link>
                    <svg
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                    >
                        <path
                            d="M3 5H11"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                        <path
                            d="M3 12H16"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                        <path
                            d="M3 19H21"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
                <MobileLink
                    href="/"
                    className="flex items-center"
                    onOpenChange={setOpen}
                >
                    <Icons.logo className="mr-2 h-4 w-4"/>
                    <span className="font-bold">ShortURL</span>
                </MobileLink>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                    <div className="flex flex-col space-y-3">
                        {["/", "/create"].map(
                            (path, index) =>
                                <MobileLink
                                    key={index}
                                    href={path}
                                    onOpenChange={setOpen}
                                >
                                    {path === "/create" ? "Create" : "Dashboard"}
                                </MobileLink>
                        )}
                        {status === "loading" ? <Icons.spinner className="animate-spin"/> : session ? <LogoutButton/> : <LoginButton/>}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

function MobileLink({
                        href,
                        onOpenChange,
                        className,
                        children,
                        ...props
                    }: MobileLinkProps) {
    const router = useRouter()
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    )
}

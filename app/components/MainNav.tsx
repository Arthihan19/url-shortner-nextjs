"use client"

import Link from "next/link"
import {redirect, usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Session} from "next-auth";
import LogoutButton from "@/app/components/LogoutButton";
import LoginButton from "@/app/components/LoginButton";
import {useSession} from "next-auth/react";
import * as React from "react";

interface Props {
}

export function MainNav(props: Props) {
    const { status, data: session } = useSession();
    const pathname = usePathname();

    const isPathActive = (path: string) => {
        if (path === "/" && pathname === "/") {
            return true;
        }

        return pathname.startsWith(path) && path !== "/";
    };

    return (
        <div className="mr-4 hidden md:flex w-full justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
                <Icons.logo className="h-6 w-6"/>
                <span className="font-bold text-lg">ShortURL</span>
            </Link>
            <nav className="flex items-center gap-6 text-base mr">
                {["/", "/create"].map((path, index) => (
                    <Link
                        key={index}
                        href={path}
                        className={cn(
                            "transition-colors px-2 py-1 rounded hover:bg-gray-100",
                            isPathActive(path)
                                ? "font-semibold text-foreground"
                                : "text-foreground/60 hover:text-foreground"
                        )}
                    >
                        {path === "/create" ? "Create" : "Dashboard"}
                    </Link>
                ))}
                {status === "loading" ? <Icons.spinner className="animate-spin"/> : session ? <LogoutButton/> : <LoginButton/>}
            </nav>
        </div>
    );
}


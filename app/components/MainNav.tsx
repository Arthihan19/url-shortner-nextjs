"use client"

import * as React from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button";

export function MainNav() {
    const pathname = usePathname();

    return (
        <div className="mr-4 hidden md:flex w-full justify-between items-center">
            <Link href="/public" className="flex items-center space-x-2">
                <Icons.logo className="h-6 w-6"/>
                <span className="font-bold text-lg">ShortURL</span>
            </Link>
            <nav className="flex items-center gap-6 text-base mr">
                {["/dashboard", "/create"].map((path, index) => (
                    <Link
                        key={index}
                        href={path}
                        className={cn(
                            "transition-colors px-2 py-1 rounded hover:bg-gray-100",
                            pathname === path || pathname?.startsWith(path)
                                ? "font-semibold text-foreground"
                                : "text-foreground/60 hover:text-foreground"
                        )}
                    >
                        {path === "/create" ? "Create" : "Dashboard"}
                    </Link>
                ))}
                <Button className="ml-10">Login</Button>
            </nav>
        </div>
    );
}

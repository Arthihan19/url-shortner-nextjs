import {MainNav} from "@/app/components/MainNav";
import {MobileNav} from "@/app/components/MobileNav";
import authOptions from "@/app/auth/authOptions";
import {getServerSession} from "next-auth";

export async function SiteHeader() {
    const session = await getServerSession(authOptions);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <MainNav session={session}/>
                <MobileNav session={session}/>
            </div>
        </header>
    )
}

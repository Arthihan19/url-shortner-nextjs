import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function LoginButton() {
    return (
        <Button className="w-1/4" asChild><Link href="/auth">Login</Link></Button>
    );
}

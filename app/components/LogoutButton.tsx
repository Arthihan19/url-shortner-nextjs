import {Button} from "@/components/ui/button";
import {signOut} from "next-auth/react";

export default function LogoutButton() {
    return (
        <Button variant="outline" className="w-1/4" onClick={() =>
            signOut({
                callbackUrl: `${window.location.origin}/auth`,
            })
        }>Logout</Button>
    );
}

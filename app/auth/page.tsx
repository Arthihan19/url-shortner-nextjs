"use client";

import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";
import {Icons} from "@/components/icons";
import * as React from "react";

export default function Auth() {
    return (
        // zod
        // react form
        // email
        // Sign in with github
        <Button
            onClick={() =>
                signIn("github", {
                    callbackUrl: `${window.location.origin}`,
                })
            }
            className="mt-6"
            variant="secondary"
        >
            Login with Github <Icons.gitHub className="h-6 w-6"/>
        </Button>
    );
}

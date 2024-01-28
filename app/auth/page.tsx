import * as React from "react";
import {AuthCard} from "@/app/auth/AuthCard";
import {getServerSession} from "next-auth";
import authOptions from "@/app/auth/authOptions";
import {redirect} from "next/navigation";

export default async function Auth() {
    const session = await getServerSession(authOptions);

    if (session) {
        return redirect("/");
    }

    return (
        <AuthCard/>
    );
}

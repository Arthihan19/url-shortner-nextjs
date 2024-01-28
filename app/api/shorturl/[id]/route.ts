import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    const shortUrl = await prisma.shortURL.findUnique({
        where: { id },
    });

    if (!shortUrl) return NextResponse.json({ error: 'Short URL not found' }, { status: 404 });

    return NextResponse.json(shortUrl);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;

    const shortUrl = await prisma.shortURL.findUnique({
        where: { id },
        select: { userId: true },
    });

    if (!shortUrl) return NextResponse.json({ error: 'Short URL not found' }, { status: 401 });

    if (shortUrl.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.shortURL.delete({
        where: { id },
    });

    return NextResponse.json({ message: 'Short URL deleted successfully' });
}
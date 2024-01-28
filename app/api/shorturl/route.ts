import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/prisma/client';
import {z} from 'zod';
import {getServerSession} from 'next-auth';
import authOptions from "@/app/auth/authOptions";

const createShortUrlRequestSchema = z.object({
    longUrl: z.string().url().min(1).max(250),
    customName: z.string()
        .min(4)
        .max(12)
        .optional()
        .or(z.literal('')),
    length: z.number().int().min(4).max(12).optional(),
});

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const body = await request.json();

    const validation = createShortUrlRequestSchema.safeParse(body);
    if (!validation.success) return NextResponse.json(validation.error.format(), {status: 400});

    const {longUrl, customName, length} = validation.data;

    if (!customName && length && ![4, 8, 12].includes(length)) return NextResponse.json({error: 'Length must be 4, 8, or 12'}, {status: 400});

    if (customName) {
        if (!customName.match(/^[a-zA-Z0-9]+$/)) return NextResponse.json({error: 'Custom name must be an alphanumeric'}, {status: 400});

        const existingShortUrl = await prisma.shortURL.findUnique({
            where: {id: customName},
        });

        if (existingShortUrl) return NextResponse.json({error: 'Custom name already taken'}, {status: 400});

        const newShortUrl = await prisma.shortURL.create({
            data: {id: customName, longUrl: longUrl, userId: session.user.id},
        });

        return NextResponse.json(newShortUrl, { status: 201 });
    }

    let shortUrlId = '';
    let shortUrl = null;

    while (!shortUrl) {
        shortUrlId = Math.random().toString(36).substring(2, 2 + (length || 4));
        shortUrl = await prisma.shortURL.findUnique({
            where: {id: shortUrlId},
        });

        if (!shortUrl) {
            break;
        }
    }

    const newShortUrl = await prisma.shortURL.create({
        data: {id: shortUrlId, longUrl: longUrl, userId: session.user.id},
    });

    return NextResponse.json(newShortUrl, { status: 201 });
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    let limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);
    page = Math.max(page, 1);
    limit = Math.min(Math.max(limit, 1), 20);

    const offset = (page - 1) * limit;

    const totalShortUrls = await prisma.shortURL.count({
        where: { userId: session.user.id },
    });
    const totalPages = Math.ceil(totalShortUrls / limit);

    const shortUrls = await prisma.shortURL.findMany({
        where: { userId: session.user.id },
        skip: offset,
        take: limit,
    });

    return NextResponse.json({
        shortUrls,
        pagination: {
            total: totalShortUrls,
            totalPages,
            currentPage: page,
            limit
        }
    });
}


import { NextResponse } from 'next/server'
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string

  if (!file) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 })
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
    })

    const recording = await prisma.recording.create({
      data: {
        title,
        url: blob.url,
        userId: session.user.id,
      },
    })

    return NextResponse.json(recording)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  try {
    const recordings = await prisma.recording.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    return NextResponse.json(recordings)
  } catch (error) {
    console.error('Error fetching recordings:', error)
    return NextResponse.json({ error: 'Error fetching recordings' }, { status: 500 })
  }
}
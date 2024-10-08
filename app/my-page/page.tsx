import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function MyPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">My Recordings</h1>
          <p>Please sign in to view your recordings.</p>
        </main>
        <Footer />
      </div>
    )
  }

  const userRecordings = await prisma.recording.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Recordings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRecordings.map((recording) => (
            <Card key={recording.id}>
              <CardHeader>
                <CardTitle>{recording.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Recorded on: {recording.createdAt.toLocaleDateString()}</p>
                <audio controls src={recording.url} className="mt-2 w-full" />
              </CardContent>
              <CardFooter>
                <Button variant="destructive" size="sm">
                  <TrashIcon className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
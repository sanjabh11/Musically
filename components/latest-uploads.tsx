import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartIcon, MessageCircleIcon } from 'lucide-react';

const mockUploads = [
  { id: 1, title: 'My First Song', user: 'JohnDoe', likes: 5, comments: 2 },
  { id: 2, title: 'Acoustic Cover', user: 'JaneSmith', likes: 8, comments: 3 },
  { id: 3, title: 'Original Composition', user: 'MusicLover', likes: 12, comments: 6 },
];

export default function LatestUploads() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Latest Uploads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUploads.map((upload) => (
          <Card key={upload.id}>
            <CardHeader>
              <CardTitle>{upload.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Uploaded by: {upload.user}</p>
              {/* Add audio player component here */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm">
                <HeartIcon className="mr-2 h-4 w-4" /> {upload.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircleIcon className="mr-2 h-4 w-4" /> {upload.comments}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
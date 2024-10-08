import Header from '@/components/header';
import Footer from '@/components/footer';
import RecordingSection from '@/components/recording-section';
import LatestUploads from '@/components/latest-uploads';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to VoiceVibe</h1>
        <RecordingSection />
        <LatestUploads />
      </main>
      <Footer />
    </div>
  );
}
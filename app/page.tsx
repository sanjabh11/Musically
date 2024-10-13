import Header from '@/components/header';
import Footer from '@/components/footer';
import RecordingSection from '@/components/recording-section';
import UploadSection from '@/components/upload-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">VoiceVibe</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Record Audio</h2>
            <RecordingSection />
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Upload Audio</h2>
            <UploadSection />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; 2024 VoiceVibe. All rights reserved.</p>
        <div className="mt-2">
          <a href="#" className="text-sm hover:underline mr-4">About</a>
          <a href="#" className="text-sm hover:underline mr-4">Terms</a>
          <a href="#" className="text-sm hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
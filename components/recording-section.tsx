"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MicIcon, StopCircleIcon, UploadIcon } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export default function RecordingSection() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(audioContextRef.current.destination);

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= 120) {
            stopRecording();
            return 120;
          }
          return prevTime + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        title: "Error",
        description: "Failed to access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const uploadRecording = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload your recording.",
        variant: "destructive",
      });
      return;
    }

    if (audioBlob) {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.ogg');
      formData.append('title', 'My Recording');

      try {
        const response = await fetch('/api/recordings', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Your recording has been uploaded successfully!",
          });
          setAudioBlob(null);
        } else {
          throw new Error('Failed to upload recording');
        }
      } catch (error) {
        console.error('Error uploading recording:', error);
        toast({
          title: "Error",
          description: "Failed to upload recording. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4">Record Your Song</h2>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-md">
          <Progress value={(recordingTime / 120) * 100} className="h-2" />
          <p className="text-center mt-2">{recordingTime} / 120 seconds</p>
        </div>
        {!isRecording ? (
          <Button onClick={startRecording} disabled={isRecording}>
            <MicIcon className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive">
            <StopCircleIcon className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        )}
        {audioBlob && (
          <div className="flex flex-col items-center space-y-2">
            <audio controls src={URL.createObjectURL(audioBlob)} />
            <Button onClick={uploadRecording}>
              <UploadIcon className="mr-2 h-4 w-4" /> Upload Recording
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
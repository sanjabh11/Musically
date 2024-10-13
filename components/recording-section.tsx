'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MicIcon, StopCircleIcon, UploadIcon } from 'lucide-react';
import axios from 'axios';
import { Progress } from "@/components/ui/progress";

export default function RecordingSection() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setProgress(0);

      timerRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            stopRecording();
            return 100;
          }
          return prevProgress + (100 / 120);
        });
      }, 1000);

      setTimeout(stopRecording, 120000); // Stop after 120 seconds
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please ensure you have given permission and are using a supported browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const uploadRecording = async () => {
    if (!audioBlob) return;
  
    const fileName = `recording-${Date.now()}.webm`;
    const formData = new FormData();
    formData.append('audio', audioBlob, fileName);
  
    try {
      const response = await axios.post('/api/recordings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Recording uploaded:', response.data);
      setAudioBlob(null); // Clear the current recording
      alert('Recording uploaded successfully!');
      // If you have a function to refresh the list of recordings, call it here
    } catch (error) {
      console.error('Error uploading recording:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to upload recording: ${error.response.data.error}`);
      } else {
        alert('Failed to upload recording. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {!isRecording ? (
          <Button onClick={startRecording}>
            <MicIcon className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive">
            <StopCircleIcon className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        )}
        {audioBlob && (
          <Button onClick={uploadRecording}>
            <UploadIcon className="mr-2 h-4 w-4" /> Upload Recording
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p>{Math.round(progress * 1.2)} seconds / 120 seconds</p>
        </div>
      )}
      
      {audioBlob && (
        <div>
          <audio src={URL.createObjectURL(audioBlob)} controls />
        </div>
      )}
    </div>
  );
}

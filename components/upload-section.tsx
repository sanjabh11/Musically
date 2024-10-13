'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UploadIcon, PlayIcon, PauseIcon } from 'lucide-react';
import axios from 'axios';

export default function UploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('/api/recordings');
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('audio', file);
  
    try {
      const response = await axios.post('/api/recordings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('File uploaded:', response.data);
      setFile(null);
      alert('File uploaded successfully!');
      fetchUploadedFiles(); // Refresh the list of uploaded files
    } catch (error) {
      console.error('Error uploading file:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to upload file: ${error.response.data.error}`);
      } else {
        alert('Failed to upload file. Please try again.');
      }
    }
  };

  const togglePlayPause = (url: string) => {
    if (audioRef.current) {
      if (isPlaying && audioRef.current.src === url) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {file && (
        <Button onClick={uploadFile}>
          <UploadIcon className="mr-2 h-4 w-4" /> Upload File
        </Button>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Button onClick={() => togglePlayPause(file)}>
              {isPlaying && audioRef.current?.src === file ? (
                <PauseIcon className="mr-2 h-4 w-4" />
              ) : (
                <PlayIcon className="mr-2 h-4 w-4" />
              )}
              {isPlaying && audioRef.current?.src === file ? 'Pause' : 'Play'}
            </Button>
            <span>{decodeURIComponent(file.split('/').pop() || '')}</span>
          </div>
        ))}
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

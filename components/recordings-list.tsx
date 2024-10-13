"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { TrashIcon } from 'lucide-react';
import axios from 'axios';

interface Recording {
  id: string;
  fileName: string;
  url: string;
}

export default function RecordingsList() {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const response = await axios.get('/api/recordings');
      setRecordings(response.data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  const deleteRecording = async (fileName: string) => {
    try {
      await axios.delete(`/api/recordings/${fileName}`);
      fetchRecordings(); // Refresh the list of recordings
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Recordings</h2>
      {recordings.map((recording) => (
        <div key={recording.id} className="flex items-center space-x-2">
          <audio src={recording.url} controls />
          <Button onClick={() => deleteRecording(recording.fileName)} variant="outline" size="sm">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
import fs from 'fs';
import path from 'path';

let prisma: any;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.warn('Prisma client not available. Using fallback data storage.');
}

const FALLBACK_FILE = path.join(process.cwd(), 'data', 'fallback-storage.json');

function readFallbackData() {
  if (fs.existsSync(FALLBACK_FILE)) {
    const data = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return { users: [], recordings: [] };
}

function writeFallbackData(data: any) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
}

export async function getUsers() {
  if (prisma) {
    return prisma.user.findMany();
  } else {
    const data = readFallbackData();
    return data.users;
  }
}

export async function getRecordings() {
  if (prisma) {
    return prisma.recording.findMany();
  } else {
    const data = readFallbackData();
    return data.recordings;
  }
}

export async function createRecording(recordingData: any) {
  if (prisma) {
    return prisma.recording.create({ data: recordingData });
  } else {
    const data = readFallbackData();
    const newRecording = { id: Date.now().toString(), ...recordingData };
    data.recordings.push(newRecording);
    writeFallbackData(data);
    return newRecording;
  }
}

// Add more database operations as needed

export default prisma;
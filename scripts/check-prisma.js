const { execSync } = require('child_process');
const fs = require('fs');
   
   try {
     console.log('Attempting to generate Prisma client...');
     execSync('npx prisma generate', { stdio: 'inherit' });
     console.log('Prisma client generated successfully.');
   } catch (error) {
     console.error('Failed to generate Prisma client. Using fallback data storage.');
     console.error('Error details:', error.message);
  
  // Create a fallback data storage file
  const fallbackData = {
    users: [],
    recordings: [],
    likes: [],
    comments: []
  };
  
  fs.writeFileSync('data/fallback-storage.json', JSON.stringify(fallbackData, null, 2));
  console.log('Fallback data storage created at data/fallback-storage.json');
}
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs';

dotenv.config();

const testFlow = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const User = (await import('./models/User.js')).default;
  const user = await User.findOne({ email: 'student1@nec.edu.in' });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  // 1. Upload using fetch and native FormData
  const formData = new FormData();
  const fileBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
  formData.append('media', fileBlob, 'dummy.jpg');
  
  const uploadRes = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const uploadData = await uploadRes.json();
  console.log('Upload Response:', uploadData);

  // 2. Create Post with Media
  const postRes = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ 
      content: 'This is my awesome image post.', 
      mediaUrl: uploadData.url, 
      mediaType: 'image' 
    })
  });
  const postData = await postRes.json();
  console.log('Post Response:', postData.success);

  // 3. Test Search Feed
  const feedRes = await fetch('http://localhost:5000/api/posts/feed?search=awesome', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const feedData = await feedRes.json();
  console.log('Feed Search Response (should have >= 1 post):', feedData.posts.length);

  process.exit();
};

testFlow();

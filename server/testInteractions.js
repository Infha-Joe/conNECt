import fetch from 'node-fetch';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const runTest = async () => {
  // Login
  const loginRes = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student1@nec.edu.in', password: 'password123' })
  });
  const { token, user } = await loginRes.json();
  console.log("Logged in. Token acquired.");

  // Create Post
  const postRes = await fetch('http://localhost:5005/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ content: 'My API Test Post' })
  });
  const { post } = await postRes.json();
  console.log("Created post ID:", post._id);

  // Like Post
  const likeRes = await fetch(`http://localhost:5005/api/posts/${post._id}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { likes } = await likeRes.json();
  console.log("Post liked. Likes count:", likes.length);

  // Delete Post
  const deleteRes = await fetch(`http://localhost:5005/api/posts/${post._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const deleteData = await deleteRes.json();
  console.log("Deleted post. Success:", deleteData.success);
};
runTest();

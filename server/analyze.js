import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import Project from './models/Project.js';
import Notification from './models/Notification.js';
import Connection from './models/Connection.js';
import HelpRequest from './models/HelpRequest.js';
import RecentAccess from './models/RecentAccess.js';

dotenv.config();

async function analyze() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const users = await User.countDocuments();
  console.log(`Existing users: ${users}`);
  
  const posts = await Post.countDocuments();
  const comments = await Comment.countDocuments();
  const projects = await Project.countDocuments();
  const notifs = await Notification.countDocuments();
  const connections = await Connection.countDocuments();
  const help = await HelpRequest.countDocuments();
  const recent = await RecentAccess.countDocuments();
  
  console.log(`Posts: ${posts}`);
  console.log(`Comments: ${comments}`);
  console.log(`Projects: ${projects}`);
  console.log(`Notifications: ${notifs}`);
  console.log(`Connections: ${connections}`);
  console.log(`Help Requests: ${help}`);
  console.log(`Recent Accesses: ${recent}`);

  await mongoose.disconnect();
}
analyze();

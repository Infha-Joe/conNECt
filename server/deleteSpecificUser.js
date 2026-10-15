import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const deleteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const User = (await import('./models/User.js')).default;
    const Post = (await import('./models/Post.js')).default;
    const Message = (await import('./models/Message.js')).default;
    const Notification = (await import('./models/Notification.js')).default;

    const user = await User.findOne({ $or: [{ collegeId: '24205052' }, { email: '24205052@nec.edu.in' }] });
    
    if (!user) {
      console.log("User with ID 24205052 or email 24205052@nec.edu.in not found.");
      process.exit(0);
    }

    console.log(`Found user: ${user.name} (${user.email}). Deleting...`);

    // Delete associated data
    const postRes = await Post.deleteMany({ author: user._id });
    const msgRes = await Message.deleteMany({ $or: [{ sender: user._id }, { receiver: user._id }] });
    const notifRes = await Notification.deleteMany({ recipient: user._id });
    
    console.log(`Deleted ${postRes.deletedCount} posts.`);
    console.log(`Deleted ${msgRes.deletedCount} messages.`);
    console.log(`Deleted ${notifRes.deletedCount} notifications.`);

    // Delete user
    await User.deleteOne({ _id: user._id });
    console.log("User deleted successfully.");
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

deleteUser();

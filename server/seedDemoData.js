import mongoose from 'mongoose';
import User from './models/User.js';
import Project from './models/Project.js';
import ProjectMember from './models/ProjectMember.js';
import Post from './models/Post.js';
import Message from './models/Message.js';
import Connection from './models/Connection.js';
import AcademicClass from './models/AcademicClass.js';
import ClassMembership from './models/ClassMembership.js';
import AcademicRecord from './models/AcademicRecord.js';
import Achievement from './models/Achievement.js';
import Mentorship from './models/Mentorship.js';
import Workspace from './models/Workspace.js';
import Notification from './models/Notification.js';
import Comment from './models/Comment.js';
import PostLike from './models/PostLike.js';
import HelpRequest from './models/HelpRequest.js';
import HelpOffer from './models/HelpOffer.js';
import MentorRequest from './models/MentorRequest.js';
import MentorshipMessage from './models/MentorshipMessage.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/conNECt';

const requiredUsers = [
  { email: 'student1@nec.edu.in', role: 'student', name: 'Student One', password: 'password123', connectId: 'C1001' },
  { email: 'student2@nec.edu.in', role: 'student', name: 'Student Two', password: 'password123', connectId: 'C1002' },
  { email: 'teacher1@nec.edu.in', role: 'teacher', name: 'Teacher One', password: 'password123', connectId: 'C2001' },
  { email: 'teacher2@nec.edu.in', role: 'teacher', name: 'Teacher Two', password: 'password123', connectId: 'C2002' },
  { email: 'alumni1@gmail.com', role: 'alumni', name: 'Alumni One', password: 'password123', connectId: 'C3001' },
  { email: 'alumni2@gmail.com', role: 'alumni', name: 'Alumni Two', password: 'password123', connectId: 'C3002' },
  { email: 'admin1@nec.edu.in', role: 'admin', name: 'Admin One', password: 'password123', connectId: 'C4001' }
];

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. CLEAR COLLECTIONS
    const collectionsToClear = [
      Project, ProjectMember, Post, Message, Connection, AcademicClass,
      ClassMembership, AcademicRecord, Achievement, Mentorship, Workspace,
      Notification, Comment, PostLike, HelpRequest, HelpOffer, MentorRequest,
      MentorshipMessage
    ];
    
    for (const model of collectionsToClear) {
      await model.deleteMany({});
    }
    console.log('Cleared old data related to demo models.');

    // 2. SETUP USERS
    const emailsToKeep = requiredUsers.map(u => u.email);
    await User.deleteMany({ email: { $nin: emailsToKeep } });
    console.log('Deleted extraneous users.');

    const userDocs = {};
    for (const u of requiredUsers) {
      let existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        existingUser = new User(u);
        await existingUser.save();
        console.log(`Created user: ${u.email}`);
      } else {
        console.log(`Retained existing user: ${u.email}`);
      }
      userDocs[u.email.split('@')[0]] = existingUser;
    }

    const { student1, student2, teacher1, teacher2, alumni1, alumni2, admin1 } = userDocs;

    // 3. CONNECTIONS
    const connectionsData = [
      { requester: student1._id, recipient: student2._id, status: 'accepted' },
      { requester: student1._id, recipient: teacher1._id, status: 'accepted' },
      { requester: student2._id, recipient: teacher2._id, status: 'accepted' },
      { requester: teacher1._id, recipient: teacher2._id, status: 'accepted' },
      { requester: teacher1._id, recipient: alumni1._id, status: 'accepted' },
      { requester: teacher2._id, recipient: alumni2._id, status: 'accepted' },
      { requester: alumni1._id, recipient: alumni2._id, status: 'accepted' },
      { requester: alumni1._id, recipient: student1._id, status: 'accepted' },
      { requester: alumni2._id, recipient: student2._id, status: 'accepted' }
    ];
    await Connection.insertMany(connectionsData);

    // 4. ACADEMIC CLASSES
    const class1 = new AcademicClass({
      name: "Web Technology",
      teacher: teacher1._id,
      description: "Learn web development basics including React and Node.js.",
      inviteCode: "WT101"
    });
    await class1.save();
    
    const class2 = new AcademicClass({
      name: "Database Management Systems",
      teacher: teacher2._id,
      description: "Advanced concepts in relational databases and normalization.",
      inviteCode: "DBMS101"
    });
    await class2.save();

    await ClassMembership.insertMany([
      { academicClass: class1._id, user: student1._id, status: 'active' },
      { academicClass: class1._id, user: student2._id, status: 'active' },
      { academicClass: class2._id, user: student1._id, status: 'active' },
      { academicClass: class2._id, user: student2._id, status: 'active' }
    ]);

    await AcademicRecord.insertMany([
      {
        academicClass: class1._id,
        date: new Date().toISOString().split('T')[0],
        creator: teacher1._id,
        topic: "React Component Architecture",
        notes: "Remember to break down UI into reusable pieces."
      },
      {
        academicClass: class1._id,
        date: new Date().toISOString().split('T')[0],
        creator: teacher1._id,
        topic: "REST API Basics",
        notes: "Study HTTP methods, status codes, and routing.",
        assignment: { title: "Create a simple API", description: "Use Express", dueDate: "2024-12-01" }
      },
      {
        academicClass: class2._id,
        date: new Date().toISOString().split('T')[0],
        creator: teacher2._id,
        topic: "MongoDB Aggregation",
        notes: "Review $match, $group, and $project pipeline stages."
      },
      {
        academicClass: class2._id,
        date: new Date().toISOString().split('T')[0],
        creator: teacher2._id,
        topic: "Database Normalization",
        notes: "Understand 1NF, 2NF, 3NF and BCNF."
      }
    ]);

    // 5. PROJECTS & MENTORSHIP
    const p1 = new Project({
      title: "Smart Campus Connect",
      description: "A student-focused platform for collaboration, academic support, projects and mentorship.",
      leader: student1._id,
      mentor: teacher1._id,
      technologies: ["React", "Node.js", "MongoDB", "Web Development"],
      status: "in_progress"
    });
    await p1.save();
    
    const p2 = new Project({
      title: "Academic Resource Hub",
      description: "Centralized hub for all college academic resources.",
      leader: student2._id,
      mentor: teacher2._id,
      technologies: ["MongoDB", "Express", "Education", "Full Stack"],
      status: "in_progress"
    });
    await p2.save();

    await ProjectMember.insertMany([
      { project: p1._id, user: student2._id, roleInProject: "Member" },
      { project: p2._id, user: student1._id, roleInProject: "Member" }
    ]);
    
    const req1 = new MentorRequest({
      project: p1._id,
      requester: student1._id,
      mentor: teacher1._id,
      goals: "Understand architecture and backend.",
      requestedDuration: 30,
      status: 'accepted'
    });
    await req1.save();

    const ment1 = new Mentorship({
      mentor: teacher1._id,
      project: p1._id,
      requestType: "group",
      groupMembers: [student1._id, student2._id],
      request: req1._id,
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      durationDays: 30
    });
    await ment1.save();

    await Workspace.create({
      project: p1._id,
      mentor: teacher1._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "active"
    });

    // 6. POSTS
    const posts = [
      { author: student1._id, content: "Learning React component architecture today. Understanding reusable components makes large applications much easier to maintain." },
      { author: teacher1._id, content: "Reminder: Students should review REST API concepts before the next Web Technology session." },
      { author: teacher2._id, content: "Database tip: Always understand normalization before designing complex relational schemas." },
      { author: student2._id, content: "Working on our Smart Campus Connect project using React, Node.js and MongoDB." },
      { author: alumni1._id, content: "Sharing a few lessons from my first software internship: focus on fundamentals, Git and communication." },
      { author: alumni2._id, content: "Preparing for technical interviews? Practice DSA consistently and understand the approach instead of memorizing solutions." },
      { author: teacher1._id, content: "Today's topic: Authentication, authorization and secure password handling." },
      { author: student1._id, content: "Project progress update: completed the initial MongoDB schema design." }
    ];
    await Post.insertMany(posts);

    // 7. MESSAGES
    const messages = [
      { sender: student1._id, recipient: teacher1._id, text: "Good morning! Can I ask a question about the Web Technology project?" },
      { sender: teacher1._id, recipient: student1._id, text: "Sure, go ahead." },
      { sender: student2._id, recipient: teacher2._id, text: "Hello sir, could you provide more resources for DBMS?" },
      { sender: student1._id, recipient: student2._id, text: "Hey, are we still meeting for the project collaboration today?" },
      { sender: alumni1._id, recipient: student1._id, text: "Hi! Let me know if you need any career or internship advice." }
    ];
    await Message.insertMany(messages);

    // 8. NOTIFICATIONS
    await Notification.insertMany([
      { user: teacher1._id, type: "connection_response", title: "Connection Request Accepted", message: "Student One accepted your connection request" },
      { user: student2._id, type: "class_invitation", title: "Class Invitation", message: "You were invited to a new class" },
    ]);

    // 9. ACHIEVEMENTS
    await Achievement.insertMany([
      { user: student1._id, title: "College Hackathon Participant", category: "Hackathon", organization: "NEC", date: new Date() },
      { user: student2._id, title: "Web Development Project Presentation", category: "Project Competition", organization: "TechFest", date: new Date() },
      { user: alumni1._id, title: "Software Development Internship", category: "Internship Achievement", organization: "Tech Corp", date: new Date() },
      { user: alumni2._id, title: "Coding Competition", category: "Coding Competition", organization: "CodeForces", date: new Date() }
    ]);
    
    // 10. HELP REQUESTS
    await HelpRequest.insertMany([
      { requester: student1._id, title: "MongoDB Aggregation", subject: "Database Management", topic: "Aggregation", description: "Need help understanding aggregation pipelines.", helpNeeded: "Explanation", status: 'open' },
      { requester: student2._id, title: "React State Management", subject: "Web Technology", topic: "State", description: "Stuck on Redux and Context API.", helpNeeded: "Debugging", status: 'open' }
    ]);
    
    // 11. VERIFY DATA & PRINT REPORT
    const usersCount = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'student' });
    const teachersCount = await User.countDocuments({ role: 'teacher' });
    const alumniCount = await User.countDocuments({ role: 'alumni' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    console.log('\n--- REPORT ---');
    console.log(`USERS:\n${usersCount} total\n`);
    console.log(`STUDENTS:\n${studentsCount}\n`);
    console.log(`TEACHERS:\n${teachersCount}\n`);
    console.log(`ALUMNI:\n${alumniCount}\n`);
    console.log(`ADMIN:\n${adminCount}\n`);
    
    console.log('Counts:');
    console.log(`- Connections: ${await Connection.countDocuments()}`);
    console.log(`- Classes: ${await AcademicClass.countDocuments()}`);
    console.log(`- Academic records: ${await AcademicRecord.countDocuments()}`);
    console.log(`- Projects: ${await Project.countDocuments()}`);
    console.log(`- Project members: ${await ProjectMember.countDocuments()}`);
    console.log(`- Mentorships: ${await Mentorship.countDocuments()}`);
    console.log(`- Workspaces: ${await Workspace.countDocuments()}`);
    console.log(`- Posts: ${await Post.countDocuments()}`);
    console.log(`- Messages: ${await Message.countDocuments()}`);
    console.log(`- Notifications: ${await Notification.countDocuments()}`);
    console.log(`- Achievements: ${await Achievement.countDocuments()}`);
    console.log(`- Help requests: ${await HelpRequest.countDocuments()}`);

    console.log('\nOnly MongoDB demo data was changed. Application code was not modified.');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();

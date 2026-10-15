import mongoose from 'mongoose';
import User from './models/User.js';
import Project from './models/Project.js';
import ProjectMember from './models/ProjectMember.js';
import MentorRequest from './models/MentorRequest.js';
import Mentorship from './models/Mentorship.js';
import Workspace from './models/Workspace.js';
import Roadmap from './models/Roadmap.js';
import RoadmapStage from './models/RoadmapStage.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/conNECt';

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. CLEAR COLLECTIONS
    const collectionsToClear = [
      Project, ProjectMember, MentorRequest, Mentorship, Workspace, Roadmap, RoadmapStage
    ];
    
    for (const model of collectionsToClear) {
      await model.deleteMany({});
    }
    console.log('Cleared Projects & Mentorship data.');

    // 2. GET USERS
    const users = await User.find({ email: { $in: [
      'student1@nec.edu.in', 'student2@nec.edu.in', 
      'teacher1@nec.edu.in', 'teacher2@nec.edu.in', 
      'alumni1@gmail.com', 'alumni2@gmail.com'
    ]}});

    const u = {};
    users.forEach(user => {
      u[user.email.split('@')[0]] = user;
    });

    const { student1, student2, teacher1, teacher2, alumni1, alumni2 } = u;

    // 3. CREATE PROJECTS
    const p1 = new Project({
      title: "Smart Campus Connect",
      description: "A collaborative college platform connecting students, faculty and alumni for academic support, projects and mentorship.",
      leader: student1._id,
      mentor: teacher1._id,
      technologies: ["React", "Node.js", "MongoDB", "Education"],
      status: "in_progress"
    });
    await p1.save();

    const p2 = new Project({
      title: "Academic Resource Hub",
      description: "Centralized hub for all college academic resources.",
      leader: student2._id,
      mentor: teacher2._id,
      technologies: ["React", "Express", "MongoDB", "Learning"],
      status: "in_progress"
    });
    await p2.save();

    const p3 = new Project({
      title: "Student Career Mentorship Platform",
      description: "A platform to connect students with alumni for career guidance.",
      leader: student1._id,
      mentor: alumni1._id,
      technologies: ["MERN", "Mentorship", "Career"],
      status: "pending" // Or "planning" if allowed, but schema says: ["pending", "in_progress", "completed"]
    });
    await p3.save();

    // 4. PROJECT MEMBERS
    await ProjectMember.insertMany([
      { project: p1._id, user: student1._id, roleInProject: "Leader" },
      { project: p1._id, user: student2._id, roleInProject: "Member" },
      { project: p2._id, user: student2._id, roleInProject: "Leader" },
      { project: p2._id, user: student1._id, roleInProject: "Member" },
      { project: p3._id, user: student1._id, roleInProject: "Leader" },
      { project: p3._id, user: student2._id, roleInProject: "Member" }
    ]);

    // 5. MENTOR REQUESTS
    const req1 = new MentorRequest({
      project: p1._id,
      requester: student1._id,
      mentor: teacher1._id,
      goals: "Guidance on project architecture, backend APIs and deployment.",
      requestedDuration: 90,
      status: 'accepted'
    });
    await req1.save();

    const req2 = new MentorRequest({
      project: p2._id,
      requester: student2._id,
      mentor: teacher2._id,
      goals: "Guidance on database design and full-stack development.",
      requestedDuration: 60,
      status: 'accepted'
    });
    await req2.save();

    const req3 = new MentorRequest({
      project: p3._id,
      requester: student1._id,
      mentor: alumni1._id,
      goals: "Career guidance, project review and interview preparation.",
      requestedDuration: 90,
      status: 'pending'
    });
    await req3.save();

    // 6. MENTORSHIPS
    const ment1 = new Mentorship({
      mentor: teacher1._id,
      mentee: student1._id,
      project: p1._id,
      requestType: "individual",
      request: req1._id,
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      durationDays: 90
    });
    await ment1.save();

    const ment2 = new Mentorship({
      mentor: teacher2._id,
      mentee: student2._id,
      project: p2._id,
      requestType: "individual",
      request: req2._id,
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      durationDays: 60
    });
    await ment2.save();

    // 7. WORKSPACES
    await Workspace.create([
      {
        project: p1._id,
        mentor: teacher1._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "active"
      },
      {
        project: p2._id,
        mentor: teacher2._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "active"
      }
    ]);

    // 8. ROADMAPS & STAGES
    const rm1 = new Roadmap({
      title: "Smart Campus Connect Roadmap",
      entityType: "Project",
      entityId: p1._id,
      createdBy: student1._id
    });
    await rm1.save();

    await RoadmapStage.insertMany([
      { roadmap: rm1._id, title: "Planning", order: 1, status: "completed", progress: 100 },
      { roadmap: rm1._id, title: "UI Development", order: 2, status: "completed", progress: 100 },
      { roadmap: rm1._id, title: "Backend API Development", order: 3, status: "in-progress", progress: 50 },
      { roadmap: rm1._id, title: "Testing", order: 4, status: "pending", progress: 0 },
      { roadmap: rm1._id, title: "Deployment", order: 5, status: "pending", progress: 0 }
    ]);

    const rm2 = new Roadmap({
      title: "Academic Resource Hub Roadmap",
      entityType: "Project",
      entityId: p2._id,
      createdBy: student2._id
    });
    await rm2.save();

    await RoadmapStage.insertMany([
      { roadmap: rm2._id, title: "Requirement Analysis", order: 1, status: "completed", progress: 100 },
      { roadmap: rm2._id, title: "Database Design", order: 2, status: "in-progress", progress: 50 },
      { roadmap: rm2._id, title: "Frontend Development", order: 3, status: "pending", progress: 0 },
      { roadmap: rm2._id, title: "Testing", order: 4, status: "pending", progress: 0 }
    ]);

    // 9. PRINT REPORT
    console.log('\n--- REPORT ---');
    console.log(`Projects: ${await Project.countDocuments()}`);
    console.log(`Project Members: ${await ProjectMember.countDocuments()}`);
    console.log(`Mentor Requests: ${await MentorRequest.countDocuments()}`);
    console.log(`Accepted Mentor Requests: ${await MentorRequest.countDocuments({ status: 'accepted' })}`);
    console.log(`Active Mentorships: ${await Mentorship.countDocuments({ status: 'active' })}`);
    console.log(`Active Workspaces: ${await Workspace.countDocuments({ status: 'active' })}`);
    console.log(`Roadmaps: ${await Roadmap.countDocuments()}`);

    console.log('\nOnly Projects & Mentorship MongoDB data was added. No application code or other demo data was changed.');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();

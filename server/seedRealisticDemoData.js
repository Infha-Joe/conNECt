import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/conNECt";

async function run() {
  console.log("Connecting to MongoDB:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("Connected successfully.");

  // Import existing models
  const { default: User } = await import("./models/User.js");
  const { default: Department } = await import("./models/Department.js");
  const { default: Connection } = await import("./models/Connection.js");
  const { default: Post } = await import("./models/Post.js");
  const { default: Comment } = await import("./models/Comment.js");
  const { default: PostLike } = await import("./models/PostLike.js");
  const { default: Project } = await import("./models/Project.js");
  const { default: ProjectMember } = await import("./models/ProjectMember.js");
  const { default: AcademicClass } = await import("./models/AcademicClass.js");
  const { default: AcademicRecord } = await import("./models/AcademicRecord.js");
  const { default: ClassMembership } = await import("./models/ClassMembership.js");
  const { default: MentorRequest } = await import("./models/MentorRequest.js");
  const { default: Mentorship } = await import("./models/Mentorship.js");
  const { default: Workspace } = await import("./models/Workspace.js");
  const { default: Message } = await import("./models/Message.js");
  const { default: Notification } = await import("./models/Notification.js");
  const { default: Achievement } = await import("./models/Achievement.js");
  const { default: HelpRequest } = await import("./models/HelpRequest.js");
  const { default: HelpOffer } = await import("./models/HelpOffer.js");

  // Get department
  const itDept = await Department.findOne({ code: "IT" }) || await Department.findOne();
  const cseDept = await Department.findOne({ code: "CSE" }) || itDept;

  // 1. Ensure the 8 real users exist
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  // Check / create Anand
  let anand = await User.findOne({ email: "24205059@nec.edu.in" });
  if (!anand) {
    console.log("Creating Anand account...");
    anand = await User.create({
      name: "ANAND K",
      email: "24205059@nec.edu.in",
      collegeEmail: "24205059@nec.edu.in",
      collegeId: "24205059",
      role: "student",
      password: hashedPassword,
      department: itDept._id,
      year: 3,
      emailVerified: true,
      status: "active",
      connectId: "CNCT-2026-000059",
      bio: "Passionate about Full Stack Development & Cloud Architecture. Always eager to build innovative student tools.",
      skills: ["React", "Node.js", "Express", "Docker", "AWS", "Python"],
    });
  }

  // Update Infhant role to alumni if needed
  let infhant = await User.findOne({ email: "infhantj@gmail.com" });
  if (infhant && infhant.role !== "alumni") {
    infhant.role = "alumni";
    infhant.degree = "B.Tech Information Technology";
    infhant.batch = "2019-2023";
    infhant.graduationYear = 2023;
    infhant.currentCompany = "Zoho Corporation";
    infhant.currentRole = "Senior Software Engineer";
    infhant.location = "Chennai, India";
    infhant.skills = ["System Design", "Microservices", "Java", "React", "Go"];
    await infhant.save({ validateBeforeSave: false });
  }

  // Fetch all 8 accounts
  const joseph = await User.findOne({ email: "24205052@nec.edu.in" });
  const vasanth = await User.findOne({ email: "24205049@nec.edu.in" });
  const chokalingam = await User.findOne({ email: "24205064@nec.edu.in" });
  const lathi = await User.findOne({ email: "24205058@nec.edu.in" });
  const vijay = await User.findOne({ email: "vijaychockalingam28@gmail.com" });
  const balamurugan = await User.findOne({ email: "balamuruganrjpam@gmail.com" });

  console.log("Found all 8 accounts:");
  console.log("- Joseph:", joseph?._id);
  console.log("- Vasanth:", vasanth?._id);
  console.log("- Anand:", anand?._id);
  console.log("- Chokalingam:", chokalingam?._id);
  console.log("- Lathi:", lathi?._id);
  console.log("- Infhant:", infhant?._id);
  console.log("- Vijay:", vijay?._id);
  console.log("- Balamurugan:", balamurugan?._id);

  // Update profile details for rich display
  if (joseph) {
    joseph.department = itDept._id;
    joseph.year = 3;
    joseph.skills = ["React", "Tailwind CSS", "Node.js", "MongoDB", "UI/UX", "GraphQL"];
    joseph.bio = "3rd Year IT student passionate about building scalable web applications and collaborating on open-source projects.";
    await joseph.save({ validateBeforeSave: false });
  }
  if (vasanth) {
    vasanth.department = itDept._id;
    vasanth.year = 3;
    vasanth.skills = ["Python", "Machine Learning", "PyTorch", "FastAPI", "Data Structures"];
    vasanth.bio = "AI enthusiast focusing on Deep Learning applications and Natural Language Processing. Exploring ML deployment pipelines.";
    await vasanth.save({ validateBeforeSave: false });
  }
  if (chokalingam) {
    chokalingam.designation = "Assistant Professor";
    chokalingam.department = itDept._id;
    chokalingam.skills = ["Web Technology", "Database Systems", "Software Engineering", "Agile"];
    chokalingam.bio = "Faculty in Information Technology. Specializes in Web Technologies, Distributed Systems and Cloud Computing.";
    await chokalingam.save({ validateBeforeSave: false });
  }
  if (lathi) {
    lathi.designation = "Associate Professor";
    lathi.department = itDept._id;
    lathi.skills = ["Artificial Intelligence", "Data Structures", "Algorithms", "Research"];
    lathi.bio = "Research scholar & Faculty in IT Department. Mentoring student innovators in AI and Data Analytics.";
    await lathi.save({ validateBeforeSave: false });
  }
  if (vijay) {
    vijay.currentCompany = "Freshworks";
    vijay.currentRole = "Full Stack Engineer";
    vijay.degree = "B.Tech Information Technology";
    vijay.batch = "2020-2024";
    vijay.graduationYear = 2024;
    vijay.location = "Bengaluru, India";
    vijay.skills = ["React", "TypeScript", "Node.js", "Docker", "Kubernetes", "AWS"];
    vijay.bio = "NEC Alumnus (Batch 2024) working at Freshworks. Passionate about guiding junior students in web development & placements.";
    await vijay.save({ validateBeforeSave: false });
  }

  // ==========================================
  // 1. CONNECTIONS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Connections ---");
  const connectionPairs = [
    { req: joseph._id, rec: vasanth._id, status: "accepted" },
    { req: joseph._id, rec: anand._id, status: "accepted" },
    { req: joseph._id, rec: chokalingam._id, status: "accepted" },
    { req: joseph._id, rec: lathi._id, status: "accepted" },
    { req: joseph._id, rec: infhant._id, status: "accepted" },
    { req: vasanth._id, rec: anand._id, status: "accepted" },
    { req: vasanth._id, rec: chokalingam._id, status: "accepted" },
    { req: anand._id, rec: lathi._id, status: "accepted" },
    { req: anand._id, rec: vijay._id, status: "accepted" },
    { req: infhant._id, rec: vijay._id, status: "accepted" },
    { req: vasanth._id, rec: vijay._id, status: "accepted" },
    { req: chokalingam._id, rec: lathi._id, status: "accepted" },
  ];

  let connectionsCreated = 0;
  for (const pair of connectionPairs) {
    const exists = await Connection.findOne({
      $or: [
        { requester: pair.req, recipient: pair.rec },
        { requester: pair.rec, recipient: pair.req }
      ]
    });
    if (!exists) {
      await Connection.create({
        requester: pair.req,
        recipient: pair.rec,
        status: pair.status,
        respondedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000))
      });
      connectionsCreated++;
    }
  }
  const totalConnections = await Connection.countDocuments();
  console.log(`Created ${connectionsCreated} new connections. Total in DB: ${totalConnections}`);

  // ==========================================
  // 2. POSTS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Posts ---");
  const postDefs = [
    {
      author: joseph._id,
      content: "Exploring React 19 server components and performance optimizations for our college project. The speed improvement in state management and asset caching is remarkable! Anyone experimenting with SSR or Next.js App Router for upcoming hackathons?",
      likes: [vasanth._id, anand._id, chokalingam._id, vijay._id]
    },
    {
      author: vasanth._id,
      content: "Just finished fine-tuning a BERT model for campus sentiment analysis and grievance classification. Achieved 92.4% validation accuracy on custom dataset. Machine Learning pipelines with PyTorch and Hugging Face are so streamlined now!",
      likes: [joseph._id, anand._id, lathi._id]
    },
    {
      author: chokalingam._id,
      content: "Reminder to all III Year IT students: Tomorrow's Web Technology laboratory session will cover RESTful API design principles and JWT authentication best practices. Please review Express middleware documentation before class.",
      likes: [joseph._id, vasanth._id, anand._id]
    },
    {
      author: lathi._id,
      content: "Proud to share that our department students presented 4 excellent technical research papers at the National Conference on Emerging AI Systems today. Hearty congratulations to all participants! Keep pushing boundaries.",
      likes: [joseph._id, chokalingam._id, infhant._id, vijay._id]
    },
    {
      author: infhant._id,
      content: "Career Advice for final & pre-final years: Don't just memorize LeetCode solutions. Interviewers at top product companies deeply value System Design fundamentals, clear database schema modeling, and writing maintainable clean code.",
      likes: [joseph._id, vasanth._id, anand._id, vijay._id]
    },
    {
      author: vijay._id,
      content: "Happy to be mentoring student teams on conNECt! Watching junior developers build full-stack apps with modern toolchains like Vite, Tailwind, and Node.js reminds me of our early hackathon days at NEC. Great work team!",
      likes: [joseph._id, anand._id, infhant._id]
    },
    {
      author: anand._id,
      content: "Successfully containerized our microservices architecture using Docker Compose. Managed to orchestrate MongoDB, Redis cache, and our Express backend in isolated networks. Deployment feels effortless now!",
      likes: [joseph._id, vasanth._id, vijay._id]
    },
    {
      author: joseph._id,
      content: "Working on complex MongoDB aggregation pipelines for user analytics: using $facet, $bucket, and $lookup to summarize department metrics in a single query pass. Great learning curve in database optimization!",
      likes: [chokalingam._id, anand._id]
    },
    {
      author: chokalingam._id,
      content: "Smart India Hackathon (SIH 2026) internal college scrutiny rounds are scheduled for next Friday. Teams working on Smart Automation, Education, and Healthcare domains must ensure their prototype demos are ready.",
      likes: [joseph._id, vasanth._id, anand._id, lathi._id]
    },
    {
      author: vasanth._id,
      content: "Completed 50 days of consistent problem solving on LeetCode covering Dynamic Programming and Graph algorithms! Consistent practice makes pattern recognition so much easier during placement rounds.",
      likes: [joseph._id, infhant._id, vijay._id]
    },
    {
      author: lathi._id,
      content: "For students asking about research project ideas: Focus on Edge AI, sustainable IoT environmental monitoring, or federated learning for healthcare privacy. Reach out if you need guidance on literature review.",
      likes: [vasanth._id, anand._id, chokalingam._id]
    },
    {
      author: infhant._id,
      content: "To all juniors preparing for technical interviews: Always write unit tests and understand how databases handle concurrency and indexing. A deep grasp of index scanning vs table scans will set you apart.",
      likes: [joseph._id, anand._id, vasanth._id, chokalingam._id]
    }
  ];

  const createdPosts = [];
  for (const p of postDefs) {
    const existing = await Post.findOne({ author: p.author, content: p.content });
    if (!existing) {
      const newPost = await Post.create(p);
      createdPosts.push(newPost);
      // Create PostLike records
      for (const liker of p.likes) {
        await PostLike.findOneAndUpdate(
          { post: newPost._id, user: liker },
          { post: newPost._id, user: liker },
          { upsert: true }
        );
      }
    } else {
      createdPosts.push(existing);
    }
  }
  const totalPosts = await Post.countDocuments();
  console.log(`Ensured ${createdPosts.length} posts. Total in DB: ${totalPosts}`);

  // ==========================================
  // 3. COMMENTS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Comments ---");
  const commentDefs = [
    {
      postIdx: 0, // React 19 post
      author: chokalingam._id,
      content: "Excellent initiative Joseph! Make sure to benchmark the time-to-first-byte (TTFB) and analyze bundle sizes using bundle analyzer."
    },
    {
      postIdx: 0,
      author: vijay._id,
      content: "At Freshworks we saw significant reduction in memory leaks once we moved our internal tool widgets to React server components. Definitely the right direction!"
    },
    {
      postIdx: 0,
      author: anand._id,
      content: "I can help test the client-side state caching with React Query if you want to integrate it with the backend APIs."
    },
    {
      postIdx: 1, // BERT sentiment analysis
      author: lathi._id,
      content: "Great progress Vasanth! Let us document the ablation study results and prepare an extended abstract for the upcoming IEEE student symposium."
    },
    {
      postIdx: 1,
      author: joseph._id,
      content: "The accuracy is impressive! Can we connect this to the Campus Grievance Portal to auto-tag urgent feedback?"
    },
    {
      postIdx: 2, // Web Tech Lab
      author: joseph._id,
      content: "Understood sir! We have prepared the Postman collections with role-based auth headers ready for tomorrow's verification."
    },
    {
      postIdx: 2,
      author: anand._id,
      content: "Thank you sir, will bring the swagger API spec documentation as well."
    },
    {
      postIdx: 4, // Infhant career advice
      author: joseph._id,
      content: "Thank you for the guidance Anna! Which database indexing strategies do you recommend focusing on for entry-level backend roles?"
    },
    {
      postIdx: 4,
      author: infhant._id,
      content: "Focus on compound indexes, understanding B-tree vs Hash indexes, explain plans (executionStats), and optimizing high-cardinality queries."
    },
    {
      postIdx: 6, // Anand Docker post
      author: vijay._id,
      content: "Nice setup Anand! Make sure to use multi-stage Docker builds to keep the final production container images lightweight and secure."
    },
    {
      postIdx: 7, // MongoDB aggregation
      author: chokalingam._id,
      content: "Pay close attention to pipeline ordering: always filter with $match and project required fields early before heavy $lookup or $group stages."
    },
    {
      postIdx: 8, // SIH hackathon
      author: vasanth._id,
      content: "Our team has completed the prototype UI and hardware circuit integration. Looking forward to the internal review rounds!"
    }
  ];

  let commentsCreated = 0;
  for (const c of commentDefs) {
    const targetPost = createdPosts[c.postIdx] || createdPosts[0];
    const exists = await Comment.findOne({ post: targetPost._id, author: c.author, content: c.content });
    if (!exists) {
      await Comment.create({
        post: targetPost._id,
        author: c.author,
        content: c.content
      });
      commentsCreated++;
    }
  }
  const totalComments = await Comment.countDocuments();
  console.log(`Created ${commentsCreated} new comments. Total in DB: ${totalComments}`);

  // ==========================================
  // 4. PROJECTS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Projects ---");
  const projectDefs = [
    {
      title: "Smart Campus Management System",
      description: "An integrated web and mobile portal for managing campus amenities, hostel passes, laboratory equipment booking, and campus announcements in real-time.",
      leader: joseph._id,
      mentor: chokalingam._id,
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      status: "in_progress",
      progress: 65,
      githubLink: "https://github.com/nec-campus/smart-campus",
      startDate: new Date(Date.now() - 30 * 86400000),
      expectedEndDate: new Date(Date.now() + 60 * 86400000),
    },
    {
      title: "AI Student Study Assistant",
      description: "An intelligent retrieval-augmented generation (RAG) assistant that indexes lecture slides, syllabus documents, and textbooks to answer student queries accurately.",
      leader: vasanth._id,
      mentor: lathi._id,
      technologies: ["Python", "FastAPI", "LangChain", "ChromaDB", "React"],
      status: "in_progress",
      progress: 75,
      githubLink: "https://github.com/nec-campus/ai-study-assistant",
      startDate: new Date(Date.now() - 40 * 86400000),
      expectedEndDate: new Date(Date.now() + 45 * 86400000),
    },
    {
      title: "Placement Preparation & Mock Interview Portal",
      description: "A comprehensive platform featuring coding problem roadmaps, company-wise interview questions, mock aptitude tests, and peer-to-peer review sessions.",
      leader: anand._id,
      mentor: vijay._id,
      technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
      status: "in_progress",
      progress: 50,
      githubLink: "https://github.com/nec-campus/placement-portal",
      startDate: new Date(Date.now() - 25 * 86400000),
      expectedEndDate: new Date(Date.now() + 50 * 86400000),
    },
    {
      title: "IoT Smart Classroom Automation",
      description: "Automated climate control and energy-saving lighting system based on PIR sensor occupancy detection and scheduled lecture timetables.",
      leader: vasanth._id,
      mentor: chokalingam._id,
      technologies: ["ESP32", "MQTT", "Node.js", "React", "InfluxDB"],
      status: "in_progress",
      progress: 60,
      githubLink: "https://github.com/nec-campus/iot-classroom",
      startDate: new Date(Date.now() - 35 * 86400000),
      expectedEndDate: new Date(Date.now() + 30 * 86400000),
    },
    {
      title: "Alumni Connect & Mentorship Platform",
      description: "Bridging the gap between active students and college alumni for 1-on-1 career guidance, resume reviews, project mentorship, and job referrals.",
      leader: joseph._id,
      mentor: infhant._id,
      technologies: ["React", "Express", "MongoDB", "Socket.io", "Tailwind CSS"],
      status: "in_progress",
      progress: 80,
      githubLink: "https://github.com/nec-campus/alumni-connect",
      startDate: new Date(Date.now() - 50 * 86400000),
      expectedEndDate: new Date(Date.now() + 20 * 86400000),
    },
    {
      title: "Digital Library & Research Paper Repository",
      description: "Centralized repository for departmental project dissertations, IEEE papers, and semester question banks with full-text search and OCR indexing.",
      leader: anand._id,
      mentor: lathi._id,
      technologies: ["React", "Python", "Elasticsearch", "Flask", "MongoDB"],
      status: "completed",
      progress: 100,
      githubLink: "https://github.com/nec-campus/digital-library",
      startDate: new Date(Date.now() - 90 * 86400000),
      expectedEndDate: new Date(Date.now() - 10 * 86400000),
      actualEndDate: new Date(Date.now() - 10 * 86400000),
    },
    {
      title: "Campus Grievance & Maintenance Tracking",
      description: "A transparent ticketing system enabling students and faculty to log maintenance requests with live status tracking and technician SLA analytics.",
      leader: joseph._id,
      mentor: chokalingam._id,
      technologies: ["React", "Node.js", "MongoDB", "Nodemailer", "Cloudinary"],
      status: "in_progress",
      progress: 40,
      startDate: new Date(Date.now() - 15 * 86400000),
      expectedEndDate: new Date(Date.now() + 60 * 86400000),
    },
    {
      title: "Student Collaboration & Hackathon Hub",
      description: "A matchmaking platform for college hackathon enthusiasts to find teammates based on skill gaps like Frontend, Backend, AI/ML, and UI/UX.",
      leader: vasanth._id,
      mentor: vijay._id,
      technologies: ["React", "Express", "MongoDB", "Tailwind CSS"],
      status: "in_progress",
      progress: 45,
      startDate: new Date(Date.now() - 20 * 86400000),
      expectedEndDate: new Date(Date.now() + 45 * 86400000),
    },
    {
      title: "Real-time Laboratory Attendance & Equipment Log",
      description: "QR-code and RFID driven system for recording student laboratory attendance, instrument calibration schedules, and component inventory.",
      leader: anand._id,
      mentor: chokalingam._id,
      technologies: ["Node.js", "Express", "MySQL", "React", "WebRTC"],
      status: "pending",
      progress: 20,
      startDate: new Date(Date.now() - 10 * 86400000),
      expectedEndDate: new Date(Date.now() + 75 * 86400000),
    },
    {
      title: "Peer-to-Peer Academic Resource Exchange",
      description: "A structured notes-sharing platform where student peer tutors share validated class summaries, formula sheets, and past lab records.",
      leader: joseph._id,
      mentor: lathi._id,
      technologies: ["React", "Firebase", "Node.js", "Express", "Tailwind CSS"],
      status: "completed",
      progress: 100,
      startDate: new Date(Date.now() - 120 * 86400000),
      expectedEndDate: new Date(Date.now() - 20 * 86400000),
      actualEndDate: new Date(Date.now() - 20 * 86400000),
    }
  ];

  const createdProjects = [];
  for (const p of projectDefs) {
    let proj = await Project.findOne({ title: p.title });
    if (!proj) {
      proj = await Project.create(p);
    } else {
      proj.leader = p.leader;
      proj.mentor = p.mentor;
      proj.technologies = p.technologies;
      proj.status = p.status;
      proj.progress = p.progress;
      await proj.save();
    }
    createdProjects.push(proj);
  }
  const totalProjects = await Project.countDocuments();
  console.log(`Ensured ${createdProjects.length} projects. Total in DB: ${totalProjects}`);

  // ==========================================
  // 5. PROJECT MEMBERS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Project Members ---");
  const memberAssignments = [
    { projIdx: 0, user: joseph._id, role: "Project Leader / Full Stack" },
    { projIdx: 0, user: vasanth._id, role: "Backend Developer" },
    { projIdx: 0, user: anand._id, role: "Frontend Developer" },

    { projIdx: 1, user: vasanth._id, role: "Project Leader / ML Engineer" },
    { projIdx: 1, user: joseph._id, role: "API Integration Specialist" },

    { projIdx: 2, user: anand._id, role: "Project Leader / DevOps" },
    { projIdx: 2, user: joseph._id, role: "UI/UX & Frontend" },
    { projIdx: 2, user: vasanth._id, role: "Question Bank Curator" },

    { projIdx: 3, user: vasanth._id, role: "Embedded Systems & Firmware" },
    { projIdx: 3, user: anand._id, role: "Dashboard Developer" },

    { projIdx: 4, user: joseph._id, role: "Project Leader" },
    { projIdx: 4, user: anand._id, role: "WebSocket Specialist" },

    { projIdx: 5, user: anand._id, role: "Lead Architect" },
    { projIdx: 5, user: vasanth._id, role: "Data Pipeline Engineer" },

    { projIdx: 6, user: joseph._id, role: "Product Manager & Lead" },
    { projIdx: 6, user: anand._id, role: "Database Admin" },
  ];

  let membersCreated = 0;
  for (const m of memberAssignments) {
    const targetProj = createdProjects[m.projIdx];
    if (targetProj) {
      const exists = await ProjectMember.findOne({ project: targetProj._id, user: m.user });
      if (!exists) {
        await ProjectMember.create({
          project: targetProj._id,
          user: m.user,
          roleInProject: m.role
        });
        membersCreated++;
      }
    }
  }
  const totalMembers = await ProjectMember.countDocuments();
  console.log(`Created ${membersCreated} project members. Total in DB: ${totalMembers}`);

  // ==========================================
  // 6. CLASSES / ACADEMICS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Classes & Academic Records ---");
  const classDefs = [
    {
      name: "Web Technology (IT301)",
      subject: "Web Technology",
      teacher: chokalingam._id,
      department: itDept._id,
      semester: "Sem 5",
      description: "Full-stack web application development, HTML5, Modern CSS, JavaScript ES6+, React, Express, REST APIs, and NoSQL databases.",
      inviteCode: "WEBTEC5"
    },
    {
      name: "Database Management Systems (IT302)",
      subject: "Database Management Systems",
      teacher: chokalingam._id,
      department: itDept._id,
      semester: "Sem 5",
      description: "Relational modeling, SQL, Normalization, Transaction ACID properties, Query Optimization, and MongoDB Document databases.",
      inviteCode: "DBMS501"
    },
    {
      name: "Artificial Intelligence & Expert Systems (IT303)",
      subject: "Artificial Intelligence",
      teacher: lathi._id,
      department: itDept._id,
      semester: "Sem 5",
      description: "Search algorithms, Knowledge representation, Machine Learning fundamentals, Deep Learning, and Natural Language Processing.",
      inviteCode: "AIEXP50"
    },
    {
      name: "Data Structures and Algorithms (IT201)",
      subject: "Data Structures",
      teacher: lathi._id,
      department: itDept._id,
      semester: "Sem 3",
      description: "Linear & Non-linear data structures, Trees, Heaps, Graphs, Dynamic Programming, and Algorithmic Complexity analysis.",
      inviteCode: "DSA2024"
    },
    {
      name: "Software Engineering & Agile Practices (IT304)",
      subject: "Software Engineering",
      teacher: chokalingam._id,
      department: itDept._id,
      semester: "Sem 5",
      description: "Agile Scrum methodologies, Software Architecture patterns, CI/CD pipelines, Test Driven Development, and Code quality.",
      inviteCode: "SEAGILE"
    }
  ];

  const createdClasses = [];
  for (const c of classDefs) {
    let cls = await AcademicClass.findOne({ inviteCode: c.inviteCode });
    if (!cls) {
      cls = await AcademicClass.create(c);
    } else {
      cls.teacher = c.teacher;
      cls.department = c.department;
      cls.name = c.name;
      cls.subject = c.subject;
      await cls.save();
    }
    createdClasses.push(cls);

    // Enroll students Joseph, Vasanth, Anand
    for (const student of [joseph, vasanth, anand]) {
      await ClassMembership.findOneAndUpdate(
        { academicClass: cls._id, user: student._id },
        { academicClass: cls._id, user: student._id, status: "active" },
        { upsert: true }
      );
    }
  }

  // Create date-wise academic records
  const academicRecordDefs = [
    {
      classIdx: 0,
      date: "2026-10-05",
      creator: chokalingam._id,
      topic: "Introduction to React Hooks and Component Lifecycle",
      notes: "Covered useState, useEffect, and custom hooks. Discussed dependency arrays and memory leak prevention during unmounting.",
      announcement: "Lab assignment 3 is due this Thursday. Submit GitHub repo links.",
      assignment: {
        title: "Build a Dynamic Todo & Filter Component",
        description: "Implement a responsive task tracker with persistent local storage and category filtering using React Hooks.",
        dueDate: "2026-10-15"
      }
    },
    {
      classIdx: 0,
      date: "2026-10-07",
      creator: chokalingam._id,
      topic: "State Management with React Context API & Redux Toolkit",
      notes: "Compared prop drilling with global context. Walked through creating slices, actions, and dispatchers in Redux Toolkit.",
      announcement: "Guest lecture on Microfrontends by alumni next Monday."
    },
    {
      classIdx: 0,
      date: "2026-10-09",
      creator: chokalingam._id,
      topic: "RESTful API Integration with Express and Axios",
      notes: "Configuring Axios interceptors for JWT bearer tokens. Handled global HTTP error states and loading skeletons.",
      assignment: {
        title: "Secure Authentication Flow Implementation",
        description: "Create an Express endpoint with bcrypt hashing and JWT tokens, connected to a React login form.",
        dueDate: "2026-10-18"
      }
    },
    {
      classIdx: 1,
      date: "2026-10-04",
      creator: chokalingam._id,
      topic: "Relational Schema Normalization (1NF, 2NF, 3NF, BCNF)",
      notes: "Solved dependency preservation and lossless join decomposition problem sets on university exam question papers.",
      announcement: "Unit Test 1 marks will be uploaded to the portal by Friday."
    },
    {
      classIdx: 1,
      date: "2026-10-08",
      creator: chokalingam._id,
      topic: "Transaction Management, Concurrency Control, and Two-Phase Locking",
      notes: "Analyzed phantom reads, dirty reads, and serializability. Demonstrated PostgreSQL read committed vs serializable levels."
    },
    {
      classIdx: 1,
      date: "2026-10-10",
      creator: chokalingam._id,
      topic: "MongoDB Aggregation Pipeline Optimization",
      notes: "Deep dive into $lookup subqueries, indexing considerations for sorting and filtering, and memory limits ($allowDiskUse).",
      assignment: {
        title: "Complex Aggregation Query Lab Task",
        description: "Design an analytics pipeline for e-commerce order data grouping by customer tier and monthly revenue.",
        dueDate: "2026-10-20"
      }
    },
    {
      classIdx: 2,
      date: "2026-10-05",
      creator: lathi._id,
      topic: "Informed Search Strategies: A* Algorithm & Heuristic Functions",
      notes: "Mathematical proof of A* optimality when heuristic is admissible and consistent. Simulated 8-puzzle problem state trees."
    },
    {
      classIdx: 2,
      date: "2026-10-08",
      creator: lathi._id,
      topic: "Knowledge Representation: First Order Predicate Logic & Resolution",
      notes: "Converting English sentences to CNF clauses. Applied unification and resolution refutation algorithm.",
      assignment: {
        title: "Implement A* Pathfinding in Python",
        description: "Develop a visual 2D grid pathfinder using Euclidean distance heuristic and compare with Dijkstra algorithm.",
        dueDate: "2026-10-16"
      }
    },
    {
      classIdx: 2,
      date: "2026-10-11",
      creator: lathi._id,
      topic: "Introduction to Artificial Neural Networks & Backpropagation",
      notes: "Perceptron fundamentals, non-linear activation functions (ReLU, Sigmoid), and gradient descent calculus derivations.",
      announcement: "Next week we begin PyTorch hands-on implementation in GPU Lab."
    },
    {
      classIdx: 3,
      date: "2026-10-06",
      creator: lathi._id,
      topic: "Graph Algorithms: Dijkstra's Shortest Path & Prim's MST",
      notes: "Priority queue implementations with Min-Heap. Time complexity O((V + E) log V) breakdown.",
      assignment: {
        title: "Network Routing Simulation Task",
        description: "Calculate shortest delivery paths between campus buildings using Dijkstra algorithm in C++ or Java.",
        dueDate: "2026-10-17"
      }
    },
    {
      classIdx: 4,
      date: "2026-10-07",
      creator: chokalingam._id,
      topic: "Agile Scrum Ceremonies, Sprint Planning, and User Stories",
      notes: "Formulating INVEST user stories with acceptance criteria. Demonstrated Jira and GitHub Projects sprint boards.",
      announcement: "Capstone project phase 1 review meeting scheduled next Tuesday."
    }
  ];

  let recordsCreated = 0;
  for (const r of academicRecordDefs) {
    const targetClass = createdClasses[r.classIdx];
    const exists = await AcademicRecord.findOne({
      academicClass: targetClass._id,
      date: r.date,
      topic: r.topic
    });
    if (!exists) {
      await AcademicRecord.create({
        academicClass: targetClass._id,
        date: r.date,
        creator: r.creator,
        topic: r.topic,
        notes: r.notes,
        announcement: r.announcement,
        assignment: r.assignment
      });
      recordsCreated++;
    }
  }
  const totalRecords = await AcademicRecord.countDocuments();
  console.log(`Created ${recordsCreated} academic records. Total in DB: ${totalRecords}`);

  // ==========================================
  // 7. MENTORSHIP (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Mentorships, Requests & Workspaces ---");
  const mentorRequestDefs = [
    {
      requester: joseph._id,
      mentor: chokalingam._id,
      project: createdProjects[0]._id,
      requestType: "group",
      groupName: createdProjects[0].title,
      goals: "Guidance on enterprise software architecture, scalable API security, and database indexing for high concurrency.",
      message: "Respected Sir, our team would be honored to have your mentorship for the Smart Campus Management project.",
      requestedDuration: 60,
      status: "accepted"
    },
    {
      requester: vasanth._id,
      mentor: lathi._id,
      project: createdProjects[1]._id,
      requestType: "individual",
      goals: "Assistance with evaluating BERT vs Llama embeddings, fine-tuning hyperparameters, and GPU inference optimization.",
      message: "Respected Madam, seeking your guidance on optimizing vector retrieval accuracy for our AI Study Assistant project.",
      requestedDuration: 45,
      status: "accepted"
    },
    {
      requester: anand._id,
      mentor: vijay._id,
      project: createdProjects[2]._id,
      requestType: "group",
      groupName: createdProjects[2].title,
      goals: "Industry feedback on placement preparation patterns, code review workflows, and career roadmaps.",
      message: "Hi Vijay Anna, would love your mentorship on structuring mock technical interviews and industry-standard coding roadmaps.",
      requestedDuration: 50,
      status: "accepted"
    },
    {
      requester: joseph._id,
      mentor: infhant._id,
      project: createdProjects[4]._id,
      requestType: "individual",
      goals: "System design architecture, microservice decoupling, and real-time messaging using Socket.io.",
      message: "Hello Infhant Anna, requesting your technical mentorship for designing scalable student-alumni networking pipelines.",
      requestedDuration: 60,
      status: "accepted"
    },
    {
      requester: vasanth._id,
      mentor: chokalingam._id,
      project: createdProjects[3]._id,
      requestType: "group",
      groupName: createdProjects[3].title,
      goals: "Hardware-to-cloud MQTT broker integration and low-latency data streaming pipelines.",
      message: "Respected Sir, requesting guidance on IoT sensor data persistence and classroom automation scheduling.",
      requestedDuration: 30,
      status: "accepted"
    },
    {
      requester: anand._id,
      mentor: lathi._id,
      project: createdProjects[5]._id,
      requestType: "individual",
      goals: "Optimizing search indexes with Elasticsearch and OCR parsing of technical journals.",
      message: "Respected Madam, seeking feedback on finalizing the thesis document and search evaluation metrics.",
      requestedDuration: 40,
      status: "accepted"
    },
    {
      requester: joseph._id,
      mentor: vijay._id,
      project: createdProjects[6]._id,
      requestType: "individual",
      goals: "Frontend state synchronization and mobile responsive UI best practices.",
      message: "Hi Vijay Anna, would appreciate code reviews on our component design patterns and error handling.",
      requestedDuration: 30,
      status: "pending"
    },
    {
      requester: vasanth._id,
      mentor: infhant._id,
      project: createdProjects[7]._id,
      requestType: "group",
      groupName: createdProjects[7].title,
      goals: "Scalable team matchmaking algorithms and hackathon project scaffolding.",
      message: "Hello Infhant Anna, would love your guidance on architecting real-time collaboration tools for hackathon teams.",
      requestedDuration: 45,
      status: "pending"
    },
    {
      requester: anand._id,
      mentor: chokalingam._id,
      project: createdProjects[8]._id,
      requestType: "group",
      groupName: createdProjects[8].title,
      goals: "Database normalization for equipment checkout logs and QR code authentication.",
      message: "Respected Sir, requesting mentorship for laboratory asset tracking system validation.",
      requestedDuration: 30,
      status: "pending"
    },
    {
      requester: joseph._id,
      mentor: lathi._id,
      project: createdProjects[9]._id,
      requestType: "individual",
      goals: "Peer review metrics and algorithmic scoring of community-contributed study guides.",
      message: "Respected Madam, seeking advice on academic integrity verification for student study materials.",
      requestedDuration: 30,
      status: "accepted"
    }
  ];

  let mentorReqsCreated = 0;
  for (const m of mentorRequestDefs) {
    let req = await MentorRequest.findOne({
      requester: m.requester,
      mentor: m.mentor,
      project: m.project
    });
    if (!req) {
      req = await MentorRequest.create(m);
      mentorReqsCreated++;
    }

    // If accepted, ensure Mentorship & Workspace exist
    if (m.status === "accepted") {
      let mentorship = await Mentorship.findOne({ request: req._id });
      if (!mentorship) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + m.requestedDuration * 86400000);
        mentorship = await Mentorship.create({
          mentor: m.mentor,
          mentee: m.requester,
          project: m.project,
          requestType: m.requestType,
          groupName: m.groupName,
          request: req._id,
          status: "active",
          startDate,
          endDate,
          durationDays: m.requestedDuration
        });
      }

      // Ensure Workspace exists
      const existingWs = await Workspace.findOne({ project: m.project });
      if (!existingWs) {
        await Workspace.create({
          project: m.project,
          mentor: m.mentor,
          startDate: new Date(),
          endDate: new Date(Date.now() + m.requestedDuration * 86400000),
          meetingLink: "https://meet.google.com/nec-mentorship-" + Math.floor(1000 + Math.random() * 9000),
          status: "active"
        });
      }
    }
  }
  const totalMentorReqs = await MentorRequest.countDocuments();
  const totalMentorships = await Mentorship.countDocuments();
  const totalWorkspaces = await Workspace.countDocuments();
  console.log(`Mentor Requests: ${totalMentorReqs}, Active Mentorships: ${totalMentorships}, Workspaces: ${totalWorkspaces}`);

  // ==========================================
  // 8. MESSAGES (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Messages ---");
  const messageDefs = [
    {
      sender: joseph._id,
      recipient: chokalingam._id,
      text: "Good morning Sir, we have pushed the latest updates for the Smart Campus portal API endpoints. Could you please review when you have time?",
      isRead: true
    },
    {
      sender: chokalingam._id,
      recipient: joseph._id,
      text: "Good morning Joseph. I reviewed the routes; please ensure you sanitize user query parameters before passing them to the aggregation pipeline.",
      isRead: true
    },
    {
      sender: vasanth._id,
      recipient: lathi._id,
      text: "Respected Madam, the validation accuracy on our custom dataset reached 92.4% with the new learning rate schedule.",
      isRead: true
    },
    {
      sender: lathi._id,
      recipient: vasanth._id,
      text: "That is great news Vasanth. Let us prepare the confusion matrix and loss curves for our review session on Wednesday.",
      isRead: true
    },
    {
      sender: anand._id,
      recipient: vijay._id,
      text: "Hi Vijay Anna! How should we approach system design questions for 3rd year internship assessments?",
      isRead: true
    },
    {
      sender: vijay._id,
      recipient: anand._id,
      text: "Hey Anand! Focus first on understanding requirements, estimating scale (QPS/storage), choosing between SQL and NoSQL, and caching strategy. Keep solutions simple before scaling.",
      isRead: true
    },
    {
      sender: joseph._id,
      recipient: vasanth._id,
      text: "Hey Vasanth, are you free this evening? Let's connect on Google Meet to integrate the sentiment model API with the frontend client.",
      isRead: true
    },
    {
      sender: vasanth._id,
      recipient: joseph._id,
      text: "Sure Joseph! I have wrapped the model inference inside a FastAPI microservice on port 8000. Will share the Swagger doc link.",
      isRead: true
    },
    {
      sender: anand._id,
      recipient: joseph._id,
      text: "Joseph, the Docker Compose configuration for our campus services is ready. We can run MongoDB, Express, and Redis with a single command.",
      isRead: true
    },
    {
      sender: joseph._id,
      recipient: infhant._id,
      text: "Hello Infhant Anna, thank you for accepting our mentorship request! We are excited to learn industry best practices from your experience at Zoho.",
      isRead: true
    },
    {
      sender: infhant._id,
      recipient: joseph._id,
      text: "Welcome Joseph! Happy to help our NEC juniors. Let's schedule a kickoff call this weekend to review your architecture roadmap.",
      isRead: true
    },
    {
      sender: vijay._id,
      recipient: infhant._id,
      text: "Hey Infhant, great to see you active on conNECt! The student projects this year are genuinely impressive.",
      isRead: true
    }
  ];

  let messagesCreated = 0;
  for (const m of messageDefs) {
    const exists = await Message.findOne({
      sender: m.sender,
      recipient: m.recipient,
      text: m.text
    });
    if (!exists) {
      await Message.create(m);
      messagesCreated++;
    }
  }
  const totalMessages = await Message.countDocuments();
  console.log(`Created ${messagesCreated} new messages. Total in DB: ${totalMessages}`);

  // ==========================================
  // 9. NOTIFICATIONS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Notifications ---");
  const notificationDefs = [
    {
      user: joseph._id,
      type: "connection_response",
      title: "Connection Request Accepted",
      message: "Vasantha Kumar accepted your connection request.",
      relatedId: vasanth._id,
      isRead: true
    },
    {
      user: joseph._id,
      type: "mentor_response",
      title: "Mentor Request Accepted",
      message: "Prof. Chokalingam accepted your mentorship request for Smart Campus Management System.",
      relatedId: createdProjects[0]._id,
      isRead: true
    },
    {
      user: vasanth._id,
      type: "mentor_response",
      title: "Mentor Request Accepted",
      message: "Dr. Lathi accepted your mentorship request for AI Student Study Assistant.",
      relatedId: createdProjects[1]._id,
      isRead: true
    },
    {
      user: anand._id,
      type: "connection_response",
      title: "Connection Request Accepted",
      message: "Vijay (Alumni) accepted your connection request.",
      relatedId: vijay._id,
      isRead: true
    },
    {
      user: chokalingam._id,
      type: "mentor_request",
      title: "New Mentorship Request",
      message: "Joseph submitted a mentorship request for Smart Campus Management System.",
      relatedId: createdProjects[0]._id,
      isRead: true
    },
    {
      user: lathi._id,
      type: "mentor_request",
      title: "New Mentorship Request",
      message: "Vasantha Kumar submitted a mentorship request for AI Student Study Assistant.",
      relatedId: createdProjects[1]._id,
      isRead: true
    },
    {
      user: joseph._id,
      type: "comment",
      title: "New Comment on your Post",
      message: "Prof. Chokalingam commented on your post about React 19 server components.",
      relatedId: createdPosts[0]?._id,
      isRead: false
    },
    {
      user: vasanth._id,
      type: "comment",
      title: "New Comment on your Post",
      message: "Dr. Lathi commented on your post regarding BERT sentiment model accuracy.",
      relatedId: createdPosts[1]?._id,
      isRead: false
    },
    {
      user: joseph._id,
      type: "announcement",
      title: "Class Activity Scheduled",
      message: "Web Technology (IT301): New laboratory assignment on React Hooks has been posted.",
      relatedId: createdClasses[0]._id,
      isRead: false
    },
    {
      user: anand._id,
      type: "message",
      title: "New Message Received",
      message: "Vijay sent you guidance regarding system design interview preparation.",
      relatedId: vijay._id,
      isRead: false
    },
    {
      user: balamurugan._id,
      type: "announcement",
      title: "Platform Activity Summary",
      message: "Active semester registrations: 5 academic classes configured with 10+ student collaborations.",
      isRead: false
    },
    {
      user: infhant._id,
      type: "connection_request",
      title: "New Connection Request",
      message: "Joseph sent you a connection request.",
      relatedId: joseph._id,
      isRead: true
    }
  ];

  let notifsCreated = 0;
  for (const n of notificationDefs) {
    const exists = await Notification.findOne({
      user: n.user,
      title: n.title,
      message: n.message
    });
    if (!exists) {
      await Notification.create(n);
      notifsCreated++;
    }
  }
  const totalNotifs = await Notification.countDocuments();
  console.log(`Created ${notifsCreated} notifications. Total in DB: ${totalNotifs}`);

  // ==========================================
  // 10. ACHIEVEMENTS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Achievements ---");
  const achievementDefs = [
    {
      user: joseph._id,
      title: "Smart India Hackathon 2025 - College Level Winner",
      category: "Hackathon",
      organization: "Ministry of Education & NEC Innovation Cell",
      position: "1st Place Winner",
      date: new Date("2025-11-20"),
      description: "Developed an AI-driven digital healthcare triage portal for rural primary health centres."
    },
    {
      user: joseph._id,
      title: "National Level Web Development Hackathon",
      category: "Coding Competition",
      organization: "NIT Trichy Fest",
      position: "Runner-up",
      date: new Date("2026-02-14"),
      description: "Built a high-performance offline-first PWA for emergency disaster relief communication."
    },
    {
      user: vasanth._id,
      title: "Best Research Paper Award - Emerging AI Systems",
      category: "Paper Presentation",
      organization: "IEEE Madras Section",
      position: "Best Paper Award",
      date: new Date("2026-01-28"),
      description: "Presented research paper titled 'Optimizing Quantized Transformer Models for Edge Inference'."
    },
    {
      user: vasanth._id,
      title: "Kaggle Community Competition Top 5% Rank",
      category: "Technical Competition",
      organization: "Kaggle Global Data Science",
      position: "Top 5% Gold Tier",
      date: new Date("2025-12-10"),
      description: "Achieved top 5% rank in multi-label biomedical text classification using ensemble architectures."
    },
    {
      user: anand._id,
      title: "AWS Certified Cloud Practitioner (CLF-C02)",
      category: "Certification",
      organization: "Amazon Web Services (AWS)",
      position: "Certified",
      date: new Date("2026-03-01"),
      description: "Validated comprehensive expertise in cloud architecture, IAM security, and serverless compute."
    },
    {
      user: anand._id,
      title: "State Level Inter-Collegiate Coding Marathon",
      category: "Coding Competition",
      organization: "PSG College of Technology",
      position: "3rd Place",
      date: new Date("2025-10-15"),
      description: "Competed in speed algorithms covering graph traversal, segment trees, and dynamic programming."
    },
    {
      user: infhant._id,
      title: "Zoho Product Innovation & Engineering Excellence Award",
      category: "Award/Prize",
      organization: "Zoho Corporation",
      position: "Annual Engineering Award",
      date: new Date("2025-08-15"),
      description: "Recognized for architecting zero-downtime database migration tooling across high-volume services."
    },
    {
      user: infhant._id,
      title: "NEC Alumni Distinguished Contributor 2025",
      category: "Award/Prize",
      organization: "National Engineering College Alumni Association",
      position: "Distinguished Alumnus",
      date: new Date("2025-12-25"),
      description: "Honored for conducting university open-source workshops and mentoring over 100 students."
    },
    {
      user: vijay._id,
      title: "Freshworks HackDay - Best Customer Experience Tool",
      category: "Hackathon",
      organization: "Freshworks Inc.",
      position: "1st Place Winner",
      date: new Date("2025-09-18"),
      description: "Built automated customer sentiment analytics widget embedded inside helpdesk workspaces."
    },
    {
      user: vijay._id,
      title: "Oracle Certified Professional: Java SE 17 Developer",
      category: "Certification",
      organization: "Oracle University",
      position: "Certified Professional",
      date: new Date("2024-05-10"),
      description: "Demonstrated advanced mastery in JVM concurrency, modern streams API, and modular architecture."
    },
    {
      user: joseph._id,
      title: "Full Stack Summer Internship Completion",
      category: "Internship Achievement",
      organization: "Kovai.co Technologies",
      position: "Distinction",
      date: new Date("2025-07-30"),
      description: "Successfully built and deployed enterprise webhook monitoring dashboard during 8-week summer internship."
    }
  ];

  let achievementsCreated = 0;
  for (const a of achievementDefs) {
    const exists = await Achievement.findOne({
      user: a.user,
      title: a.title
    });
    if (!exists) {
      await Achievement.create(a);
      achievementsCreated++;
    }
  }
  const totalAchievements = await Achievement.countDocuments();
  console.log(`Created ${achievementsCreated} achievements. Total in DB: ${totalAchievements}`);

  // ==========================================
  // 11. HELP REQUESTS & OFFERS (Minimum 10 records)
  // ==========================================
  console.log("\n--- Seeding Help Requests & Offers ---");
  const helpRequestDefs = [
    {
      requester: joseph._id,
      title: "Debugging MongoDB Aggregation $lookup join on ObjectId arrays",
      subject: "Database Management Systems",
      topic: "Aggregation Pipeline",
      description: "Having difficulty unwinding and joining foreign keys when storing array of ObjectIds in a sub-document. Need guidance on pipeline stages.",
      helpNeeded: "Code Debugging & Query Optimization",
      status: "in_progress",
      acceptedHelper: chokalingam._id,
      deadline: new Date(Date.now() + 5 * 86400000)
    },
    {
      requester: vasanth._id,
      title: "PyTorch DataLoader CUDA out-of-memory error during batch evaluation",
      subject: "Artificial Intelligence",
      topic: "Deep Learning Memory Management",
      description: "When running validation on batch size 32 with BERT-large, GPU VRAM hits 100% and crashes. Need advice on gradient accumulation or torch.no_grad().",
      helpNeeded: "Troubleshooting & Code Review",
      status: "in_progress",
      acceptedHelper: lathi._id,
      deadline: new Date(Date.now() + 4 * 86400000)
    },
    {
      requester: anand._id,
      title: "Configuring Docker container reverse proxy with Nginx and SSL certificates",
      subject: "Web Technology",
      topic: "DevOps & Deployment",
      description: "Trying to set up reverse proxy forwarding to port 5005 for backend API while serving static build files on port 80. Need sample nginx.conf.",
      helpNeeded: "Configuration Guidance",
      status: "completed",
      acceptedHelper: vijay._id,
      completionConfirmed: true,
      deadline: new Date(Date.now() - 2 * 86400000)
    },
    {
      requester: joseph._id,
      title: "Understanding Redux Toolkit createAsyncThunk lifecycle handling",
      subject: "Web Technology",
      topic: "React State Management",
      description: "Want to handle rejected promises and display custom toast notifications globally across all API requests without repetitive try-catch blocks.",
      helpNeeded: "Architecture Guidance",
      status: "open",
      deadline: new Date(Date.now() + 7 * 86400000)
    },
    {
      requester: vasanth._id,
      title: "Feature engineering tips for time-series student attendance data",
      subject: "Artificial Intelligence",
      topic: "Predictive Analytics",
      description: "Need guidance on rolling window aggregations and lag features for predicting student dropouts before semester finals.",
      helpNeeded: "Data Analysis & Methodology",
      status: "open",
      deadline: new Date(Date.now() + 8 * 86400000)
    },
    {
      requester: anand._id,
      title: "Clarification on B-Tree vs Hash Index performance in PostgreSQL",
      subject: "Database Management Systems",
      topic: "Database Indexing",
      description: "Need help understanding why equality searches sometimes prefer index scan over bitmap index scan depending on table statistics.",
      helpNeeded: "Concept Explanation",
      status: "completed",
      acceptedHelper: chokalingam._id,
      completionConfirmed: true,
      deadline: new Date(Date.now() - 3 * 86400000)
    },
    {
      requester: joseph._id,
      title: "Setting up automated GitHub Actions workflow for pull request linting",
      subject: "Software Engineering",
      topic: "CI/CD Automation",
      description: "Need help creating a GitHub workflow that runs ESLint and automated Jest unit tests on every pull request to main branch.",
      helpNeeded: "CI/CD Setup Assistance",
      status: "open",
      deadline: new Date(Date.now() + 6 * 86400000)
    },
    {
      requester: vasanth._id,
      title: "Guidance on writing literature review for IEEE student conference paper",
      subject: "Artificial Intelligence",
      topic: "Technical Paper Writing",
      description: "Looking for advice on synthesizing previous research work and highlighting novel contributions in academic format.",
      helpNeeded: "Review & Feedback",
      status: "in_progress",
      acceptedHelper: lathi._id,
      deadline: new Date(Date.now() + 10 * 86400000)
    },
    {
      requester: anand._id,
      title: "Mock interview practice for Product-Based company technical rounds",
      subject: "Placement Preparation",
      topic: "Coding & System Design",
      description: "Seeking a 30-minute mock interview session with alumni to practice data structures and live problem problem solving explanation.",
      helpNeeded: "Mock Interview & Mentorship",
      status: "in_progress",
      acceptedHelper: infhant._id,
      deadline: new Date(Date.now() + 9 * 86400000)
    },
    {
      requester: joseph._id,
      title: "Implementing WebSocket heartbeats and reconnection handling in React",
      subject: "Web Technology",
      topic: "Real-time Communication",
      description: "Our chat connection drops during network changes. Need code pattern for auto-reconnection with exponential backoff.",
      helpNeeded: "Code Debugging & Pattern Advice",
      status: "completed",
      acceptedHelper: vijay._id,
      completionConfirmed: true,
      deadline: new Date(Date.now() - 5 * 86400000)
    }
  ];

  let helpCreated = 0;
  for (const h of helpRequestDefs) {
    const exists = await HelpRequest.findOne({
      requester: h.requester,
      title: h.title
    });
    let hrDoc = exists;
    if (!exists) {
      hrDoc = await HelpRequest.create(h);
      helpCreated++;
    }

    // Create HelpOffer if helper exists
    if (h.acceptedHelper) {
      await HelpOffer.findOneAndUpdate(
        { helpRequest: hrDoc._id, helper: h.acceptedHelper },
        {
          helpRequest: hrDoc._id,
          helper: h.acceptedHelper,
          message: "I can help you review and solve this issue.",
          status: "accepted"
        },
        { upsert: true }
      );
    }
  }
  const totalHelpRequests = await HelpRequest.countDocuments();
  console.log(`Created ${helpCreated} help requests. Total in DB: ${totalHelpRequests}`);

  console.log("\n==================================================");
  console.log("DEMO DATA SEEDING COMPLETE!");
  console.log("==================================================");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});

import os, subprocess

ASSETS_DIR = r"d:\CONNECT\conNECt\report_assets"
HTML_FILE = r"d:\CONNECT\conNECt\report.html"
PDF_FILE = r"d:\CONNECT\conNECt\conNECt_Project_Report_INFHANT_JOSEPH_T.pdf"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Function to get file url or base64
def get_path(filename):
    return os.path.join(ASSETS_DIR, filename).replace("\\", "/")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>conNECt - Project Report</title>
  <style>
    @page {{
      size: A4;
      margin: 0;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}
    body {{
      margin: 0;
      padding: 0;
      font-family: "Times New Roman", Times, serif;
      color: #000000;
      background: #ffffff;
      font-size: 12pt;
      line-height: 1.6;
    }}
    .page {{
      width: 210mm;
      height: 297mm;
      padding: 24mm 22mm 22mm 22mm;
      position: relative;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
      background: #ffffff;
    }}
    .page-num {{
      position: absolute;
      bottom: 12mm;
      right: 22mm;
      font-size: 11pt;
      color: #000000;
    }}
    
    /* Cover Page */
    .cover-page {{
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }}
    .cover-title {{
      font-size: 18pt;
      font-weight: bold;
      letter-spacing: 0.5px;
      margin-bottom: 15px;
      text-transform: uppercase;
      line-height: 1.4;
    }}
    .cover-course {{
      font-size: 13pt;
      font-weight: bold;
      margin-bottom: 25px;
    }}
    .cover-report {{
      font-size: 14pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 25px;
      text-transform: uppercase;
    }}
    .cover-sub-by {{
      font-size: 12pt;
      font-style: italic;
      margin-bottom: 15px;
    }}
    .cover-name {{
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 25px;
      letter-spacing: 0.5px;
    }}
    .cover-degree {{
      font-size: 12pt;
      font-style: italic;
      line-height: 1.8;
      margin-bottom: 20px;
    }}
    .cover-degree strong {{
      font-style: normal;
      font-size: 13pt;
      text-transform: uppercase;
    }}
    .cover-logo {{
      width: 105px;
      height: auto;
      margin: 10px auto;
      display: block;
    }}
    .cover-college {{
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      line-height: 1.4;
      margin-top: 5px;
    }}
    .cover-autonomous {{
      font-size: 11pt;
      font-weight: normal;
      margin-top: 4px;
    }}
    .cover-address {{
      font-size: 11pt;
      font-weight: bold;
      margin-top: 6px;
    }}
    .cover-date {{
      font-size: 12pt;
      font-weight: bold;
      margin-top: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}

    /* Bonafide Certificate */
    .bonafide-header {{
      text-align: center;
      line-height: 1.4;
      margin-bottom: 20px;
    }}
    .bonafide-header h2 {{
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }}
    .bonafide-header p {{
      font-size: 11pt;
      margin: 3px 0;
    }}
    .bonafide-title {{
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 25px 0 30px 0;
    }}
    .bonafide-body {{
      text-align: justify;
      font-size: 12pt;
      line-height: 1.8;
      margin-bottom: 60px;
      text-indent: 40px;
    }}
    .bonafide-signatures {{
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      font-size: 12pt;
      font-weight: bold;
    }}
    .bonafide-viva {{
      margin-top: 40px;
      font-size: 11.5pt;
      line-height: 1.6;
    }}

    /* Table of Contents */
    .toc-title {{
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 25px;
      letter-spacing: 1px;
    }}
    .toc-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 11pt;
    }}
    .toc-table th, .toc-table td {{
      border: 1px solid #000000;
      padding: 9px 12px;
    }}
    .toc-table th {{
      text-align: center;
      font-weight: bold;
      background: #f8fafc;
    }}
    .toc-table td.center {{
      text-align: center;
    }}
    .toc-table td.title {{
      font-weight: 500;
    }}

    /* Chapter Headings */
    .chap-num {{
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 8px;
    }}
    .chap-title {{
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 25px;
      letter-spacing: 0.5px;
    }}
    p.para {{
      text-align: justify;
      text-indent: 30px;
      margin-bottom: 16px;
      line-height: 1.65;
    }}
    ul.bullet-list {{
      margin: 10px 0 15px 25px;
      padding: 0;
      line-height: 1.65;
    }}
    ul.bullet-list li {{
      margin-bottom: 10px;
      text-align: justify;
    }}

    /* Table Structures (Schemas) */
    .schema-title {{
      font-weight: bold;
      font-size: 11.5pt;
      margin: 15px 0 6px 0;
    }}
    .schema-desc {{
      font-style: italic;
      font-size: 10pt;
      margin-bottom: 8px;
      color: #334155;
    }}
    .data-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      margin-bottom: 16px;
    }}
    .data-table th, .data-table td {{
      border: 1px solid #94a3b8;
      padding: 5px 7px;
    }}
    .data-table th {{
      background: #e2e8f0;
      text-align: left;
      font-weight: bold;
      color: #0f172a;
    }}
    .data-table td.code {{
      font-family: Consolas, monospace;
      font-size: 9pt;
    }}

    /* Figures & Screenshots */
    .figure-container {{
      text-align: center;
      margin: 10px auto;
    }}
    .figure-img {{
      max-width: 95%;
      max-height: 145mm;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: block;
      margin: 0 auto;
    }}
    .figure-img-wide {{
      width: 98%;
      max-height: 140mm;
      object-fit: contain;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
    }}
    .figure-caption {{
      font-weight: bold;
      font-size: 10pt;
      margin-top: 8px;
      margin-bottom: 12px;
      text-align: center;
      color: #0f172a;
    }}
    .module-desc {{
      text-align: justify;
      font-size: 11pt;
      line-height: 1.55;
      margin-bottom: 10px;
    }}
    .sub-head {{
      font-weight: bold;
      font-size: 12pt;
      margin: 12px 0 6px 0;
    }}
  </style>
</head>
<body>

  <!-- ============================================================== -->
  <!-- PAGE 1: COVER PAGE                                             -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="cover-page">
      <div>
        <div class="cover-title">conNECt - CAMPUS COLLABORATION &amp; NETWORKING PORTAL</div>
        <div class="cover-course">23IT53C - MODERN WEB TECHNOLOGIES</div>
        <div class="cover-report">PROJECT REPORT</div>
        <div class="cover-sub-by">Submitted by</div>
        <div class="cover-name">INFHANT JOSEPH T &nbsp;&nbsp;&nbsp;&nbsp; 2403957620521052</div>
        <div class="cover-degree">
          In partial fulfillment for the award of the degree<br>
          of<br>
          <strong>BACHELOR OF TECHNOLOGY</strong><br>
          in<br>
          <strong>INFORMATION TECHNOLOGY</strong>
        </div>
      </div>

      <div>
        <img class="cover-logo" src="{get_path('nec_logo.jpeg')}" alt="National Engineering College Logo">
        <div class="cover-college">NATIONAL ENGINEERING COLLEGE</div>
        <div class="cover-autonomous">(An Autonomous Institution affiliated to Anna University, Chennai)</div>
        <div class="cover-address">K.R.NAGAR, KOVILPATTI - 628503</div>
        <div class="cover-date">OCTOBER - 2025</div>
      </div>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 2: BONAFIDE CERTIFICATE                                   -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="bonafide-header">
      <h2>NATIONAL ENGINEERING COLLEGE</h2>
      <p>(An Autonomous Institution affiliated to Anna University, Chennai)</p>
      <p style="font-weight: bold;">K.R.NAGAR, KOVILPATTI - 628503</p>
      <img src="{get_path('nec_logo.jpeg')}" style="width: 85px; margin: 12px auto; display: block;" alt="NEC Logo">
    </div>

    <div class="bonafide-title">BONAFIDE CERTIFICATE</div>

    <div class="bonafide-body">
      This is to certify that this project report, <strong>“conNECt - Campus Collaboration &amp; Networking Portal”</strong>, is the bonafide work of <strong>INFHANT JOSEPH T (24205052)</strong> who carried out the project work under my supervision.
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 50px;">
      <div style="text-align: center; width: 250px;">
        <div style="height: 40px;"></div>
        <strong>Course Instructor / Guide</strong>
      </div>
    </div>

    <div class="bonafide-viva">
      Submitted to the <strong>23IT53C - MODERN WEB TECHNOLOGIES</strong> Viva-Voce examination held at National Engineering College, K.R.Nagar, Kovilpatti on ___________________
    </div>

    <div class="bonafide-signatures" style="margin-top: 70px;">
      <div>Internal Examiner</div>
      <div>Co Examiner</div>
    </div>

    <div class="page-num">1</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 3: TABLE OF CONTENTS                                      -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="toc-title">TABLE OF CONTENTS</div>

    <table class="toc-table">
      <thead>
        <tr>
          <th style="width: 15%;">CH NO</th>
          <th style="width: 70%;">TITLE</th>
          <th style="width: 15%;">PAGE NO</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="center">1</td><td class="title">INTRODUCTION</td><td class="center">3</td></tr>
        <tr><td class="center">2</td><td class="title">OBJECTIVES</td><td class="center">4</td></tr>
        <tr><td class="center">3</td><td class="title">DESCRIPTION</td><td class="center">5</td></tr>
        <tr><td class="center">4</td><td class="title">CLASS DIAGRAM</td><td class="center">6</td></tr>
        <tr><td class="center">5</td><td class="title">TABLE STRUCTURES</td><td class="center">7</td></tr>
        <tr><td class="center">6</td><td class="title">ER DIAGRAM</td><td class="center">11</td></tr>
        <tr><td class="center">7</td><td class="tech">TECH STACK</td><td class="center">12</td></tr>
        <tr><td class="center">8</td><td class="title">MODULES</td><td class="center">13</td></tr>
        <tr><td class="center">9</td><td class="title">CONCLUSION</td><td class="center">28</td></tr>
      </tbody>
    </table>

    <div class="page-num">2</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 4: CHAPTER 1 - INTRODUCTION                               -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 1</div>
    <div class="chap-title">INTRODUCTION</div>

    <p class="para">
      The <strong>conNECt Campus Collaboration &amp; Networking Portal</strong> is an integrated web-based social and academic platform developed specifically for National Engineering College (NEC), Kovilpatti. It is designed to replace fragmented communication channels and manual academic workflows by creating a unified digital campus ecosystem for students, faculty members, alumni, and platform administrators. Built on the modern MERN stack (MongoDB, Express.js, React.js, and Node.js) paired with Vite and Tailwind CSS, conNECt establishes a secure, high-performance community space that promotes peer networking, cross-batch knowledge sharing, and academic mentorship.
    </p>

    <p class="para">
      The platform supports four specialized user roles: <strong>Student</strong>, <strong>Faculty</strong>, <strong>Alumni</strong>, and <strong>Admin</strong>, each configured with specific interface layouts, access privileges, and workflows. Students can share technical updates, collaborate on semester projects, join academic subject classrooms, seek guidance through structured help requests, and connect with faculty and alumni mentors. Faculty members can manage dedicated course classrooms, post date-wise lecture summaries, share study materials and assignments, and supervise capstone student projects. Alumni can maintain lasting bonds with their alma mater, share career wisdom, review junior projects, and participate in one-on-one mentorship sessions.
    </p>

    <p class="para">
      Administrators are provided with a centralized governance dashboard to supervise platform activities, review analytics across academic departments, verify new student and alumni credentials, manage user roles, and moderate feedback. Real-time event notifications and persistent socket-based direct messaging keep the entire campus community seamlessly connected, while JWT-based role authorization guarantees data protection across all API endpoints.
    </p>

    <p class="para">
      The conNECt portal significantly improves student engagement, bridges the gap between active learners and seasoned alumni in the industry, and simplifies academic administrative overhead. Its responsive, glassmorphic user interface delivers an intuitive experience across mobile devices, tablets, and desktop computers, providing National Engineering College with a future-proof collaborative network.
    </p>

    <div class="page-num">3</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 5: CHAPTER 2 - OBJECTIVES                                 -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 2</div>
    <div class="chap-title">OBJECTIVES</div>

    <ul class="bullet-list">
      <li>To provide robust role-based authentication and authorization (RBAC) ensuring secure and tailored access for Students, Faculty, Alumni, and Administrators.</li>
      <li>To maintain a centralized MongoDB database for storing user credentials, academic classrooms, student projects, mentorship requests, real-time chats, and notifications.</li>
      <li>To develop an interactive Campus Feed that allows students, faculty, and alumni to post technical updates, share research achievements, upload media, and engage via comments and likes.</li>
      <li>To create dedicated Academic Classrooms where faculty members can publish date-wise lecture summaries, study materials, announcements, and track assignment tasks.</li>
      <li>To implement an end-to-end Project Incubator module enabling students to propose capstone ideas, form multidisciplinary teams, track development stages, and request faculty or alumni mentors.</li>
      <li>To establish a formal Mentorship Lifecycle featuring duration-based mentor requests, accept/reject workflows, and dedicated collaboration workspaces with Google Meet integrations.</li>
      <li>To develop a real-time Direct Messaging and communication facility using WebSockets to support instant peer-to-peer dialogues, faculty clarifications, and alumni career guidance.</li>
      <li>To build an Academic Help Request system where students can broadcast targeted questions regarding programming, database queries, and lab exercises to peer helpers.</li>
      <li>To facilitate Alumni Transition &amp; Networking, allowing graduates to showcase their corporate roles, share industry insights, and preserve college memories.</li>
      <li>To deliver an Administrative Management Dashboard for managing user verification status, monitoring department activity metrics, and moderating community suggestions.</li>
      <li>To implement secure credential handling, bcrypt password hashing, JWT token verification, and React Protected Routes to prevent unauthorized endpoint access.</li>
      <li>To provide a responsive, aesthetic user interface using Tailwind CSS and Vite that guarantees fast loading times, clean micro-interactions, and accessibility across devices.</li>
    </ul>

    <div class="page-num">4</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 6: CHAPTER 3 - DESCRIPTION                                -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 3</div>
    <div class="chap-title">DESCRIPTION</div>

    <p class="para">
      The conNECt Campus Collaboration &amp; Networking Portal operates as a centralized web service built to bridge the gap between academic learning and professional networking within National Engineering College. Traditional institutional portals often treat learning management and social interaction as completely disconnected utilities. conNECt integrates both aspects into a single, cohesive web platform where curricular activities, project incubations, and career mentorship reinforce one another naturally.
    </p>

    <p class="para">
      Upon accessing the portal, users encounter a role-aware authentication page where they can sign in as Student, Faculty, or Alumni using institutional credentials (@nec.edu.in) or verified emails. Once authenticated, the system evaluates their role in the database and renders the appropriate dashboard layout. Students are greeted with an overview of enrolled classes, ongoing project collaborations, and trending campus discussions. Faculty members access course management tools, student rosters, and incoming mentorship requests. Alumni are provided with corporate collaboration channels, junior mentorship queues, and college memories.
    </p>

    <p class="para">
      The project collaboration module allows students to publish capstone ideas, specify required tech stacks (e.g., React, Node.js, Python), and invite teammates. Once formed, the team can submit formal mentorship requests to faculty or alumni specialists. Mentors can review project goals, accept requests with customized durations (e.g., 30, 60 days), and collaborate within shared workspaces equipped with progress trackers and discussion threads.
    </p>

    <p class="para">
      Data security and integrity are enforced across every transaction. The backend API is constructed using Express.js and modular MVC architecture, utilizing Mongoose ODM to enforce schema validation and referential integrity across MongoDB collections. Sensitive operations such as user verification and role modification are strictly restricted to authenticated platform administrators. Real-time event notifications ensure users are immediately alerted when connection requests are accepted, new classroom assignments are posted, or mentorship queries are answered.
    </p>

    <div class="page-num">5</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 7: CHAPTER 4 - CLASS DIAGRAM                              -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 4</div>
    <div class="chap-title">CLASS DIAGRAM</div>

    <div class="figure-container" style="margin-top: 15px;">
      <img src="{get_path('class_diagram.svg')}" style="width: 100%; max-height: 195mm; border: 1px solid #cbd5e1; border-radius: 4px; padding: 5px; background: #ffffff;" alt="Class Diagram">
      <div class="figure-caption" style="margin-top: 15px;">Fig 4.1 - UML Class Diagram of conNECt Portal Entities</div>
    </div>

    <div class="page-num">6</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 8: CHAPTER 5 - TABLE STRUCTURES (1/4)                     -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 5</div>
    <div class="chap-title">TABLE STRUCTURES</div>

    <div class="schema-title">1. users Collection</div>
    <div class="schema-desc">Stores authentication credentials, profile information, and role classifications for all members.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Primary key identifier</td></tr>
        <tr><td class="code">name</td><td>String</td><td>NO</td><td></td><td>None</td><td>Full name of the user</td></tr>
        <tr><td class="code">email</td><td>String</td><td>NO</td><td>UNI</td><td>None</td><td>Normalized primary email</td></tr>
        <tr><td class="code">password</td><td>String</td><td>NO</td><td></td><td>None</td><td>Bcrypt hashed password</td></tr>
        <tr><td class="code">role</td><td>String</td><td>NO</td><td></td><td>'student'</td><td>student / teacher / alumni / admin</td></tr>
        <tr><td class="code">collegeId</td><td>String</td><td>YES</td><td>UNI</td><td>None</td><td>Student roll/college ID</td></tr>
        <tr><td class="code">facultyId</td><td>String</td><td>YES</td><td>UNI</td><td>None</td><td>Faculty staff ID code</td></tr>
        <tr><td class="code">department</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>None</td><td>Ref -> Department</td></tr>
        <tr><td class="code">year</td><td>Number</td><td>YES</td><td></td><td>None</td><td>Current year of study (1 to 4)</td></tr>
        <tr><td class="code">status</td><td>String</td><td>NO</td><td></td><td>'active'</td><td>active / pending_approval / rejected</td></tr>
        <tr><td class="code">skills</td><td>Array</td><td>YES</td><td></td><td>[]</td><td>Technical competencies list</td></tr>
        <tr><td class="code">emailVerified</td><td>Boolean</td><td>NO</td><td></td><td>false</td><td>Email verification flag</td></tr>
      </tbody>
    </table>

    <div class="schema-title">2. departments Collection</div>
    <div class="schema-desc">Manages college engineering departments and metadata.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Department primary key</td></tr>
        <tr><td class="code">name</td><td>String</td><td>NO</td><td></td><td>None</td><td>Full department title (e.g. IT, CSE)</td></tr>
        <tr><td class="code">code</td><td>String</td><td>NO</td><td>UNI</td><td>None</td><td>Short code (e.g., 'IT', 'ECE')</td></tr>
        <tr><td class="code">themeColor</td><td>String</td><td>YES</td><td></td><td>None</td><td>Display brand accent hex code</td></tr>
      </tbody>
    </table>

    <div class="schema-title">3. posts Collection</div>
    <div class="schema-desc">Contains campus feed publications, media attachments, and engagement statistics.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Post unique identifier</td></tr>
        <tr><td class="code">author</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Creator)</td></tr>
        <tr><td class="code">content</td><td>String</td><td>YES</td><td></td><td>None</td><td>Post narrative / description text</td></tr>
        <tr><td class="code">mediaUrl</td><td>String</td><td>YES</td><td></td><td>None</td><td>Uploaded image/video asset link</td></tr>
        <tr><td class="code">mediaType</td><td>String</td><td>YES</td><td></td><td>None</td><td>'image' or 'video'</td></tr>
        <tr><td class="code">likes</td><td>Array</td><td>YES</td><td></td><td>[]</td><td>Array of user ObjectIds</td></tr>
      </tbody>
    </table>

    <div class="page-num">7</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 9: CHAPTER 5 - TABLE STRUCTURES (2/4)                     -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="schema-title">4. comments Collection</div>
    <div class="schema-desc">Stores conversational replies and discussions linked to specific campus feed posts.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Comment unique ID</td></tr>
        <tr><td class="code">post</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> Post</td></tr>
        <tr><td class="code">author</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Author)</td></tr>
        <tr><td class="code">content</td><td>String</td><td>NO</td><td></td><td>None</td><td>Text of comment discussion</td></tr>
      </tbody>
    </table>

    <div class="schema-title">5. projects Collection</div>
    <div class="schema-desc">Maintains capstone, hackathon, and research project repositories.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Project primary key</td></tr>
        <tr><td class="code">title</td><td>String</td><td>NO</td><td></td><td>None</td><td>Project title name</td></tr>
        <tr><td class="code">description</td><td>String</td><td>YES</td><td></td><td>None</td><td>Detailed technical specification</td></tr>
        <tr><td class="code">leader</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Project Owner)</td></tr>
        <tr><td class="code">mentor</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>null</td><td>Ref -> User (Faculty/Alumni)</td></tr>
        <tr><td class="code">technologies</td><td>Array</td><td>YES</td><td></td><td>[]</td><td>Tags (e.g. React, Node.js, AI)</td></tr>
        <tr><td class="code">status</td><td>String</td><td>NO</td><td></td><td>'pending'</td><td>pending / in_progress / completed</td></tr>
        <tr><td class="code">progress</td><td>Number</td><td>NO</td><td></td><td>0</td><td>Progress completion percentage</td></tr>
        <tr><td class="code">githubLink</td><td>String</td><td>YES</td><td></td><td>None</td><td>Repository URL link</td></tr>
      </tbody>
    </table>

    <div class="schema-title">6. project_members Collection</div>
    <div class="schema-desc">Maps student collaborators and role assignments to active projects.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Membership record ID</td></tr>
        <tr><td class="code">project</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> Project</td></tr>
        <tr><td class="code">user</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Collaborator)</td></tr>
        <tr><td class="code">roleInProject</td><td>String</td><td>NO</td><td></td><td>'Member'</td><td>Role title in the project</td></tr>
      </tbody>
    </table>

    <div class="schema-title">7. academic_classes Collection</div>
    <div class="schema-desc">Defines curriculum classrooms managed by professors.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Class unique identifier</td></tr>
        <tr><td class="code">name</td><td>String</td><td>NO</td><td></td><td>None</td><td>Course title and code (e.g. IT301)</td></tr>
        <tr><td class="code">subject</td><td>String</td><td>YES</td><td></td><td>None</td><td>Subject discipline title</td></tr>
        <tr><td class="code">teacher</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>None</td><td>Ref -> User (Course In-Charge)</td></tr>
        <tr><td class="code">department</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>None</td><td>Ref -> Department</td></tr>
        <tr><td class="code">inviteCode</td><td>String</td><td>YES</td><td>UNI</td><td>None</td><td>Six-character join code</td></tr>
      </tbody>
    </table>

    <div class="page-num">8</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 10: CHAPTER 5 - TABLE STRUCTURES (3/4)                    -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="schema-title">8. academic_records Collection</div>
    <div class="schema-desc">Stores date-wise lecture summaries, study materials, announcements, and assignments.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Record unique key</td></tr>
        <tr><td class="code">academicClass</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> AcademicClass</td></tr>
        <tr><td class="code">date</td><td>String</td><td>NO</td><td></td><td>None</td><td>Formatted calendar date (YYYY-MM-DD)</td></tr>
        <tr><td class="code">creator</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Posting Teacher)</td></tr>
        <tr><td class="code">topic</td><td>String</td><td>YES</td><td></td><td>None</td><td>Lecture unit/topic title</td></tr>
        <tr><td class="code">notes</td><td>String</td><td>YES</td><td></td><td>None</td><td>Class notes &amp; concept summary</td></tr>
        <tr><td class="code">announcement</td><td>String</td><td>YES</td><td></td><td>None</td><td>Urgent course notice / lab dates</td></tr>
        <tr><td class="code">assignment</td><td>Object</td><td>YES</td><td></td><td>null</td><td>Title, description, and dueDate</td></tr>
      </tbody>
    </table>

    <div class="schema-title">9. mentor_requests Collection</div>
    <div class="schema-desc">Logs student applications submitted to faculty and alumni mentors.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Request unique ID</td></tr>
        <tr><td class="code">requester</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Student Leader)</td></tr>
        <tr><td class="code">mentor</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Faculty/Alumni)</td></tr>
        <tr><td class="code">project</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>None</td><td>Ref -> Project</td></tr>
        <tr><td class="code">requestType</td><td>String</td><td>NO</td><td></td><td>'individual'</td><td>'individual' or 'group'</td></tr>
        <tr><td class="code">goals</td><td>String</td><td>NO</td><td></td><td>None</td><td>Specific mentorship guidance needs</td></tr>
        <tr><td class="code">requestedDuration</td><td>Number</td><td>NO</td><td></td><td>30</td><td>Requested mentorship days</td></tr>
        <tr><td class="code">status</td><td>String</td><td>NO</td><td></td><td>'pending'</td><td>pending / accepted / rejected / cancelled</td></tr>
      </tbody>
    </table>

    <div class="schema-title">10. mentorships Collection</div>
    <div class="schema-desc">Maintains approved active mentorship collaborations and timeline durations.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Mentorship engagement ID</td></tr>
        <tr><td class="code">mentor</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Mentor)</td></tr>
        <tr><td class="code">mentee</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>None</td><td>Ref -> User (Student Mentee)</td></tr>
        <tr><td class="code">project</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>None</td><td>Ref -> Project</td></tr>
        <tr><td class="code">request</td><td>ObjectId</td><td>NO</td><td>UNI</td><td>None</td><td>Ref -> MentorRequest</td></tr>
        <tr><td class="code">startDate</td><td>Date</td><td>NO</td><td></td><td>Now</td><td>Mentorship start timestamp</td></tr>
        <tr><td class="code">endDate</td><td>Date</td><td>NO</td><td></td><td>None</td><td>Mentorship expiration deadline</td></tr>
        <tr><td class="code">status</td><td>String</td><td>NO</td><td></td><td>'active'</td><td>active / completed / expired</td></tr>
      </tbody>
    </table>

    <div class="page-num">9</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 11: CHAPTER 5 - TABLE STRUCTURES (4/4)                    -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="schema-title">11. messages Collection</div>
    <div class="schema-desc">Records one-on-one direct communication between community members.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Message unique identifier</td></tr>
        <tr><td class="code">sender</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Sender)</td></tr>
        <tr><td class="code">recipient</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Recipient)</td></tr>
        <tr><td class="code">text</td><td>String</td><td>YES</td><td></td><td>None</td><td>Direct chat message content</td></tr>
        <tr><td class="code">mediaUrl</td><td>String</td><td>YES</td><td></td><td>None</td><td>Uploaded document or image attachment</td></tr>
        <tr><td class="code">isRead</td><td>Boolean</td><td>NO</td><td></td><td>false</td><td>Read receipt flag</td></tr>
      </tbody>
    </table>

    <div class="schema-title">12. notifications Collection</div>
    <div class="schema-desc">Logs real-time alerts and activity updates dispatched to user accounts.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Notification unique key</td></tr>
        <tr><td class="code">user</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Recipient)</td></tr>
        <tr><td class="code">type</td><td>String</td><td>NO</td><td></td><td>None</td><td>mentor_request, comment, like, message...</td></tr>
        <tr><td class="code">title</td><td>String</td><td>NO</td><td></td><td>None</td><td>Brief notification summary</td></tr>
        <tr><td class="code">message</td><td>String</td><td>NO</td><td></td><td>None</td><td>Full notification body message</td></tr>
        <tr><td class="code">relatedId</td><td>ObjectId</td><td>YES</td><td></td><td>None</td><td>Target entity ID for quick routing</td></tr>
        <tr><td class="code">isRead</td><td>Boolean</td><td>NO</td><td></td><td>false</td><td>Flag indicating if user saw alert</td></tr>
      </tbody>
    </table>

    <div class="schema-title">13. help_requests Collection</div>
    <div class="schema-desc">Enables students to broadcast peer academic questions and receive assistance.</div>
    <table class="data-table">
      <thead>
        <tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="code">_id</td><td>ObjectId</td><td>NO</td><td>PRI</td><td>Auto</td><td>Help request primary key</td></tr>
        <tr><td class="code">requester</td><td>ObjectId</td><td>NO</td><td>MUL</td><td>None</td><td>Ref -> User (Asking Student)</td></tr>
        <tr><td class="code">title</td><td>String</td><td>NO</td><td></td><td>None</td><td>Brief query topic title</td></tr>
        <tr><td class="code">subject</td><td>String</td><td>NO</td><td></td><td>None</td><td>Academic subject (e.g., DBMS, Web Tech)</td></tr>
        <tr><td class="code">status</td><td>String</td><td>NO</td><td></td><td>'open'</td><td>open / in_progress / completed</td></tr>
        <tr><td class="code">acceptedHelper</td><td>ObjectId</td><td>YES</td><td>MUL</td><td>null</td><td>Ref -> User (Peer Helper)</td></tr>
      </tbody>
    </table>

    <div class="page-num">10</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 12: CHAPTER 6 - ER DIAGRAM                                -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 6</div>
    <div class="chap-title">ER DIAGRAM</div>

    <div class="figure-container" style="margin-top: 25px;">
      <img src="{get_path('er_diagram.svg')}" style="width: 100%; max-height: 195mm; border: 1px solid #cbd5e1; border-radius: 4px; padding: 5px; background: #ffffff;" alt="Entity Relationship Diagram">
      <div class="figure-caption" style="margin-top: 15px;">Fig 6.1 - Entity-Relationship (ER) Diagram of conNECt Database</div>
    </div>

    <div class="page-num">11</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 13: CHAPTER 7 - TECH STACK                                -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 7</div>
    <div class="chap-title">TECH STACK</div>

    <p style="margin-bottom: 8px;"><strong>Frontend Technologies:</strong> React.js 18, Vite 5, Tailwind CSS, JavaScript ES6+, HTML5, CSS3</p>
    <p style="margin-bottom: 8px;"><strong>Backend Technologies:</strong> Node.js, Express.js (RESTful API Server)</p>
    <p style="margin-bottom: 8px;"><strong>Database:</strong> MongoDB Community Server, Mongoose ODM (Object Data Modeling)</p>
    <p style="margin-bottom: 8px;"><strong>Real-Time Communication:</strong> Socket.io (Bi-directional WebSocket engine for chat &amp; live notifications)</p>
    <p style="margin-bottom: 8px;"><strong>Authentication &amp; Security:</strong> JSON Web Tokens (JWT), bcryptjs (Salted Password Hashing), Role-Based Access Control (RBAC)</p>
    <p style="margin-bottom: 8px;"><strong>Asset Storage &amp; Uploads:</strong> Multer (Multipart Form Data handling), Cloudinary API</p>
    <p style="margin-bottom: 8px;"><strong>Mail Notifications:</strong> Nodemailer with SMTP transport for email verification and transactional alerts</p>
    <p style="margin-bottom: 8px;"><strong>Client Libraries:</strong> Axios (HTTP client with request interceptors), React Router DOM v6, Lucide React &amp; React Icons</p>
    <p style="margin-bottom: 15px;"><strong>Approach:</strong> MVC (Model-View-Controller) Pattern, Component-Driven UI Architecture, Async/Await Non-Blocking I/O</p>

    <div class="sub-head" style="margin-top: 15px;">Architecture: Component-Driven MVC (Model-View-Controller)</div>

    <ul class="bullet-list" style="margin-top: 8px;">
      <li><strong>Models:</strong> Mongoose schemas defining strict constraints, data types, indexes, and relationship references for User, Project, AcademicClass, Mentorship, Message, and Notification.</li>
      <li><strong>Views:</strong> Modular React components utilizing functional paradigms, custom hooks, and Tailwind CSS for responsive styling, rendering user portals, dashboards, and modal workflows.</li>
      <li><strong>Controllers:</strong> Asynchronous Express controller functions handling business logic, validation, aggregation pipelines, and consistent JSON responses.</li>
      <li><strong>Routes:</strong> Express routers mapping RESTful endpoints (GET, POST, PUT, DELETE, PATCH) protected by JWT verification middleware.</li>
      <li><strong>Database Layer:</strong> MongoDB document store optimized with compound indexes for high-speed queries on connections, messages, and course memberships.</li>
      <li><strong>Services:</strong> Standalone backend modules orchestrating socket dispatching, email generation, and automated database cleanup routines.</li>
    </ul>

    <div class="page-num">12</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 14: CHAPTER 8 - MODULES: FOLDER STRUCTURE                 -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 8</div>
    <div class="chap-title">MODULES</div>

    <div class="sub-head">8.1 FOLDER STRUCTURE</div>
    <div class="sub-head" style="font-size: 11pt; color: #334155;">BACKEND FOLDER STRUCTURE:</div>

    <div class="figure-container">
      <img src="{get_path('fig_backend_folder.svg')}" style="width: 70%; max-height: 125mm; margin: 0 auto; display: block; border: 1px solid #334155; border-radius: 6px;" alt="Backend Folder Structure">
      <div class="figure-caption">Fig 8.1 - Backend Folder Structure</div>
    </div>

    <p class="module-desc">
      The conNECt backend folder structure organizes the server application into dedicated directories for controllers, models, routes, middleware, config, and utility services. Routes define API contract endpoints, controllers execute business logic and database queries, and models enforce MongoDB schemas using Mongoose. This clean modular structure facilitates debugging, independent testing, and high maintainability.
    </p>

    <div class="page-num">13</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 15: CHAPTER 8 - BACKEND ARCHITECTURE & ROUTING            -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">BACKEND ROUTING &amp; SERVICES:</div>

    <div class="figure-container">
      <img src="{get_path('fig_backend_folder.svg')}" style="width: 65%; max-height: 110mm; margin: 0 auto; display: block; border: 1px solid #334155; border-radius: 6px;" alt="Backend Routing Hierarchy">
      <div class="figure-caption">Fig 8.2 - Backend Routes &amp; Controller Organization</div>
    </div>

    <p class="module-desc">
      In the conNECt portal, routes and controllers form the backbone of the server architecture. Built with Express.js and Node.js, the backend exposes RESTful endpoints for user authentication, campus feed posts, project collaborations, academic classrooms, and administrator controls. Each route module isolates a functional domain:
    </p>

    <ul class="bullet-list" style="margin-top: 5px;">
      <li><code>/api/auth</code>: Handles user registration, JWT login, credential verification, and account password resets.</li>
      <li><code>/api/posts</code>: Coordinates campus feed retrieval, text and media uploads, comments, and post likes.</li>
      <li><code>/api/projects</code>: Manages capstone project incubations, member assignments, and progress milestones.</li>
      <li><code>/api/mentorship</code>: Coordinates formal mentor requests, review workflows, and active collaboration spaces.</li>
      <li><code>/api/academic</code>: Delivers classroom join operations, date-wise lecture notes, and assignments.</li>
      <li><code>/api/admin</code>: Houses administrator governance tools, user verification toggles, and platform metrics.</li>
    </ul>

    <div class="page-num">14</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 16: CHAPTER 8 - FRONTEND FOLDER STRUCTURE                 -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">FRONTEND FOLDER STRUCTURE:</div>

    <div class="figure-container">
      <img src="{get_path('fig_frontend_folder.svg')}" style="width: 70%; max-height: 125mm; margin: 0 auto; display: block; border: 1px solid #334155; border-radius: 6px;" alt="Frontend Folder Structure">
      <div class="figure-caption">Fig 8.3 - Frontend Folder Structure</div>
    </div>

    <p class="module-desc">
      The conNECt client is developed as a high-performance Single-Page Application (SPA) using React.js 18 and Vite. The codebase is organized into atomic UI components, responsive layout wrappers, role-specific pages, global authentication contexts, and centralized Axios API services. This component-driven structure guarantees consistent visual styling, reusable design tokens, and optimal bundle size.
    </p>

    <div class="page-num">15</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 17: CHAPTER 8 - ARCHITECTURAL SEPARATION OF CONCERNS       -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head">8.2 ARCHITECTURAL SEPARATION OF CONCERNS</div>

    <p class="module-desc">
      The conNECt application implements a strict separation of concerns across both frontend and backend layers to promote high cohesion and low coupling:
    </p>

    <ul class="bullet-list">
      <li><strong>API Routing Layer:</strong> Maps incoming HTTP requests to dedicated controllers while applying authentication and validation middleware. Ensures clean URLs and standardized REST HTTP status codes (200, 201, 400, 401, 403, 404, 500).</li>
      <li><strong>Business Logic (Controllers):</strong> Encapsulates all domain rules, such as verifying project leadership before submitting mentor requests, calculating active mentorship duration dates, and aggregating department engagement.</li>
      <li><strong>Data Layer (Mongoose ODM):</strong> Manages MongoDB connectivity, enforces data integrity rules, handles auto-indexing, and provides pre-save hooks for password encryption.</li>
      <li><strong>Global State &amp; Context:</strong> Utilizes React Context (<code>AuthContext</code>, <code>BadgeContext</code>) to persist authenticated user sessions, JWT tokens, unread message badges, and active portal settings across route transitions without prop drilling.</li>
      <li><strong>Client API Service Layer:</strong> Centralizes all network requests inside an Axios service instance equipped with automatic token interceptors and unified error handlers.</li>
      <li><strong>Protected Client Routing:</strong> Wraps sensitive user screens inside <code>ProtectedRoute</code> guards that evaluate role entitlements before mounting components, redirecting unauthorized users.</li>
    </ul>

    <div class="page-num">16</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 18: CHAPTER 8 - LOGIN MODULE                              -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head">8.3 APPLICATION MODULES &amp; SCREEN WALKTHROUGHS</div>
    <div class="sub-head" style="font-size: 11pt; color: #334155;">1. Login &amp; Role-Aware Authentication:</div>

    <div class="figure-container">
      <img src="{get_path('fig_login.png')}" class="figure-img" alt="Login Page">
      <div class="figure-caption">Fig 8.4 - User Authentication &amp; Role Tab Selection Page</div>
    </div>

    <p class="module-desc">
      The authentication page provides a secure access gateway for students, faculty, and alumni. Users can select their role tab (Student, Faculty, Alumni) or authenticate with their institutional email (@nec.edu.in) and password. The system utilizes bcrypt password verification on the backend and issues signed JWT tokens upon success. The interface features a clean, responsive card with password visibility toggling, error alerts, and Google OAuth integration.
    </p>

    <div class="page-num">17</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 19: CHAPTER 8 - STUDENT DASHBOARD MODULE                  -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">2. Student Portal &amp; Centralized Dashboard:</div>

    <div class="figure-container">
      <img src="{get_path('fig_student_dashboard.png')}" class="figure-img-wide" alt="Student Dashboard">
      <div class="figure-caption">Fig 8.5 - Student Dashboard Displaying Quick Actions, Recent Items &amp; Feed</div>
    </div>

    <p class="module-desc">
      The Student Dashboard serves as the central command center for learners. It displays a personalized welcome greeting, quick-access action shortcuts (Create Post, Projects, Academic Classes, Network), and a recently accessed widgets container. The sidebar navigation provides immediate routing to core modules, while the embedded feed renders real-time college updates and department announcements.
    </p>

    <div class="page-num">18</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 20: CHAPTER 8 - ALUMNI PORTAL MODULE                      -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">3. Alumni Portal &amp; College Legacy:</div>

    <div class="figure-container">
      <img src="{get_path('fig_alumni_dashboard.png')}" class="figure-img-wide" alt="Alumni Dashboard">
      <div class="figure-caption">Fig 8.6 - Alumni Portal Featuring College Memories &amp; Mentorship Shortcuts</div>
    </div>

    <p class="module-desc">
      The Alumni Portal provides graduated seniors with dedicated tools to stay engaged with National Engineering College. Alumni can review their historical college memories, browse capstone project collaboration requests, guide junior student innovators, and review campus announcements. The layout highlights corporate designations (e.g., Senior Software Engineer at Zoho, Full Stack Engineer at Freshworks) to inspire current students.
    </p>

    <div class="page-num">19</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 21: CHAPTER 8 - CAMPUS FEED MODULE                        -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">4. Campus Feed &amp; Interactive Discussions:</div>

    <div class="figure-container">
      <img src="{get_path('fig_campus_feed.png')}" class="figure-img-wide" alt="Campus Feed">
      <div class="figure-caption">Fig 8.7 - Campus Feed Showing Peer Posts, Comments &amp; Academic News</div>
    </div>

    <p class="module-desc">
      The Campus Feed delivers an interactive timeline of collegiate life. Users can author formatted posts with optional image or video attachments, discuss programming queries, celebrate symposium wins, and review department circulars. Each post supports real-time like toggles and threaded comments where faculty mentors, peers, and alumni actively participate in academic discussions.
    </p>

    <div class="page-num">20</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 22: CHAPTER 8 - PEER NETWORK MODULE                       -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">5. Network &amp; Peer Connections:</div>

    <div class="figure-container">
      <img src="{get_path('fig_network.png')}" class="figure-img-wide" alt="Network Page">
      <div class="figure-caption">Fig 8.8 - Campus Network Directory with Filters &amp; Connection Requests</div>
    </div>

    <p class="module-desc">
      The Network module facilitates cross-departmental connections between students, faculty, and alumni. Users can discover colleagues filtered by department (IT, CSE, ECE, EEE, AI, Mech) and role, send connection invitations, review incoming pending requests, and browse connected peers. This directory breaks down batch barriers and fosters multidisciplinary project teams.
    </p>

    <div class="page-num">21</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 23: CHAPTER 8 - PROJECTS & MENTORSHIP MODULE              -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">6. Projects Incubator &amp; Mentorship Hub:</div>

    <div class="figure-container">
      <img src="{get_path('fig_mentorship.png')}" class="figure-img-wide" alt="Mentorship Hub">
      <div class="figure-caption">Fig 8.9 - Projects &amp; Mentorship Hub with Mentor Search &amp; Workspace Access</div>
    </div>

    <p class="module-desc">
      The Mentorship Hub serves as an incubator for capstone projects and hackathon teams. Students can showcase projects with technology tags and progress metrics, search for eligible faculty or alumni mentors by technical skill, and submit formal mentorship requests. Mentors receive incoming requests with project goals, which they can accept to launch a collaborative workspace.
    </p>

    <div class="page-num">22</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 24: CHAPTER 8 - ACADEMIC CLASSROOMS MODULE                -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">7. Academic Classrooms &amp; Courseware Workspaces:</div>

    <div class="figure-container">
      <img src="{get_path('fig_academic.png')}" class="figure-img-wide" alt="Academic Dashboard">
      <div class="figure-caption">Fig 8.10 - Academic Dashboard Showing Enrolled Subjects &amp; Lecture Materials</div>
    </div>

    <p class="module-desc">
      The Academic module provides structured course workspaces for enrolled subjects (e.g., Web Technology, Database Systems, Artificial Intelligence). Faculty members can publish date-wise lecture topics, downloadable notes, lab schedules, and assignments with due dates. Students can navigate lecture calendars, review classroom announcements, and download materials directly.
    </p>

    <div class="page-num">23</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 25: CHAPTER 8 - DIRECT MESSAGING MODULE                   -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">8. Real-Time Peer &amp; Faculty Direct Messaging:</div>

    <div class="figure-container">
      <img src="{get_path('fig_messages.png')}" class="figure-img-wide" alt="Messages Page">
      <div class="figure-caption">Fig 8.11 - Real-Time Messaging Interface with Active Conversation Threads</div>
    </div>

    <p class="module-desc">
      The Messages module delivers real-time two-way communication between students, faculty mentors, and alumni. Integrated with WebSockets via Socket.io, messages and file attachments appear instantly without page refreshing. Conversation lists display unread message counters, user avatars, and online presence indicators, enabling rapid collaboration on coursework and project hurdles.
    </p>

    <div class="page-num">24</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 26: CHAPTER 8 - NOTIFICATIONS MODULE                      -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">9. Live Activity Updates &amp; Notifications:</div>

    <div class="figure-container">
      <img src="{get_path('fig_notifications.png')}" class="figure-img-wide" alt="Notifications Page">
      <div class="figure-caption">Fig 8.12 - Notifications Page Displaying Real-Time Platform Event Alerts</div>
    </div>

    <p class="module-desc">
      The Notifications center ensures users never miss critical college updates. Event triggers generate automated alerts whenever someone accepts a connection request, comments on a post, publishes a new classroom assignment, or accepts a project mentorship query. Notifications include direct routing links to navigate immediately to the corresponding project or post.
    </p>

    <div class="page-num">25</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 27: CHAPTER 8 - USER PROFILE MODULE                       -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">10. Comprehensive User Profile &amp; Achievements:</div>

    <div class="figure-container">
      <img src="{get_path('fig_student_profile.png')}" class="figure-img-wide" alt="Profile Page">
      <div class="figure-caption">Fig 8.13 - User Profile Showcase Displaying Skills, Education, Projects &amp; Badges</div>
    </div>

    <p class="module-desc">
      The Profile page acts as a digital resume and portfolio for students, faculty, and alumni. It showcases technical skills, verified college IDs, academic department, bio, social links (GitHub, LinkedIn), active project portfolios, and verified achievements (hackathon wins, research papers, AWS certifications). Users can easily update their profile details through a modal editing form.
    </p>

    <div class="page-num">26</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 28: CHAPTER 8 - ADMIN DASHBOARD & GOVERNANCE              -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="sub-head" style="font-size: 11pt; color: #334155;">11. Administrator Governance &amp; User Verification:</div>

    <div class="figure-container">
      <img src="{get_path('fig_admin_dashboard.png')}" style="width: 95%; max-height: 85mm; margin: 0 auto 10px auto; display: block; border: 1px solid #cbd5e1; border-radius: 4px;" alt="Admin Dashboard">
      <div class="figure-caption" style="margin-bottom: 8px;">Fig 8.14 - Administrator Overview with Platform Analytics &amp; Metrics</div>
    </div>

    <div class="figure-container">
      <img src="{get_path('fig_admin_users.png')}" style="width: 95%; max-height: 80mm; margin: 0 auto; display: block; border: 1px solid #cbd5e1; border-radius: 4px;" alt="Admin Users Management">
      <div class="figure-caption">Fig 8.15 - Administrator User Directory with Role and Verification Controls</div>
    </div>

    <p class="module-desc">
      The Admin Dashboard equips college authorities with platform governance utilities. Administrators can monitor real-time counts of active users, projects, and department activities. The Users tab enables administrators to filter accounts by role, verify newly registered alumni credentials, manage permissions, and maintain college community standards.
    </p>

    <div class="page-num">27</div>
  </div>

  <!-- ============================================================== -->
  <!-- PAGE 29: CHAPTER 9 - CONCLUSION                                -->
  <!-- ============================================================== -->
  <div class="page">
    <div class="chap-num">CHAPTER 9</div>
    <div class="chap-title">CONCLUSION</div>

    <p class="para">
      In conclusion, the <strong>conNECt Campus Collaboration &amp; Networking Portal</strong> delivers a complete, secure, and modern digital platform that unifies students, faculty, alumni, and administrators of National Engineering College into a single collaborative ecosystem. By combining institutional academic management with rich social and professional networking, the system overcomes the limitations of traditional, disconnected college websites.
    </p>

    <p class="para">
      The platform successfully provides role-based authentication, interactive campus timelines, structured academic courseware spaces, multidisciplinary project incubators, formal mentorship programs, and real-time WebSocket communications. It ensures data protection through salted bcrypt password encryption and JWT authorization middleware, while MongoDB delivers the scalability required to support thousands of active campus interactions.
    </p>

    <p class="para">
      Through conNECt, students gain access to industry mentors and peer study partners, faculty members manage course materials with ease, alumni maintain active ties with their institution, and administrators exercise governance over the college digital infrastructure. The responsive, accessible user interface guarantees an exceptional user experience on both desktop and mobile devices.
    </p>

    <p class="para">
      Future enhancements will focus on integrating automated AI-based code review assistants for capstone projects, automated college timetable schedule synchronization, and push notifications for mobile devices. Overall, conNECt serves as a robust, professional, and scalable digital network that elevates academic excellence and campus networking at National Engineering College.
    </p>

    <div class="page-num">28</div>
  </div>

</body>
</html>
"""

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"Generated {HTML_FILE} ({len(html_content)} bytes)")

# Compile to PDF using Chrome Headless
print("Compiling HTML to PDF via Chrome Headless...")
cmd = [
    CHROME_PATH,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF_FILE}",
    f"file:///{HTML_FILE.replace(os.sep, '/')}"
]
result = subprocess.run(cmd, capture_output=True, text=True)
print("Exit code:", result.returncode)
if os.path.exists(PDF_FILE):
    size_mb = os.path.getsize(PDF_FILE) / (1024 * 1024)
    print(f"PDF GENERATED SUCCESSFULLY! File size: {size_mb:.2f} MB at {PDF_FILE}")
else:
    print("PDF generation failed:", result.stderr)

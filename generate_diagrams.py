import os

ASSETS_DIR = r"d:\CONNECT\conNECt\report_assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

# 1. Generate Class Diagram SVG
class_diagram_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 850" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', Arial, sans-serif;">
  <defs>
    <style>
      .box { fill: #f8fafc; stroke: #334155; stroke-width: 1.5; rx: 4; }
      .header-box { fill: #e2e8f0; stroke: #334155; stroke-width: 1.5; }
      .title { font-weight: bold; font-size: 13px; fill: #0f172a; text-anchor: middle; }
      .subtitle { font-style: italic; font-size: 10px; fill: #475569; text-anchor: middle; }
      .text { font-size: 10px; fill: #1e293b; font-family: 'Courier New', monospace; }
      .line { stroke: #475569; stroke-width: 1.2; fill: none; }
      .arrow { fill: #475569; }
      .label { font-size: 9px; fill: #64748b; font-weight: 600; }
    </style>
  </defs>

  <!-- USER (Base) -->
  <g transform="translate(430, 20)">
    <rect width="240" height="200" class="box" />
    <path d="M 0 0 L 240 0 L 240 32 L 0 32 Z" class="header-box" />
    <text x="120" y="18" class="title">&lt;&lt;Model&gt;&gt; User</text>
    <text x="120" y="28" class="subtitle">+id: ObjectId [PK]</text>
    <line x1="0" y1="32" x2="240" y2="32" class="line" />
    <text x="10" y="48" class="text">+name: String</text>
    <text x="10" y="62" class="text">+email: String [Unique]</text>
    <text x="10" y="76" class="text">+password: String [Hashed]</text>
    <text x="10" y="90" class="text">+role: Enum(student,teacher,alumni,admin)</text>
    <text x="10" y="104" class="text">+collegeId / facultyId: String</text>
    <text x="10" y="118" class="text">+department: ObjectId [FK]</text>
    <text x="10" y="132" class="text">+status: Enum(active,pending,rejected)</text>
    <text x="10" y="146" class="text">+skills: Array&lt;String&gt;</text>
    <line x1="0" y1="152" x2="240" y2="152" class="line" />
    <text x="10" y="168" class="text">+comparePassword(pwd): Boolean</text>
    <text x="10" y="182" class="text">+generateToken(): String</text>
  </g>

  <!-- POST -->
  <g transform="translate(60, 280)">
    <rect width="210" height="150" class="box" />
    <path d="M 0 0 L 210 0 L 210 32 L 0 32 Z" class="header-box" />
    <text x="105" y="18" class="title">&lt;&lt;Model&gt;&gt; Post</text>
    <text x="105" y="28" class="subtitle">+id: ObjectId [PK]</text>
    <line x1="0" y1="32" x2="210" y2="32" class="line" />
    <text x="10" y="48" class="text">+author: ObjectId [FK->User]</text>
    <text x="10" y="62" class="text">+content: String</text>
    <text x="10" y="76" class="text">+mediaUrl: String</text>
    <text x="10" y="90" class="text">+mediaType: Enum(image,video)</text>
    <text x="10" y="104" class="text">+likes: Array&lt;ObjectId&gt;</text>
    <line x1="0" y1="112" x2="210" y2="112" class="line" />
    <text x="10" y="128" class="text">+createPost(): Post</text>
    <text x="10" y="142" class="text">+toggleLike(userId): Void</text>
  </g>

  <!-- COMMENT -->
  <g transform="translate(60, 480)">
    <rect width="210" height="120" class="box" />
    <path d="M 0 0 L 210 0 L 210 32 L 0 32 Z" class="header-box" />
    <text x="105" y="18" class="title">&lt;&lt;Model&gt;&gt; Comment</text>
    <text x="105" y="28" class="subtitle">+id: ObjectId [PK]</text>
    <line x1="0" y1="32" x2="210" y2="32" class="line" />
    <text x="10" y="48" class="text">+post: ObjectId [FK->Post]</text>
    <text x="10" y="62" class="text">+author: ObjectId [FK->User]</text>
    <text x="10" y="76" class="text">+content: String</text>
    <line x1="0" y1="84" x2="210" y2="84" class="line" />
    <text x="10" y="100" class="text">+addComment(): Comment</text>
    <text x="10" y="114" class="text">+deleteComment(): Void</text>
  </g>

  <!-- PROJECT -->
  <g transform="translate(320, 280)">
    <rect width="230" height="180" class="box" />
    <path d="M 0 0 L 230 0 L 230 32 L 0 32 Z" class="header-box" />
    <text x="115" y="18" class="title">&lt;&lt;Model&gt;&gt; Project</text>
    <text x="115" y="28" class="subtitle">+id: ObjectId [PK]</text>
    <line x1="0" y1="32" x2="230" y2="32" class="line" />
    <text x="10" y="48" class="text">+title: String</text>
    <text x="10" y="62" class="text">+description: String</text>
    <text x="10" y="76" class="text">+leader: ObjectId [FK->User]</text>
    <text x="10" y="90" class="text">+mentor: ObjectId [FK->User]</text>
    <text x="10" y="104" class="text">+status: Enum(pending,active,done)</text>
    <text x="10" y="118" class="text">+progress: Number (0..100)</text>
    <text x="10" y="132" class="text">+technologies: Array&lt;String&gt;</text>
    <line x1="0" y1="140" x2="230" y2="140" class="line" />
    <text x="10" y="156" class="text">+assignMentor(mentorId): Void</text>
    <text x="10" y="170" class="text">+updateProgress(pct): Void</text>
  </g>

  <!-- PROJECT MEMBER -->
  <g transform="translate(320, 500)">
    <rect width="230" height="100" class="box" />
    <path d="M 0 0 L 230 0 L 230 30 L 0 30 Z" class="header-box" />
    <text x="115" y="17" class="title">&lt;&lt;Model&gt;&gt; ProjectMember</text>
    <line x1="0" y1="30" x2="230" y2="30" class="line" />
    <text x="10" y="45" class="text">+project: ObjectId [FK->Project]</text>
    <text x="10" y="59" class="text">+user: ObjectId [FK->User]</text>
    <text x="10" y="73" class="text">+roleInProject: String</text>
    <line x1="0" y1="78" x2="230" y2="78" class="line" />
    <text x="10" y="92" class="text">+addMember(): ProjectMember</text>
  </g>

  <!-- MENTOR REQUEST & MENTORSHIP -->
  <g transform="translate(590, 280)">
    <rect width="230" height="180" class="box" />
    <path d="M 0 0 L 230 0 L 230 32 L 0 32 Z" class="header-box" />
    <text x="115" y="18" class="title">&lt;&lt;Model&gt;&gt; MentorRequest</text>
    <text x="115" y="28" class="subtitle">+id: ObjectId [PK]</text>
    <line x1="0" y1="32" x2="230" y2="32" class="line" />
    <text x="10" y="48" class="text">+requester: ObjectId [FK->User]</text>
    <text x="10" y="62" class="text">+mentor: ObjectId [FK->User]</text>
    <text x="10" y="76" class="text">+project: ObjectId [FK->Project]</text>
    <text x="10" y="90" class="text">+goals: String</text>
    <text x="10" y="104" class="text">+requestedDuration: Number</text>
    <text x="10" y="118" class="text">+status: Enum(pending,accepted,rejected)</text>
    <line x1="0" y1="128" x2="230" y2="128" class="line" />
    <text x="10" y="145" class="text">+acceptRequest(duration): Mentorship</text>
    <text x="10" y="160" class="text">+rejectRequest(): Void</text>
  </g>

  <!-- ACADEMIC CLASS -->
  <g transform="translate(850, 280)">
    <rect width="210" height="160" class="box" />
    <path d="M 0 0 L 210 0 L 210 32 L 0 32 Z" class="header-box" />
    <text x="105" y="18" class="title">&lt;&lt;Model&gt;&gt; AcademicClass</text>
    <text x="105" y="28" class="subtitle">+id: ObjectId [PK]</text>
    <line x1="0" y1="32" x2="210" y2="32" class="line" />
    <text x="10" y="48" class="text">+name: String</text>
    <text x="10" y="62" class="text">+subject: String</text>
    <text x="10" y="76" class="text">+teacher: ObjectId [FK->User]</text>
    <text x="10" y="90" class="text">+department: ObjectId [FK->Dept]</text>
    <text x="10" y="104" class="text">+inviteCode: String [Unique]</text>
    <line x1="0" y1="112" x2="210" y2="112" class="line" />
    <text x="10" y="128" class="text">+createClass(): AcademicClass</text>
    <text x="10" y="142" class="text">+enrollStudent(user): Void</text>
  </g>

  <!-- ACADEMIC RECORD -->
  <g transform="translate(850, 480)">
    <rect width="210" height="130" class="box" />
    <path d="M 0 0 L 210 0 L 210 30 L 0 30 Z" class="header-box" />
    <text x="105" y="17" class="title">&lt;&lt;Model&gt;&gt; AcademicRecord</text>
    <line x1="0" y1="30" x2="210" y2="30" class="line" />
    <text x="10" y="45" class="text">+academicClass: ObjectId [FK]</text>
    <text x="10" y="59" class="text">+date: String (YYYY-MM-DD)</text>
    <text x="10" y="73" class="text">+topic: String</text>
    <text x="10" y="87" class="text">+notes: String</text>
    <text x="10" y="101" class="text">+assignment: Object</text>
    <line x1="0" y1="106" x2="210" y2="106" class="line" />
    <text x="10" y="120" class="text">+addRecord(): AcademicRecord</text>
  </g>

  <!-- MESSAGE & NOTIFICATION -->
  <g transform="translate(590, 500)">
    <rect width="230" height="130" class="box" />
    <path d="M 0 0 L 230 0 L 230 30 L 0 30 Z" class="header-box" />
    <text x="115" y="17" class="title">&lt;&lt;Model&gt;&gt; Message</text>
    <line x1="0" y1="30" x2="230" y2="30" class="line" />
    <text x="10" y="45" class="text">+sender: ObjectId [FK->User]</text>
    <text x="10" y="59" class="text">+recipient: ObjectId [FK->User]</text>
    <text x="10" y="73" class="text">+text: String</text>
    <text x="10" y="87" class="text">+isRead: Boolean</text>
    <line x1="0" y1="94" x2="230" y2="94" class="line" />
    <text x="10" y="108" class="text">+sendMessage(): Message</text>
    <text x="10" y="122" class="text">+markAsRead(): Void</text>
  </g>

  <!-- RELATION LINES -->
  <!-- User to Post -->
  <path d="M 430 120 L 165 120 L 165 280" class="line" />
  <text x="175" y="260" class="label">1..* creates</text>

  <!-- Post to Comment -->
  <path d="M 165 430 L 165 480" class="line" />
  <text x="175" y="460" class="label">1..* has</text>

  <!-- User to Project -->
  <path d="M 480 220 L 480 280" class="line" />
  <text x="490" y="260" class="label">1..* leads</text>

  <!-- Project to ProjectMember -->
  <path d="M 435 460 L 435 500" class="line" />
  <text x="445" y="485" class="label">1..* has</text>

  <!-- User to MentorRequest -->
  <path d="M 600 220 L 650 280" class="line" />
  <text x="635" y="255" class="label">1..* requests</text>

  <!-- User to AcademicClass -->
  <path d="M 670 120 L 950 120 L 950 280" class="line" />
  <text x="870" y="140" class="label">1..* teaches / enrolls</text>

  <!-- AcademicClass to AcademicRecord -->
  <path d="M 950 440 L 950 480" class="line" />
  <text x="960" y="465" class="label">1..* records</text>

  <!-- User to Message -->
  <path d="M 550 220 L 550 560 L 590 560" class="line" />
  <text x="505" y="540" class="label">1..* sends</text>

</svg>"""

with open(os.path.join(ASSETS_DIR, "class_diagram.svg"), "w", encoding="utf-8") as f:
    f.write(class_diagram_svg)
print("Wrote class_diagram.svg")

# 2. Generate ER Diagram SVG matching the reference report style
er_diagram_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 850" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', Arial, sans-serif;">
  <defs>
    <style>
      .entity { fill: #f1f5f9; stroke: #0f172a; stroke-width: 2; rx: 3; }
      .entity-title { font-weight: bold; font-size: 13px; fill: #0f172a; text-anchor: middle; }
      .rel { fill: #ffffff; stroke: #0f172a; stroke-width: 1.5; }
      .rel-title { font-size: 11px; font-weight: 600; fill: #0f172a; text-anchor: middle; }
      .attr { fill: #ffffff; stroke: #475569; stroke-width: 1; rx: 12; }
      .attr-title { font-size: 9px; fill: #1e293b; text-anchor: middle; }
      .attr-pk { font-weight: bold; text-decoration: underline; }
      .line { stroke: #334155; stroke-width: 1.3; }
      .card { font-size: 10px; font-weight: bold; fill: #dc2626; }
    </style>
  </defs>

  <!-- CENTER: USER -->
  <g transform="translate(480, 360)">
    <rect width="140" height="55" class="entity" />
    <text x="70" y="32" class="entity-title">User</text>
  </g>

  <!-- USER Attributes -->
  <g transform="translate(360, 290)"><rect width="80" height="24" class="attr"/><text x="40" y="16" class="attr-title attr-pk">userId (PK)</text></g>
  <line x1="440" y1="305" x2="490" y2="360" class="line" />

  <g transform="translate(360, 330)"><rect width="80" height="24" class="attr"/><text x="40" y="16" class="attr-title">name</text></g>
  <line x1="440" y1="342" x2="480" y2="370" class="line" />

  <g transform="translate(360, 370)"><rect width="80" height="24" class="attr"/><text x="40" y="16" class="attr-title">email</text></g>
  <line x1="440" y1="382" x2="480" y2="385" class="line" />

  <g transform="translate(360, 410)"><rect width="80" height="24" class="attr"/><text x="40" y="16" class="attr-title">role</text></g>
  <line x1="440" y1="422" x2="480" y2="400" class="line" />

  <g transform="translate(360, 450)"><rect width="80" height="24" class="attr"/><text x="40" y="16" class="attr-title">collegeId</text></g>
  <line x1="440" y1="462" x2="495" y2="415" class="line" />

  <!-- POST ENTITY (Left) -->
  <g transform="translate(140, 220)">
    <rect width="130" height="50" class="entity" />
    <text x="65" y="30" class="entity-title">Post</text>
  </g>
  <!-- Relationship: User creates Post -->
  <polygon points="360,245 400,220 440,245 400,270" class="rel" />
  <text x="400" y="249" class="rel-title">creates</text>
  <line x1="270" y1="245" x2="360" y2="245" class="line" />
  <line x1="440" y1="245" x2="520" y2="360" class="line" />
  <text x="280" y="235" class="card">N</text>
  <text x="495" y="340" class="card">1</text>

  <!-- Post Attributes -->
  <g transform="translate(30, 180)"><rect width="80" height="22" class="attr"/><text x="40" y="15" class="attr-title attr-pk">postId (PK)</text></g>
  <line x1="110" y1="195" x2="150" y2="220" class="line" />
  <g transform="translate(30, 220)"><rect width="80" height="22" class="attr"/><text x="40" y="15" class="attr-title">content</text></g>
  <line x1="110" y1="231" x2="140" y2="240" class="line" />
  <g transform="translate(30, 260)"><rect width="80" height="22" class="attr"/><text x="40" y="15" class="attr-title">mediaUrl</text></g>
  <line x1="110" y1="271" x2="140" y2="255" class="line" />

  <!-- COMMENT ENTITY (Bottom Left) -->
  <g transform="translate(140, 520)">
    <rect width="130" height="50" class="entity" />
    <text x="65" y="30" class="entity-title">Comment</text>
  </g>
  <polygon points="175,410 205,385 235,410 205,435" class="rel" />
  <text x="205" y="414" class="rel-title">has</text>
  <line x1="205" y1="270" x2="205" y2="385" class="line" />
  <line x1="205" y1="435" x2="205" y2="520" class="line" />
  <text x="215" y="290" class="card">1</text>
  <text x="215" y="500" class="card">N</text>

  <!-- PROJECT ENTITY (Top Center) -->
  <g transform="translate(480, 80)">
    <rect width="140" height="50" class="entity" />
    <text x="70" y="30" class="entity-title">Project</text>
  </g>
  <polygon points="520,225 550,200 580,225 550,250" class="rel" />
  <text x="550" y="229" class="rel-title">leads</text>
  <line x1="550" y1="130" x2="550" y2="200" class="line" />
  <line x1="550" y1="250" x2="550" y2="360" class="line" />
  <text x="560" y="150" class="card">N</text>
  <text x="560" y="340" class="card">1</text>

  <!-- ACADEMIC CLASS ENTITY (Right) -->
  <g transform="translate(830, 220)">
    <rect width="150" height="50" class="entity" />
    <text x="75" y="30" class="entity-title">AcademicClass</text>
  </g>
  <polygon points="690,265 725,240 760,265 725,290" class="rel" />
  <text x="725" y="269" class="rel-title">teaches</text>
  <line x1="610" y1="365" x2="690" y2="265" class="line" />
  <line x1="760" y1="265" x2="830" y2="250" class="line" />
  <text x="635" y="350" class="card">1</text>
  <text x="810" y="240" class="card">N</text>

  <!-- ACADEMIC RECORD (Bottom Right) -->
  <g transform="translate(830, 480)">
    <rect width="150" height="50" class="entity" />
    <text x="75" y="30" class="entity-title">AcademicRecord</text>
  </g>
  <polygon points="875,370 905,345 935,370 905,395" class="rel" />
  <text x="905" y="374" class="rel-title">contains</text>
  <line x1="905" y1="270" x2="905" y2="345" class="line" />
  <line x1="905" y1="395" x2="905" y2="480" class="line" />
  <text x="915" y="295" class="card">1</text>
  <text x="915" y="465" class="card">N</text>

  <!-- MENTOR REQUEST & MENTORSHIP (Bottom Center) -->
  <g transform="translate(480, 640)">
    <rect width="140" height="50" class="entity" />
    <text x="70" y="30" class="entity-title">MentorRequest</text>
  </g>
  <polygon points="520,525 550,500 580,525 550,550" class="rel" />
  <text x="550" y="529" class="rel-title">requests</text>
  <line x1="550" y1="415" x2="550" y2="500" class="line" />
  <line x1="550" y1="550" x2="550" y2="640" class="line" />
  <text x="560" y="435" class="card">1</text>
  <text x="560" y="625" class="card">N</text>

  <!-- MESSAGE ENTITY (Far Bottom Right) -->
  <g transform="translate(730, 640)">
    <rect width="130" height="50" class="entity" />
    <text x="65" y="30" class="entity-title">Message</text>
  </g>
  <polygon points="660,560 690,535 720,560 690,585" class="rel" />
  <text x="690" y="564" class="rel-title">sends</text>
  <line x1="605" y1="415" x2="660" y2="560" class="line" />
  <line x1="720" y1="560" x2="735" y2="640" class="line" />
  <text x="620" y="445" class="card">1</text>
  <text x="740" y="625" class="card">N</text>

</svg>"""

with open(os.path.join(ASSETS_DIR, "er_diagram.svg"), "w", encoding="utf-8") as f:
    f.write(er_diagram_svg)
print("Wrote er_diagram.svg")

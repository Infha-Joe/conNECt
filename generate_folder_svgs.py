import os

ASSETS_DIR = r"d:\CONNECT\conNECt\report_assets"

backend_folder_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="100%" height="100%" style="background:#1e1e1e; font-family: 'Consolas', 'Courier New', monospace;">
  <rect width="450" height="620" fill="#1e1e1e" rx="6" />
  <g transform="translate(20, 25)">
    <text x="0" y="0" fill="#e2e8f0" font-size="13" font-weight="bold">v server</text>
    <text x="20" y="25" fill="#94a3b8" font-size="12">v config/</text>
    <text x="40" y="45" fill="#38bdf8" font-size="12">JS db.js</text>
    <text x="20" y="70" fill="#94a3b8" font-size="12">v controllers/</text>
    <text x="40" y="90" fill="#38bdf8" font-size="12">JS authController.js</text>
    <text x="40" y="110" fill="#38bdf8" font-size="12">JS projectController.js</text>
    <text x="40" y="130" fill="#38bdf8" font-size="12">JS classroomController.js</text>
    <text x="40" y="150" fill="#38bdf8" font-size="12">JS mentorshipController.js</text>
    <text x="40" y="170" fill="#38bdf8" font-size="12">JS adminController.js</text>
    <text x="20" y="195" fill="#94a3b8" font-size="12">v middleware/</text>
    <text x="40" y="215" fill="#38bdf8" font-size="12">JS auth.js</text>
    <text x="40" y="235" fill="#38bdf8" font-size="12">JS roleCheck.js</text>
    <text x="20" y="260" fill="#94a3b8" font-size="12">v models/</text>
    <text x="40" y="280" fill="#38bdf8" font-size="12">JS User.js</text>
    <text x="40" y="300" fill="#38bdf8" font-size="12">JS Project.js</text>
    <text x="40" y="320" fill="#38bdf8" font-size="12">JS AcademicClass.js</text>
    <text x="40" y="340" fill="#38bdf8" font-size="12">JS Mentorship.js</text>
    <text x="40" y="360" fill="#38bdf8" font-size="12">JS Message.js</text>
    <text x="40" y="380" fill="#38bdf8" font-size="12">JS Notification.js</text>
    <text x="20" y="405" fill="#94a3b8" font-size="12">v routes/</text>
    <text x="40" y="425" fill="#38bdf8" font-size="12">JS authRoutes.js</text>
    <text x="40" y="445" fill="#38bdf8" font-size="12">JS projectRoutes.js</text>
    <text x="40" y="465" fill="#38bdf8" font-size="12">JS academicRoutes.js</text>
    <text x="40" y="485" fill="#38bdf8" font-size="12">JS mentorshipRoutes.js</text>
    <text x="40" y="505" fill="#38bdf8" font-size="12">JS adminRoutes.js</text>
    <text x="20" y="530" fill="#eab308" font-size="12">JS server.js</text>
    <text x="20" y="550" fill="#a855f7" font-size="12">{} package.json</text>
    <text x="20" y="570" fill="#64748b" font-size="12"># .env</text>
  </g>
</svg>"""

frontend_folder_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="100%" height="100%" style="background:#1e1e1e; font-family: 'Consolas', 'Courier New', monospace;">
  <rect width="450" height="620" fill="#1e1e1e" rx="6" />
  <g transform="translate(20, 25)">
    <text x="0" y="0" fill="#e2e8f0" font-size="13" font-weight="bold">v client</text>
    <text x="20" y="25" fill="#94a3b8" font-size="12">v src/</text>
    <text x="40" y="45" fill="#94a3b8" font-size="12">v components/</text>
    <text x="60" y="65" fill="#60a5fa" font-size="12">JSX PostCard.jsx</text>
    <text x="60" y="85" fill="#60a5fa" font-size="12">JSX CreatePost.jsx</text>
    <text x="60" y="105" fill="#60a5fa" font-size="12">JSX AdminUsersTab.jsx</text>
    <text x="60" y="125" fill="#60a5fa" font-size="12">JSX AdminOverviewTab.jsx</text>
    <text x="40" y="150" fill="#94a3b8" font-size="12">v context/</text>
    <text x="60" y="170" fill="#60a5fa" font-size="12">JSX AuthContext.jsx</text>
    <text x="60" y="190" fill="#60a5fa" font-size="12">JSX BadgeContext.jsx</text>
    <text x="40" y="215" fill="#94a3b8" font-size="12">v layouts/</text>
    <text x="60" y="235" fill="#60a5fa" font-size="12">JSX DashboardLayout.jsx</text>
    <text x="40" y="260" fill="#94a3b8" font-size="12">v pages/</text>
    <text x="60" y="280" fill="#60a5fa" font-size="12">JSX Login.jsx</text>
    <text x="60" y="300" fill="#60a5fa" font-size="12">JSX Register.jsx</text>
    <text x="60" y="320" fill="#60a5fa" font-size="12">JSX StudentDashboard.jsx</text>
    <text x="60" y="340" fill="#60a5fa" font-size="12">JSX AlumniDashboard.jsx</text>
    <text x="60" y="360" fill="#60a5fa" font-size="12">JSX AdminDashboard.jsx</text>
    <text x="60" y="380" fill="#60a5fa" font-size="12">JSX MentorshipHub.jsx</text>
    <text x="60" y="400" fill="#60a5fa" font-size="12">JSX AcademicDashboard.jsx</text>
    <text x="60" y="420" fill="#60a5fa" font-size="12">JSX NetworkFeed.jsx</text>
    <text x="60" y="440" fill="#60a5fa" font-size="12">JSX Messages.jsx</text>
    <text x="40" y="465" fill="#94a3b8" font-size="12">v services/</text>
    <text x="60" y="485" fill="#38bdf8" font-size="12">JS api.js</text>
    <text x="40" y="510" fill="#60a5fa" font-size="12">JSX App.jsx</text>
    <text x="40" y="530" fill="#60a5fa" font-size="12">JSX main.jsx</text>
    <text x="20" y="555" fill="#eab308" font-size="12">JS vite.config.js</text>
    <text x="20" y="575" fill="#a855f7" font-size="12">{} package.json</text>
  </g>
</svg>"""

with open(os.path.join(ASSETS_DIR, "fig_backend_folder.svg"), "w", encoding="utf-8") as f:
    f.write(backend_folder_svg)
with open(os.path.join(ASSETS_DIR, "fig_frontend_folder.svg"), "w", encoding="utf-8") as f:
    f.write(frontend_folder_svg)
print("Folder SVGs generated successfully!")

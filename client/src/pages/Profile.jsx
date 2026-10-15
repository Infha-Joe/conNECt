import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import ConnectButton from "../components/ConnectButton";
import api from "../services/api";
import {
  FiMapPin,
  FiBook,
  FiLink,
  FiGithub,
  FiLinkedin,
  FiEdit2,
  FiCamera,
  FiUser,
  FiTag,
  FiBriefcase,
  FiFolder,
  FiArrowRight,
  FiPlus,
} from "react-icons/fi";
import AchievementsShowcase from "../components/profile/AchievementsShowcase";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, setUser: setCurrentUser } = useAuth();

  const isOwnProfile = !id || id === currentUser?._id;

  const [profileUser, setProfileUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [userProjects, setUserProjects] = useState([]);

  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    githubLink: "",
    linkedinLink: "",
    portfolioLink: "",
    location: "",
    currentCompany: "",
    currentRole: "",
    degree: "",
    batch: "",
    designation: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setPageLoading(true);
      try {
        if (isOwnProfile) {
          setProfileUser(currentUser);
        } else {
          const { data } = await api.get(`/users/${id}`);
          setProfileUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, [id, currentUser, isOwnProfile]);

  useEffect(() => {
    if (profileUser && isOwnProfile) {
      setFormData({
        bio: profileUser.bio || "",
        skills: profileUser.skills ? profileUser.skills.join(", ") : "",
        githubLink: profileUser.githubLink || "",
        linkedinLink: profileUser.linkedinLink || "",
        portfolioLink: profileUser.portfolioLink || "",
        location: profileUser.location || "",
        currentCompany: profileUser.currentCompany || "",
        currentRole: profileUser.currentRole || "",
        degree: profileUser.degree || "",
        batch: profileUser.batch || "",
        designation: profileUser.designation || "",
      });
    }
  }, [profileUser, isOwnProfile]);

  // Fetch projects for the Projects section
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        if (profileUser?._id) {
          if (isOwnProfile) {
            const res = await api.get("/projects", { params: { mine: true } });
            setUserProjects(res.data.projects || []);
          } else {
            const res = await api.get("/projects");
            const all = res.data.projects || [];
            const userProjs = all.filter(
              (p) =>
                (p.leader?._id || p.leader) === profileUser._id ||
                (p.mentor?._id || p.mentor) === profileUser._id
            );
            setUserProjects(userProjs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user projects", err);
      }
    };
    fetchUserProjects();
  }, [profileUser?._id, isOwnProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50000000) {
        alert("File size must be less than 50MB");
        return;
      }
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let uploadedPhotoUrl = profileUser.profilePhoto;

      if (profilePhotoFile) {
        const uploadData = new FormData();
        uploadData.append("media", profilePhotoFile);
        const { data: uploadRes } = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedPhotoUrl = uploadRes.url;
      }

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const payload = {
        ...formData,
        skills: skillsArray,
        profilePhoto: uploadedPhotoUrl,
      };

      const { data } = await api.put(`/users/${currentUser._id}`, payload);

      localStorage.setItem("connect_user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificSubtitle = () => {
    if (profileUser?.role === "student") {
      const yearMap = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" };
      const yearText = yearMap[profileUser?.year]
        ? `${yearMap[profileUser?.year]} Year`
        : profileUser?.year
        ? `Year ${profileUser?.year}`
        : "Student";
      return (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-teal-700 font-semibold">
            {profileUser?.department?.name || "Department not specified"}
          </span>
          <span>&middot;</span>
          <span>{yearText}</span>
          {profileUser?.collegeId && (
            <>
              <span>&middot;</span>
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-[11px] text-slate-600">
                <FiBook className="text-brand" size={11} /> ID: {profileUser.collegeId}
              </span>
            </>
          )}
        </div>
      );
    }
    if (profileUser?.role === "teacher") {
      return (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-teal-700 font-semibold">
            {profileUser?.designation || "Faculty Member"}
          </span>
          <span>&middot;</span>
          <span>{profileUser?.department?.name || "Department not specified"}</span>
          {profileUser?.facultyId && (
            <>
              <span>&middot;</span>
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-[11px] text-slate-600">
                ID: {profileUser.facultyId}
              </span>
            </>
          )}
        </div>
      );
    }
    if (profileUser?.role === "alumni") {
      return (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-teal-700 font-semibold">
            {profileUser?.currentRole
              ? `${profileUser.currentRole}${
                  profileUser.currentCompany ? ` at ${profileUser.currentCompany}` : ""
                }`
              : "Alumni"}
          </span>
          <span>&middot;</span>
          <span>{profileUser?.degree || "NEC Graduate"}</span>
          {profileUser?.batch && (
            <>
              <span>&middot;</span>
              <span>Batch {profileUser.batch}</span>
            </>
          )}
        </div>
      );
    }
    return <p className="text-slate-500 mt-1 capitalize text-xs">{profileUser?.role}</p>;
  };

  const inputStyles =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[13px] text-ink outline-none transition-all focus:border-brand focus:bg-white focus:ring-1 focus:ring-brand";
  const labelStyles = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700";

  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profileUser) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-slate-600">User not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 pb-16">
        {/* ══════════════════════════════════════════
            1. PROFILE HEADER
        ══════════════════════════════════════════ */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <Avatar
                  src={photoPreview || profileUser?.profilePhoto}
                  name={profileUser?.name}
                  size="xl"
                  className="h-24 w-24 border-2 border-white shadow-sm ring-2 ring-slate-100"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-colors">
                    <FiCamera size={14} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                    {profileUser?.name}
                  </h1>
                  <span className="inline-block text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {profileUser?.role}
                  </span>
                </div>
                {renderRoleSpecificSubtitle()}
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-center">
              {!isEditing && isOwnProfile && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  className="rounded-xl text-xs font-bold px-4 py-2.5 shadow-2xs"
                >
                  <FiEdit2 size={13} className="mr-1.5" />
                  Edit Profile
                </Button>
              )}
              {!isOwnProfile && profileUser && (
                <ConnectButton userId={profileUser._id} />
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {isEditing ? (
          /* ══════════════════════════════════════════
              EDIT PROFILE MODAL / FORM
          ══════════════════════════════════════════ */
          <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
            <h2 className="text-base font-bold text-ink mb-6 flex items-center gap-2">
              <FiEdit2 className="text-brand" size={16} /> Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={labelStyles}>Bio / About</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className={`${inputStyles} resize-none`}
                  placeholder="Tell your network about yourself..."
                />
              </div>

              <div>
                <label className={labelStyles}>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="React, Node.js, Project Management (comma separated)"
                />
              </div>

              {profileUser?.role === "alumni" && (
                <>
                  <hr className="border-slate-100" />
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelStyles}>Current Company</label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Current Role</label>
                      <input
                        type="text"
                        name="currentRole"
                        value={formData.currentRole}
                        onChange={handleChange}
                        className={inputStyles}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelStyles}>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={inputStyles}
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100" />
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                    Educational Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelStyles}>Degree / Course</label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Batch</label>
                      <input
                        type="text"
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        className={inputStyles}
                      />
                    </div>
                  </div>
                </>
              )}

              {profileUser?.role === "teacher" && (
                <>
                  <hr className="border-slate-100" />
                  <div>
                    <label className={labelStyles}>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className={inputStyles}
                    />
                  </div>
                </>
              )}

              <hr className="border-slate-100" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Professional Links
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelStyles}>LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className={labelStyles}>GitHub Profile</label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelStyles}>Portfolio / Website</label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="submit" disabled={isLoading} className="rounded-xl px-6 text-xs font-bold">
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* ══════════════════════════════════════════
                MAIN PROFILE SECTIONS GRID (2 EQUAL COLUMNS)
                - Left: About, Experience
                - Right: Skills, Education
            ══════════════════════════════════════════ */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* 2. ABOUT */}
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 text-ink font-bold text-base">
                  <FiUser className="text-brand" size={17} />
                  <h2>About</h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                  {profileUser?.bio?.trim() ? profileUser.bio : "No bio added yet."}
                </p>
              </div>

              {/* 3. SKILLS & LINKS */}
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 text-ink font-bold text-base">
                  <FiTag className="text-brand" size={17} />
                  <h2>Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileUser?.skills?.length > 0 ? (
                    profileUser.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills listed yet.</span>
                  )}
                </div>

                {(profileUser?.linkedinLink ||
                  profileUser?.githubLink ||
                  profileUser?.portfolioLink) && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
                    {profileUser?.linkedinLink && (
                      <a
                        href={profileUser.linkedinLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs text-slate-700 font-medium transition-colors"
                      >
                        <FiLinkedin className="text-[#0A66C2]" size={13} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profileUser?.githubLink && (
                      <a
                        href={profileUser.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs text-slate-700 font-medium transition-colors"
                      >
                        <FiGithub size={13} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profileUser?.portfolioLink && (
                      <a
                        href={profileUser.portfolioLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs text-slate-700 font-medium transition-colors"
                      >
                        <FiLink size={13} />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* 4. EDUCATION */}
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 text-ink font-bold text-base">
                  <FiBook className="text-brand" size={17} />
                  <h2>Education</h2>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-ink text-sm">
                    {profileUser?.degree ||
                      (profileUser?.role === "student"
                        ? "Bachelor of Technology (B.Tech)"
                        : profileUser?.role === "alumni"
                        ? "B.Tech"
                        : "Faculty of Engineering")}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700">
                    National Engineering College (NEC), Kovilpatti
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                    <span>
                      Department:{" "}
                      <strong className="text-slate-700 font-semibold">
                        {profileUser?.department?.name || "Department not specified"}
                      </strong>
                    </span>
                    {profileUser?.batch && (
                      <span>
                        Batch: <strong className="text-slate-700 font-semibold">{profileUser.batch}</strong>
                      </span>
                    )}
                    {profileUser?.year && (
                      <span>
                        Year: <strong className="text-slate-700 font-semibold">{profileUser.year}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. EXPERIENCE */}
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 text-ink font-bold text-base">
                  <FiBriefcase className="text-brand" size={17} />
                  <h2>Experience</h2>
                </div>
                {profileUser?.role === "alumni" ? (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-ink text-sm">
                          {profileUser?.currentRole || "Role not specified"}
                        </h3>
                        <p className="text-xs font-semibold text-teal-700 mt-0.5">
                          {profileUser?.currentCompany || "Company not specified"}
                        </p>
                      </div>
                      {profileUser?.location && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
                          <FiMapPin size={11} className="text-slate-400" /> {profileUser.location}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 pt-1">Alumni Practitioner & Professional</p>
                  </div>
                ) : profileUser?.role === "teacher" ? (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-ink text-sm">
                          {profileUser?.designation || "Faculty Member"}
                        </h3>
                        <p className="text-xs font-semibold text-teal-700 mt-0.5">
                          {profileUser?.department?.name || "Academic Department"}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Faculty
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 pt-1">National Engineering College (NEC)</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profileUser?.internships?.length > 0 ? (
                      profileUser.internships.map((intern, i) => (
                        <div key={i} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                          <h3 className="font-bold text-ink text-sm">{intern.role}</h3>
                          <p className="text-xs font-semibold text-teal-700">{intern.company}</p>
                          {intern.duration && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{intern.duration}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-ink text-sm">
                              Student Developer & Researcher
                            </h3>
                            <p className="text-xs font-semibold text-teal-700 mt-0.5">
                              {profileUser?.department?.name || "Engineering"} &middot; NEC
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Student
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                          Actively developing software solutions and collaborating on campus projects.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ══════════════════════════════════════════
                6. PROJECTS (FULL WIDTH CARD)
            ══════════════════════════════════════════ */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-ink font-bold text-base">
                  <FiFolder className="text-brand" size={17} />
                  <h2>Projects</h2>
                </div>
                {userProjects.length > 0 && (
                  <Link
                    to="/mentorship"
                    className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                  >
                    View in Projects & Mentorship <FiArrowRight size={12} />
                  </Link>
                )}
              </div>

              {userProjects.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-slate-100">
                  <FiFolder className="mx-auto mb-2 text-slate-300" size={24} />
                  <p>No active projects to showcase yet.</p>
                  {isOwnProfile && (
                    <Link
                      to="/mentorship"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline mt-2"
                    >
                      <FiPlus size={13} /> Create your first project
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProjects.slice(0, 3).map((proj) => (
                    <Link
                      key={proj._id}
                      to={`/projects/${proj._id}`}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-brand/40 bg-slate-50/40 hover:bg-white hover:shadow-2xs transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100/80">
                            {proj.status?.replace("_", " ") || "PROJECT"}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-ink group-hover:text-primary transition-colors line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {proj.description || "No description provided."}
                        </p>
                      </div>

                      {proj.technologies?.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1">
                          {proj.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-medium bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                            >
                              {tech}
                            </span>
                          ))}
                          {proj.technologies.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                              +{proj.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════
                7. ACHIEVEMENTS (FULL WIDTH CARD)
            ══════════════════════════════════════════ */}
            {profileUser?._id && (
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <AchievementsShowcase
                  userId={profileUser._id}
                  isOwnProfile={isOwnProfile}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

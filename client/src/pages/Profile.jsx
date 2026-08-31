import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import api from "../services/api";
import { FiMapPin, FiBook, FiLink, FiGithub, FiLinkedin, FiEdit2 } from "react-icons/fi";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
    designation: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || "",
        skills: user.skills ? user.skills.join(", ") : "",
        githubLink: user.githubLink || "",
        linkedinLink: user.linkedinLink || "",
        portfolioLink: user.portfolioLink || "",
        location: user.location || "",
        currentCompany: user.currentCompany || "",
        currentRole: user.currentRole || "",
        degree: user.degree || "",
        batch: user.batch || "",
        designation: user.designation || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const skillsArray = formData.skills.split(",").map((s) => s.trim()).filter((s) => s);
      const payload = {
        ...formData,
        skills: skillsArray,
      };
      
      const { data } = await api.put(`/users/${user._id}`, payload);
      
      localStorage.setItem("connect_user", JSON.stringify(data.user));
      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificSubtitle = () => {
    if (user?.role === "student") {
      const yearMap = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" };
      const yearText = yearMap[user?.year] ? `${yearMap[user?.year]} Year` : `Year ${user?.year}`;
      return (
        <div className="mt-1 flex flex-col gap-0.5">
          <p className="text-brand font-medium text-sm">Student</p>
          <p className="text-[13px] text-slate-500">{user?.department?.name || "No Department"} &middot; {yearText}</p>
        </div>
      );
    }
    if (user?.role === "teacher") {
      return (
        <div className="mt-1 flex flex-col gap-0.5">
          <p className="text-brand font-medium text-sm">Faculty</p>
          <p className="text-[13px] text-slate-500">{user?.department?.name || "No Department"}</p>
        </div>
      );
    }
    if (user?.role === "alumni") {
      return (
        <div className="mt-1 flex flex-col gap-0.5">
          <p className="text-brand font-medium text-sm">Alumni</p>
          <p className="text-[13px] text-slate-500">
            {user?.degree || "Degree not specified"} {user?.department?.name || ""} &middot; Batch {user?.batch || "N/A"}
          </p>
          <p className="text-[13px] text-slate-500">
            {user?.currentRole ? `${user.currentRole}${user.currentCompany ? ` at ${user.currentCompany}` : ''}` : "Role not specified"}
          </p>
        </div>
      );
    }
    return <p className="text-slate-500 mt-1 capitalize text-sm">{user?.role}</p>;
  };

  const inputStyles = "w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-[13px] text-ink outline-none transition-all focus:border-brand focus:bg-white focus:ring-1 focus:ring-brand";
  const labelStyles = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        
        {/* Profile Header */}
        <Card noPadding>
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-brand/20 via-slate-200 to-slate-100 relative"></div>
          
          <div className="px-6 sm:px-8 pb-8 relative">
            <div className="absolute -top-16 rounded-full border-4 border-white bg-white">
              <Avatar name={user?.name} size="xl" className="h-32 w-32 border-0" />
            </div>

            <div className="pt-20 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="font-body text-2xl sm:text-3xl font-bold text-ink tracking-tight">{user?.name}</h1>
                {renderRoleSpecificSubtitle()}
                
                {user?.role === "student" && user?.collegeId && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 inline-flex px-2.5 py-1 rounded-md border border-slate-200">
                    <FiBook className="text-brand" />
                    <span>College ID: {user?.collegeId}</span>
                  </div>
                )}
              </div>

              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="secondary" className="shrink-0 rounded-full text-xs px-5">
                  <FiEdit2 size={14} className="mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {isEditing ? (
          <Card>
            <h2 className="text-lg font-bold text-ink mb-6">Edit Profile</h2>
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

              {user?.role === "alumni" && (
                <>
                  <hr className="border-slate-200" />
                  <h3 className="text-base font-bold text-ink">Professional Info</h3>
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
                    <div>
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
                  
                  <hr className="border-slate-200 mt-6" />
                  <h3 className="text-base font-bold text-ink">Educational Info</h3>
                  <p className="text-xs text-slate-500 mb-4">Note: Your Completed Department cannot be changed here.</p>
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

              {user?.role === "teacher" && (
                <>
                  <hr className="border-slate-200" />
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
              
              {user?.role === "student" && (
                <>
                  <hr className="border-slate-200" />
                  <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                    <p className="text-sm font-bold text-ink mb-1">Academic Information</p>
                    <p className="text-[12px] text-slate-500">Your College ID, Department, and Year are managed by the institution.</p>
                  </div>
                </>
              )}

              <hr className="border-slate-200" />
              <h3 className="text-base font-bold text-ink">Professional Links</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelStyles}>LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    className={inputStyles}
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
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button type="submit" disabled={isLoading} className="rounded-full px-6">
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="rounded-full">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 space-y-6">
              {user?.role === "alumni" && (
                <>
                  <Card>
                    <h2 className="text-[15px] font-bold text-ink mb-4">Education at NEC</h2>
                    <div className="space-y-1">
                      <p className="text-[14px] font-semibold text-ink">{user?.degree || "Degree not specified"}</p>
                      <p className="text-slate-500 font-medium text-[13px]">Completed Department: <span className="text-ink">{user?.department?.name || "N/A"}</span></p>
                      <p className="text-slate-500 text-[13px]">Batch: {user?.batch || "N/A"}</p>
                    </div>
                  </Card>

                  <Card>
                    <h2 className="text-[15px] font-bold text-ink mb-4">Current Professional Information</h2>
                    <div className="space-y-1">
                      <p className="text-[14px] font-semibold text-ink">{user?.currentRole || "Role not specified"}</p>
                      <p className="text-slate-500 font-medium text-[13px]">{user?.currentCompany || "Company not specified"}</p>
                      {user?.location && (
                        <p className="text-slate-500 text-[13px] flex items-center gap-1.5 mt-2">
                          <FiMapPin className="text-brand" />
                          {user?.location}
                        </p>
                      )}
                    </div>
                  </Card>
                </>
              )}

              <Card>
                <h2 className="text-[15px] font-bold text-ink mb-3">About</h2>
                <div className="text-slate-500 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {user?.bio ? user.bio : "No bio added yet."}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <h2 className="text-[14px] font-bold text-ink mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.length > 0 ? (
                    user.skills.map((skill, idx) => (
                      <Badge key={idx} variant="default">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-[12px] text-slate-500">No skills listed.</span>
                  )}
                </div>
              </Card>

              {(user?.linkedinLink || user?.githubLink || user?.portfolioLink) && (
                <Card>
                  <h2 className="text-[14px] font-bold text-ink mb-4">Professional Links</h2>
                  <div className="space-y-4">
                    {user?.linkedinLink && (
                      <a href={user.linkedinLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[13px] text-slate-500 hover:text-brand transition-colors font-medium">
                        <div className="rounded-full bg-slate-50 p-2 border border-slate-200"><FiLinkedin size={14} className="text-[#0A66C2]" /></div>
                        LinkedIn
                      </a>
                    )}
                    {user?.githubLink && (
                      <a href={user.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[13px] text-slate-500 hover:text-brand transition-colors font-medium">
                        <div className="rounded-full bg-slate-50 p-2 border border-slate-200"><FiGithub size={14} /></div>
                        GitHub
                      </a>
                    )}
                    {user?.portfolioLink && (
                      <a href={user.portfolioLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[13px] text-slate-500 hover:text-brand transition-colors font-medium">
                        <div className="rounded-full bg-slate-50 p-2 border border-slate-200"><FiLink size={14} /></div>
                        Portfolio
                      </a>
                    )}
                  </div>
                </Card>
              )}
            </div>
            
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import HomeActionRow from "../components/HomeActionRow";
import CreatePost from "../components/CreatePost";
import { FiX } from "react-icons/fi";
import api from "../services/api";
import { FiUsers, FiBookOpen, FiCalendar, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import NECSpotlight from "../components/spotlight/NECSpotlight";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  
  const handlePostCreated = (newPost) => {
    // If they have a feed, update it
    if (typeof setPosts !== 'undefined' && typeof posts !== 'undefined') {
       setPosts([newPost, ...posts]);
    }
    setShowCreatePost(false);
  };

  return (
    <DashboardLayout>
      <NECSpotlight />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink font-display">Welcome back, Professor {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-1">Here is your teaching overview for today.</p>
      </div>

      <HomeActionRow onCreatePostClick={() => setShowCreatePost(true)} />

      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={() => setShowCreatePost(false)}>
          <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCreatePost(false)} className="absolute -top-10 right-0 p-2 text-white hover:text-slate-200 transition-colors">
              <FiX size={24} />
            </button>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-brand/10 text-brand rounded-xl">
            <FiBookOpen size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">3</h3>
            <p className="text-sm text-slate-500 font-medium">Classes Today</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FiUsers size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">12</h3>
            <p className="text-sm text-slate-500 font-medium">Pending Requests</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <FiCalendar size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">2</h3>
            <p className="text-sm text-slate-500 font-medium">Upcoming Classes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-ink">Today's Schedule</h2>
            <Link to="/academic" className="text-sm text-brand font-bold hover:underline">View Timetable</Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="mt-1 flex flex-col items-center">
                <span className="text-sm font-bold text-ink">09:30</span>
                <span className="text-xs text-slate-500">AM</span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <h4 className="font-bold text-ink">Database Management Systems</h4>
                <p className="text-sm text-slate-500">III Year - Section A • Room 204</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="mt-1 flex flex-col items-center">
                <span className="text-sm font-bold text-ink">11:15</span>
                <span className="text-xs text-slate-500">AM</span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <h4 className="font-bold text-ink">Operating Systems</h4>
                <p className="text-sm text-slate-500">II Year - Section B • Lab 1</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-ink">Pending Actions</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="font-bold text-sm text-ink">Mentorship Request</p>
                  <p className="text-xs text-slate-500">From Rahul (III Year CSE)</p>
                </div>
              </div>
              <Link to="/mentorship" className="text-xs font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-lg">Review</Link>
            </div>
            
            <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="font-bold text-sm text-ink">Project Approval</p>
                  <p className="text-xs text-slate-500">AI Attendance System</p>
                </div>
              </div>
              <Link to="/projects" className="text-xs font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-lg">Review</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;

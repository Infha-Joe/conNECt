import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { FiSearch, FiMail, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";

const FacultyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get(`/users/search?role=student&query=${search}`);
      setStudents(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink font-display">My Students</h1>
          <p className="text-sm text-slate-500 mt-1">Directory of students under your classes and mentorship.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(n => <div key={n} className="bg-white rounded-xl h-24 border border-slate-100 animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => (
            <div key={student._id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-brand/30 transition-colors flex items-start gap-4 shadow-sm">
              <img src={student.profilePhoto || `https://ui-avatars.com/api/?name=${student.name}`} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${student._id}`} className="font-bold text-ink hover:text-brand block break-words">
                  {student.name}
                </Link>
                <p className="text-xs text-slate-500 break-words">{student.collegeId} • Year {student.year}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold py-1.5 rounded-lg border border-slate-200 flex justify-center items-center gap-1.5">
                    <FiMail size={12} /> Message
                  </button>
                  <button className="flex-1 bg-brand/5 hover:bg-brand/10 text-brand text-xs font-bold py-1.5 rounded-lg border border-brand/20 flex justify-center items-center gap-1.5">
                    <FiBookOpen size={12} /> Academics
                  </button>
                </div>
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-500">
              No students found.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default FacultyStudents;

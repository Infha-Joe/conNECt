import { useState } from "react";
import SpotlightOrbit from "./SpotlightOrbit";
import SpotlightModal from "./SpotlightModal";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiAward, FiBriefcase, FiX } from "react-icons/fi";

const SPOTLIGHT_DATA = {
  students: [
    { id: "s1", role: "student", name: "Rahul Sharma", department: "Computer Science", year: "3rd Year", bio: "Full-stack web developer passionate about React and Node.js. Looking for summer internships." },
    { id: "s2", role: "student", name: "Priya Patel", department: "Information Technology", year: "4th Year", bio: "AI/ML enthusiast and head of the technical club. Building intelligent systems." },
    { id: "s3", role: "student", name: "Arjun Reddy", department: "Electronics", year: "3rd Year", bio: "Hardware hacker, IoT developer, and open source contributor." },
    { id: "s4", role: "student", name: "Neha Gupta", department: "Computer Science", year: "2nd Year", bio: "Competitive programmer and UI/UX designer." },
    { id: "s5", role: "student", name: "Vikram Singh", department: "Mechanical", year: "4th Year", bio: "Automotive design lead for the college racing team." },
    { id: "s6", role: "student", name: "Ananya Iyer", department: "Information Technology", year: "3rd Year", bio: "Cloud computing learner and technical writer." }
  ],
  faculty: [
    { id: "f1", role: "teacher", name: "Dr. Rajesh K.", department: "Computer Science", designation: "Professor", bio: "20+ years of research in Distributed Systems and Cloud Computing." },
    { id: "f2", role: "teacher", name: "Prof. Meera R.", department: "Information Technology", designation: "Associate Professor", bio: "Specializes in Data Science and Machine Learning algorithms." },
    { id: "f3", role: "teacher", name: "Dr. Suresh M.", department: "Electronics", designation: "HOD", bio: "Leading research in embedded systems and VLSI design." },
    { id: "f4", role: "teacher", name: "Prof. Anita D.", department: "Computer Science", designation: "Assistant Professor", bio: "Teaches Web Technologies and oversees the student developer clubs." },
    { id: "f5", role: "teacher", name: "Dr. Vikram J.", department: "Mechanical", designation: "Professor", bio: "Robotics and Automation expert." }
  ],
  alumni: [
    { id: "a1", role: "alumni", name: "Karthik Nair", department: "Computer Science", degree: "B.Tech", batch: "2019-2023", currentRole: "Software Engineer", currentCompany: "Google", bio: "Working on scalable distributed systems. Happy to mentor current students!" },
    { id: "a2", role: "alumni", name: "Sneha Rao", department: "Information Technology", degree: "B.Tech", batch: "2018-2022", currentRole: "Product Manager", currentCompany: "Microsoft", bio: "Transitioned from SWE to Product. Building enterprise tools." },
    { id: "a3", role: "alumni", name: "Manoj Tiwari", department: "Electronics", degree: "B.Tech", batch: "2017-2021", currentRole: "Hardware Engineer", currentCompany: "Intel", bio: "Designing next-gen processors. Reach out for semiconductor queries." },
    { id: "a4", role: "alumni", name: "Divya K.", department: "Computer Science", degree: "B.Tech", batch: "2020-2024", currentRole: "SDE I", currentCompany: "Amazon", bio: "Recent grad currently in the AWS team." },
    { id: "a5", role: "alumni", name: "Rohan Mehta", department: "Mechanical", degree: "B.Tech", batch: "2016-2020", currentRole: "Design Engineer", currentCompany: "Tesla", bio: "Working on manufacturing automation." },
    { id: "a6", role: "alumni", name: "Pooja Verma", department: "Information Technology", degree: "B.Tech", batch: "2019-2023", currentRole: "Data Scientist", currentCompany: "IBM", bio: "Focusing on enterprise AI solutions." }
  ]
};

const CATEGORIES = [
  { id: 'students', label: 'Students', icon: FiUsers },
  { id: 'faculty', label: 'Faculty', icon: FiAward },
  { id: 'alumni', label: 'Alumni', icon: FiBriefcase }
];

const NECSpotlight = () => {
  const [activeOrbitCategory, setActiveOrbitCategory] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const getTitle = () => {
    switch (activeOrbitCategory) {
      case "students": return "Student";
      case "faculty": return "Faculty";
      case "alumni": return "Alumni";
      default: return "Spotlight";
    }
  };

  return (
    <div className="mb-8 mt-2">
      <div className="mb-4 px-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
          NEC Spotlight
        </h2>
      </div>

      {/* Default Horizontal Layout */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-2">
        {CATEGORIES.map(category => (
          <button 
            key={category.id} 
            onClick={() => setActiveOrbitCategory(category.id)}
            className="flex flex-col items-center gap-2 group outline-none shrink-0"
          >
            <div className="h-16 w-16 flex items-center justify-center rounded-full border-2 border-slate-200 group-hover:border-brand transition-colors bg-white shadow-sm text-slate-500 group-hover:text-brand">
              <category.icon size={24} />
            </div>
            <span className="text-[12px] font-semibold text-slate-500 group-hover:text-ink transition-colors">
              {category.label}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Orbit Popup / Modal */}
      <AnimatePresence>
        {activeOrbitCategory && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveOrbitCategory(null)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl bg-slate-50 shadow-2xl border border-slate-200 overflow-hidden flex flex-col items-center pt-8 pb-12"
            >
              <button 
                onClick={() => setActiveOrbitCategory(null)}
                className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-ink transition-colors shadow-sm border border-slate-200 z-50"
              >
                <FiX size={18} />
              </button>
              
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-2">Interactive Orbit</h3>
              <p className="text-[11px] text-slate-500 mb-8">Swipe or use arrows to rotate.</p>

              <SpotlightOrbit 
                title={getTitle()} 
                items={SPOTLIGHT_DATA[activeOrbitCategory]} 
                onPersonClick={setSelectedPerson} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Person Details Modal (Stacked above the Orbit Modal) */}
      <SpotlightModal 
        person={selectedPerson} 
        onClose={() => setSelectedPerson(null)} 
      />
    </div>
  );
};

export default NECSpotlight;

const fs = require('fs');

const code = `import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiX, FiUser } from "react-icons/fi";
import SpotlightModal from "./SpotlightModal";

const SPOTLIGHT_DATA = {
  students: [
    { id: "s1", role: "student", name: "Rahul Sharma", department: "Computer Science", year: "3rd Year", bio: "Full-stack web developer passionate about React and Node.js. Looking for summer internships." },
    { id: "s2", role: "student", name: "Priya Patel", department: "Information Technology", year: "4th Year", bio: "AI/ML enthusiast and head of the technical club. Building intelligent systems." },
    { id: "s3", role: "student", name: "Arjun Reddy", department: "Electronics", year: "3rd Year", bio: "Hardware hacker, IoT developer, and open source contributor." }
  ],
  faculty: [
    { id: "f1", role: "teacher", name: "Dr. Rajesh K.", department: "Computer Science", designation: "Professor", bio: "20+ years of research in Distributed Systems and Cloud Computing." },
    { id: "f2", role: "teacher", name: "Prof. Meera R.", department: "Information Technology", designation: "Associate Professor", bio: "Specializes in Data Science and Machine Learning algorithms." }
  ],
  alumni: [
    { id: "a1", role: "alumni", name: "Karthik Nair", department: "Computer Science", degree: "B.Tech", batch: "2019-2023", currentRole: "Software Engineer", currentCompany: "Google", bio: "Working on scalable distributed systems. Happy to mentor current students!" }
  ]
};

// Combine all users into a single list
const ALL_SPOTLIGHT_USERS = [
  ...SPOTLIGHT_DATA.students,
  ...SPOTLIGHT_DATA.faculty,
  ...SPOTLIGHT_DATA.alumni
];

const NECSpotlight = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
        >
          <FiStar size={18} />
          <span>Spotlight</span>
        </button>
      </div>

      {/* Main Spotlight Drawer / Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 text-ink font-bold">
                  <FiStar className="text-brand" />
                  <h2>NEC Spotlight</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-ink transition-colors shadow-sm border border-slate-200"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto bg-white flex-1 space-y-3">
                {ALL_SPOTLIGHT_USERS.length === 0 ? (
                  <p className="text-center text-slate-500 py-10">No one is currently featured in NEC Spotlight.</p>
                ) : (
                  ALL_SPOTLIGHT_USERS.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => setSelectedPerson(person)}
                      className="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:border-brand/50 hover:bg-brand/5 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
                        {person.profilePhoto ? (
                          <img src={person.profilePhoto} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <FiUser size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-ink text-sm truncate">{person.name}</h4>
                        <div className="text-xs text-slate-500 mt-0.5 flex gap-1 items-center">
                          <span className="capitalize font-semibold text-brand">{person.role}</span>
                          <span>&middot;</span>
                          <span className="truncate">{person.department}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reusing existing Person Profile Modal */}
      {selectedPerson && (
        <SpotlightModal 
          person={selectedPerson} 
          onClose={() => setSelectedPerson(null)} 
        />
      )}
    </>
  );
};

export default NECSpotlight;
`;

fs.writeFileSync('client/src/components/spotlight/NECSpotlight.jsx', code);
console.log("Rewrote NECSpotlight.jsx");

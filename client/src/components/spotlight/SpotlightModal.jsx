import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import Avatar from "../ui/Avatar";

const SpotlightModal = ({ person, onClose }) => {
  if (!person) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden z-10"
        >
          <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-ink transition-colors"
          >
            <FiX size={18} />
          </button>

          <div className="px-6 pb-6 relative">
            <div className="absolute -top-12 rounded-full border-4 border-white bg-white shadow-sm">
              <Avatar name={person.name} size="xl" className="h-20 w-20 border-0" />
            </div>

            <div className="pt-12">
              <h3 className="text-xl font-bold text-ink">{person.name}</h3>
              
              {/* Role specific rendering */}
              <div className="mt-1">
                {person.role === "student" && (
                  <p className="text-sm font-medium text-brand">
                    {person.department} &bull; {person.year}
                  </p>
                )}
                {person.role === "teacher" && (
                  <p className="text-sm font-medium text-brand">
                    {person.designation} &bull; {person.department}
                  </p>
                )}
                {person.role === "alumni" && (
                  <div>
                    <p className="text-sm font-medium text-brand">
                      {person.currentRole} {person.currentCompany && `at ${person.currentCompany}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {person.degree} in {person.department} &bull; Batch of {person.batch}
                    </p>
                  </div>
                )}
              </div>

              {person.bio && (
                <p className="mt-4 text-[13px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
                  {person.bio}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpotlightModal;

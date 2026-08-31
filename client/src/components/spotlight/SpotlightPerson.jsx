import Avatar from "../ui/Avatar";
import { motion } from "framer-motion";

const SpotlightPerson = ({ person, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(person)}
      className="flex flex-col items-center gap-1.5 group outline-none"
    >
      <div className="rounded-full border border-slate-200 p-1 group-hover:border-brand transition-colors bg-white shadow-sm">
        <Avatar name={person.name} size="lg" className="h-14 w-14" />
      </div>
      <span className="text-[11px] font-semibold text-slate-500 group-hover:text-ink transition-colors truncate w-20 text-center capitalize drop-shadow-sm bg-white/80 rounded-full px-1">
        {person.name.split(" ")[0]}
      </span>
    </motion.button>
  );
};

export default SpotlightPerson;

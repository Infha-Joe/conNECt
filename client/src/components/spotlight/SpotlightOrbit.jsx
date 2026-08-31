import { useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import SpotlightPerson from "./SpotlightPerson";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SpotlightOrbit = ({ items, title, onPersonClick }) => {
  const rotation = useMotionValue(0);
  const containerRef = useRef(null);
  
  // Compact radius to prevent huge empty spaces
  const radius = 95; 
  const centerSize = 80;
  
  const numItems = items.length;
  
  const handleNext = () => {
    animate(rotation, rotation.get() - (360 / numItems), { type: "spring", stiffness: 300, damping: 30 });
  };

  const handlePrev = () => {
    animate(rotation, rotation.get() + (360 / numItems), { type: "spring", stiffness: 300, damping: 30 });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full py-4 overflow-hidden select-none">
      
      {/* Controls */}
      <div className="absolute flex justify-between w-full max-w-[280px] px-2 z-10 pointer-events-none">
        <button onClick={handlePrev} className="pointer-events-auto h-8 w-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-ink hover:border-brand shadow-sm transition-colors">
          <FiChevronLeft size={18} />
        </button>
        <button onClick={handleNext} className="pointer-events-auto h-8 w-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-ink hover:border-brand shadow-sm transition-colors">
          <FiChevronRight size={18} />
        </button>
      </div>

      <div className="relative" style={{ width: radius * 2 + 60, height: radius * 2 + 60 }}>
        {/* Center Hub */}
        <div className="absolute inset-0 m-auto flex flex-col items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm z-10" style={{ width: centerSize, height: centerSize }}>
          <span className="text-[10px] font-bold tracking-wider text-brand uppercase text-center leading-tight">
            {title}
          </span>
          <span className="text-[9px] font-semibold text-ink uppercase mt-0.5 tracking-widest">
            Spotlight
          </span>
        </div>

        {/* Orbit Ring */}
        <div className="absolute inset-0 m-auto rounded-full border border-slate-200 border-dashed opacity-50 pointer-events-none" style={{ width: radius * 2, height: radius * 2 }} />

        {/* Rotating Container */}
        <motion.div
          ref={containerRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDrag={(e, info) => {
            rotation.set(rotation.get() + info.delta.x * 0.4);
          }}
          onDragEnd={(e, info) => {
             const currentRotation = rotation.get();
             const snapAngle = 360 / numItems;
             const velocityTarget = currentRotation + info.velocity.x * 0.1;
             const finalSnap = Math.round(velocityTarget / snapAngle) * snapAngle;
             animate(rotation, finalSnap, { type: "spring", stiffness: 200, damping: 25 });
          }}
          style={{ rotate: rotation, width: '100%', height: '100%' }}
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
        >
          {items.map((item, index) => {
            const angle = (index / numItems) * 360;
            const angleRad = (angle * Math.PI) / 180;
            
            // Standard JS math to position elements in a circle
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <div 
                key={item.id} 
                className="absolute left-1/2 top-1/2"
                style={{ 
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` 
                }}
              >
                {/* Counter-rotate the individual item so it stays upright */}
                <motion.div style={{ rotate: useTransform(rotation, r => -r) }}>
                  <SpotlightPerson person={item} onClick={onPersonClick} />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default SpotlightOrbit;

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const lettersData = [
  { id: 0, char: 'c', isCenter: false, offset: { x: -12, y: -25, rotate: -8 } },
  { id: 1, char: 'o', isCenter: false, offset: { x: 15,  y: 30,  rotate: 6 } },
  { id: 2, char: 'n', isCenter: false, offset: { x: -18, y: -15, rotate: -5 } },
  { id: 3, char: 'n', isCenter: true,  offset: { x: 12,  y: -28, rotate: 7 } },
  { id: 4, char: 'e', isCenter: true,  offset: { x: -14, y: 22,  rotate: -8 } },
  { id: 5, char: 'c', isCenter: true,  offset: { x: 16,  y: -20, rotate: 5 } },
  { id: 6, char: 't', isCenter: false, offset: { x: -10, y: 26,  rotate: -7 } },
];

const OpeningAnimation = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  // Sequence Steps:
  // 0: Initial separated offsets
  // 1: Settle into aligned boxes (with gaps)
  // 2: Connect (boxes touch)
  // 3: Transform into clean wordmark
  // 4: NEC 3D flip starts (rotateY 90)
  // 5: NEC 3D flip finishes (rotateY 0 + color/text swap)
  // 6: Exit

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setStep(5);
      const timer = setTimeout(() => {
        setStep(6);
        setTimeout(onComplete, 300);
      }, 1000);
      return () => clearTimeout(timer);
    }

    const timers = [
      setTimeout(() => setStep(1), 50),     // Settling (0-400ms)
      setTimeout(() => setStep(2), 450),    // Connect (450-850ms)
      setTimeout(() => setStep(3), 850),    // Wordmark (850-1200ms)
      setTimeout(() => setStep(4), 1250),   // Flip starts (1250-1450ms)
      setTimeout(() => setStep(5), 1450),   // Flip swaps  (1450-1700ms)
      setTimeout(() => setStep(6), 2200),   // Hold then exit
      setTimeout(() => onComplete(), 2600)  // Unmount
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const isSettle = step >= 1;
  const isConnected = step >= 2;
  const isWordmark = step >= 3;
  const isFlipping = step === 4;
  const isFlipped = step >= 5;

  return (
    <AnimatePresence>
      {step < 6 && (
        <motion.div 
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 overflow-hidden"
        >
          <div className="flex items-center justify-center" style={{ perspective: 1200 }}>
            {lettersData.map((data) => {
              // 1. Initial State -> Settle State
              const tx = !isSettle ? data.offset.x : 0;
              const ty = !isSettle ? data.offset.y : 0;
              const rot = !isSettle ? data.offset.rotate : 0;
              const opacity = isSettle ? 1 : 0;
              const scale = isSettle ? 1 : 0.8;

              // 2. Box UI transformations
              let boxClasses = "border-2 rounded-lg ";
              if (isWordmark) {
                boxClasses += "bg-transparent border-transparent shadow-[0px_0px_0px_transparent] text-ink ";
                boxClasses += "w-auto h-auto px-[0.5px] sm:px-[1px] py-1";
              } else {
                boxClasses += "bg-white border-slate-200 shadow-[2px_4px_0px_#e2e8f0] text-ink ";
                boxClasses += "w-11 h-14 sm:w-16 sm:h-20";
              }

              // 3. Margin transformations (Connect)
              let marginClass = isConnected ? "mx-0" : "mx-1.5 sm:mx-2";
              if (isWordmark) marginClass = "mx-[0.5px] sm:mx-[1px]";

              return (
                <motion.div
                  key={data.id}
                  layout
                  initial={false}
                  animate={{
                    x: tx,
                    y: ty,
                    rotate: rot,
                    opacity: opacity,
                    scale: scale,
                  }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 350, damping: 30 },
                    x: { type: "spring", stiffness: 350, damping: 25, delay: step === 1 ? data.id * 0.025 : 0 },
                    y: { type: "spring", stiffness: 350, damping: 25, delay: step === 1 ? data.id * 0.025 : 0 },
                    rotate: { type: "spring", stiffness: 350, damping: 25, delay: step === 1 ? data.id * 0.025 : 0 },
                    opacity: { duration: 0.2, delay: step === 1 ? data.id * 0.025 : 0 },
                    scale: { type: "spring", stiffness: 350, damping: 25, delay: step === 1 ? data.id * 0.025 : 0 }
                  }}
                  className={`
                    flex items-center justify-center font-display font-medium text-4xl sm:text-6xl
                    transition-all duration-400 ease-in-out box-border
                    ${boxClasses} ${marginClass}
                  `}
                >
                  <motion.span
                    initial={{ rotateY: 0 }}
                    animate={
                      data.isCenter 
                        ? { rotateY: isFlipping ? 90 : (isFlipped ? 0 : 0) } 
                        : {}
                    }
                    transition={{ duration: 0.2, ease: "linear" }}
                    style={{ transformOrigin: "center" }}
                    className={`inline-block transition-colors duration-200 ${
                      data.isCenter && isFlipped ? "text-brand font-bold" : "text-ink"
                    }`}
                  >
                    {data.isCenter && isFlipped ? data.char.toUpperCase() : data.char}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningAnimation;

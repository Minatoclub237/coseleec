import { useState, useRef } from "react";
import { motion } from "motion/react";
import { StatCardData } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TelemetryCarouselProps {
  cards: StatCardData[];
}

export function TelemetryCarousel({ cards }: TelemetryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 50; // swipe threshold
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 overflow-hidden select-none">
      {/* Cards Stage */}
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-[520px]"
        style={{ perspective: "1000px" }}
      >
        <motion.div 
          className="relative flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {cards.map((card, idx) => {
            // Calculate the circular distance between idx and activeIndex
            let offset = idx - activeIndex;
            
            // To make it loop smoothly and take the shortest path
            const total = cards.length;
            if (offset > total / 2) {
              offset -= total;
            } else if (offset < -total / 2) {
              offset += total;
            }

            const isActive = idx === activeIndex;
            const isVisible = Math.abs(offset) <= 2; // only show nearest cards

            if (!isVisible) return null;

            return (
              <motion.div
                key={idx}
                className="absolute"
                style={{
                  zIndex: 10 - Math.abs(offset),
                  transformOrigin: "center center",
                }}
                animate={{
                  x: offset * 320, // offset separation
                  scale: isActive ? 1.0 : 0.85,
                  rotateY: offset * -25,
                  z: isActive ? 0 : -150,
                  opacity: isActive ? 1.0 : 0.4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(idx);
                  }
                }}
              >
                <div className="stat-card-outer cursor-pointer transition-colors duration-300 hover:border-white/10 border border-transparent">
                  <div className="stat-card-inner">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="stat-title">{card.title}</span>
                        {isActive && (
                          <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">
                            Actif
                          </span>
                        )}
                      </div>
                      <div className="stat-value">{card.value}</div>
                    </div>
                    <div className="stat-details">
                      {card.details.map((d, dIdx) => (
                        <div key={dIdx} className="stat-detail">
                          <span className="dot" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="stat-footer">{card.footer}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Manual Indicator Controls */}
      <div className="flex items-center gap-6 mt-4 z-40">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 active:scale-95 transition-all"
          aria-label="Previous stream"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 active:scale-95 transition-all"
          aria-label="Next stream"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { getBackdropUrl } from "../tmdb/tmdbApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function HeroSection({ items, onInfoClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = items?.[currentIndex];

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  if (!featured) return <div className="h-[56vw] max-h-[800px] bg-[#141414]" />;

  const mediaType = featured.media_type || (featured.first_air_date ? "tv" : "movie");
  const title = featured.title || featured.name;
  const backdrop = getBackdropUrl(featured.backdrop_path);

  return (
    <div className="relative h-[56vw] max-h-[800px] min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {backdrop && (
            <img
              src={backdrop}
              alt={title}
              className="w-full h-full object-cover object-top"
            />
          )}
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-[15%] sm:bottom-[20%] md:bottom-[30%] left-4 sm:left-6 md:left-12 z-10 max-w-sm sm:max-w-lg md:max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 drop-shadow-lg leading-tight">
              {title}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 md:mb-6 drop-shadow-md max-w-xs sm:max-w-md">
              {featured.overview}
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to={createPageUrl("Watch") + `?id=${featured.id}&type=${mediaType}`}
                className="flex items-center gap-1.5 sm:gap-2 bg-white text-black font-bold px-4 sm:px-5 md:px-8 py-1.5 sm:py-2 md:py-3 rounded-md hover:bg-white/80 active:scale-95 transition text-xs sm:text-sm md:text-base"
              >
                <Play className="w-4 sm:w-5 h-4 sm:h-5 fill-black" />
                Play
              </Link>
              <button
                onClick={() => onInfoClick?.(featured, mediaType)}
                className="flex items-center gap-1.5 sm:gap-2 bg-gray-500/70 text-white font-bold px-4 sm:px-5 md:px-8 py-1.5 sm:py-2 md:py-3 rounded-md hover:bg-gray-500/50 active:scale-95 transition text-xs sm:text-sm md:text-base"
              >
                <Info className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">More Info</span>
                <span className="sm:hidden">Info</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicator dots */}
      <div className="absolute bottom-[12%] right-4 md:right-12 flex items-center gap-1 z-10">
        {items?.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 md:w-4 h-0.5 rounded transition-all ${
              i === currentIndex ? "bg-white w-6 md:w-8" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
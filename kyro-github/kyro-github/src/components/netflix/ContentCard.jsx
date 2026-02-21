import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { getImageUrl } from "../tmdb/tmdbApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function ContentCard({ item, onInfoClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie");
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").split("-")[0];
  const rating = item.vote_average ? Math.round(item.vote_average * 10) : null;
  const poster = getImageUrl(item.poster_path, "w342");

  if (!poster) return null;

  return (
    <motion.div
      className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px] lg:w-[240px] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative rounded-md overflow-hidden aspect-[2/3]">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Link
              to={createPageUrl("Watch") + `?id=${item.id}&type=${mediaType}`}
              className="bg-white rounded-full p-1.5 hover:bg-white/80 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-3.5 h-3.5 text-black fill-black" />
            </Link>
            <button className="border border-gray-400 rounded-full p-1.5 hover:border-white transition">
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
            <button className="border border-gray-400 rounded-full p-1.5 hover:border-white transition">
              <ThumbsUp className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              className="border border-gray-400 rounded-full p-1.5 hover:border-white transition ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick?.(item, mediaType);
              }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <p className="text-white text-xs font-semibold truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            {rating && (
              <span className="text-green-400 text-[10px] font-bold">{rating}% Match</span>
            )}
            {year && <span className="text-gray-400 text-[10px]">{year}</span>}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
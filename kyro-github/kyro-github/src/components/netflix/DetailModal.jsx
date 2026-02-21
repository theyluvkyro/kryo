import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, ThumbsUp, Volume2, VolumeX } from "lucide-react";
import { getBackdropUrl, getImageUrl, getMovieDetails, getTVDetails, getTVSeasonDetails } from "../tmdb/tmdbApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailModal({ item, mediaType, onClose }) {
  const [details, setDetails] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item) return;
    setLoading(true);
    const fetchDetails = async () => {
      const data = mediaType === "tv"
        ? await getTVDetails(item.id)
        : await getMovieDetails(item.id);
      setDetails(data);
      if (mediaType === "tv" && data.seasons?.length > 0) {
        const firstRealSeason = data.seasons.find(s => s.season_number > 0);
        const sNum = firstRealSeason ? firstRealSeason.season_number : 1;
        setSelectedSeason(sNum);
        const sd = await getTVSeasonDetails(item.id, sNum);
        setSeasonData(sd);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [item, mediaType]);

  useEffect(() => {
    if (!item || mediaType !== "tv" || !details) return;
    const fetchSeason = async () => {
      const sd = await getTVSeasonDetails(item.id, selectedSeason);
      setSeasonData(sd);
    };
    fetchSeason();
  }, [selectedSeason]);

  if (!item) return null;

  const title = item.title || item.name;
  const backdrop = getBackdropUrl(item.backdrop_path);
  const rating = item.vote_average ? Math.round(item.vote_average * 10) : null;
  const year = (item.release_date || item.first_air_date || "").split("-")[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 md:pt-16 overflow-y-auto px-2 sm:px-4"
        onClick={onClose}
      >
        <div className="fixed inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-[95%] max-w-3xl bg-[#181818] rounded-lg overflow-hidden shadow-2xl mb-16 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero */}
          <div className="relative aspect-video">
            {backdrop ? (
              <img src={backdrop} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#333]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-[#181818] rounded-full p-1.5 hover:bg-[#333] transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-6 left-6 md:left-10">
              <h2 className="text-white text-2xl md:text-4xl font-black mb-3 drop-shadow-lg">{title}</h2>
              <div className="flex gap-2">
                <Link
                  to={createPageUrl("Watch") + `?id=${item.id}&type=${mediaType}${mediaType === "tv" ? `&s=1&e=1` : ""}`}
                  className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2 rounded-md hover:bg-white/80 transition text-sm"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Play
                </Link>
                <button className="border-2 border-gray-400 rounded-full p-2 hover:border-white transition">
                  <Plus className="w-4 h-4 text-white" />
                </button>
                <button className="border-2 border-gray-400 rounded-full p-2 hover:border-white transition">
                  <ThumbsUp className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {rating && <span className="text-green-400 font-bold text-sm">{rating}% Match</span>}
              {year && <span className="text-gray-400 text-sm">{year}</span>}
              {details?.runtime && (
                <span className="text-gray-400 text-sm">
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </span>
              )}
              {details?.number_of_seasons && (
                <span className="text-gray-400 text-sm">
                  {details.number_of_seasons} Season{details.number_of_seasons > 1 ? "s" : ""}
                </span>
              )}
              <span className="border border-gray-500 text-gray-400 text-[10px] px-1.5 py-0.5 rounded">HD</span>
            </div>

            <p className="text-white/90 text-sm leading-relaxed mb-6">{item.overview}</p>

            {/* Cast & Genres */}
            {details && (
              <div className="text-sm text-gray-400 space-y-1 mb-6">
                {details.genres?.length > 0 && (
                  <p><span className="text-gray-500">Genres: </span>{details.genres.map(g => g.name).join(", ")}</p>
                )}
                {details.credits?.cast?.length > 0 && (
                  <p><span className="text-gray-500">Cast: </span>{details.credits.cast.slice(0, 5).map(c => c.name).join(", ")}</p>
                )}
              </div>
            )}

            {/* Episodes for TV */}
            {mediaType === "tv" && details?.seasons && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-xl font-bold">Episodes</h3>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-[#242424] border border-gray-600 text-white text-sm rounded px-3 py-1.5 outline-none"
                  >
                    {details.seasons
                      .filter((s) => s.season_number > 0)
                      .map((s) => (
                        <option key={s.season_number} value={s.season_number}>
                          Season {s.season_number}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-3">
                  {seasonData?.episodes?.map((ep) => (
                    <Link
                      key={ep.episode_number}
                      to={createPageUrl("Watch") + `?id=${item.id}&type=tv&s=${selectedSeason}&e=${ep.episode_number}`}
                      className="flex gap-4 p-3 rounded-md hover:bg-[#333] transition group"
                    >
                      <div className="flex-shrink-0 w-8 text-gray-500 text-lg font-medium flex items-center justify-center">
                        {ep.episode_number}
                      </div>
                      <div className="flex-shrink-0 w-32 aspect-video rounded overflow-hidden relative">
                        {ep.still_path ? (
                          <img
                            src={getImageUrl(ep.still_path, "w300")}
                            alt={ep.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#333]" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="w-8 h-8 text-white fill-white drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-white text-sm font-medium truncate">{ep.name}</p>
                          {ep.runtime && (
                            <span className="text-gray-500 text-xs flex-shrink-0 ml-2">{ep.runtime}m</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2 mt-1">{ep.overview}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Similar */}
            {details?.similar?.results?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-white text-xl font-bold mb-4">More Like This</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {details.similar.results.slice(0, 9).map((sim) => {
                    const simPoster = getImageUrl(sim.backdrop_path || sim.poster_path, "w300");
                    if (!simPoster) return null;
                    return (
                      <Link
                        key={sim.id}
                        to={createPageUrl("Watch") + `?id=${sim.id}&type=${mediaType}`}
                        className="rounded-md overflow-hidden bg-[#2f2f2f] hover:bg-[#3a3a3a] transition"
                      >
                        <img src={simPoster} alt={sim.title || sim.name} className="w-full aspect-video object-cover" />
                        <div className="p-2">
                          <p className="text-white text-xs font-medium truncate">{sim.title || sim.name}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getMovieDetails, getTVDetails } from "@/components/tmdb/tmdbApi";
import { ArrowLeft, Tv } from "lucide-react";
import { createPageUrl } from "@/utils";
import NetflixLoader from "@/components/netflix/NetflixLoader";

export default function Watch() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "movie";
  const season = searchParams.get("s") || "1";
  const episode = searchParams.get("e") || "1";

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const data = type === "tv" ? await getTVDetails(id) : await getMovieDetails(id);
      setDetails(data);
      setLoading(false);
    };
    fetch();
  }, [id, type]);

  const embedUrl =
    type === "tv"
      ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
      : `https://vidsrc.to/embed/movie/${id}`;

  const title = details?.title || details?.name || "Loading...";

  if (!id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No content selected.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-black/80 backdrop-blur-sm z-10">
        <Link
          to={createPageUrl("Home")}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[#E50914] font-black text-xl tracking-tighter">KYRO</span>
        </Link>
        <div className="flex items-center gap-2 text-gray-300 text-sm ml-2">
          <Tv className="w-4 h-4" />
          <span>{title}</span>
          {type === "tv" && (
            <span className="text-gray-500">— S{season} E{episode}</span>
          )}
        </div>
      </div>

      {/* Player */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 relative">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            frameBorder="0"
            title={title}
          />
        </div>
      )}
    </div>
  );
}

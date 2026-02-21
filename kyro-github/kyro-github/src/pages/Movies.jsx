import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "@/components/tmdb/tmdbApi";
import HeroSection from "@/components/netflix/HeroSection";
import ContentRow from "@/components/netflix/ContentRow";
import DetailModal from "@/components/netflix/DetailModal";
import NetflixLoader from "@/components/netflix/NetflixLoader";

export default function Movies() {
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const { data: popular, isLoading } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getPopularMovies(),
  });
  const { data: topRated } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => getTopRatedMovies(),
  });
  const { data: nowPlaying } = useQuery({
    queryKey: ["nowPlaying"],
    queryFn: () => getNowPlayingMovies(),
  });
  const { data: upcoming } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => getUpcomingMovies(),
  });

  const handleInfoClick = (item, type) => {
    setModalItem(item);
    setModalType(type);
  };

  if (isLoading) return <NetflixLoader />;

  const heroItems = popular?.results?.map((m) => ({ ...m, media_type: "movie" }));

  return (
    <div className="bg-[#141414] min-h-screen">
      <HeroSection items={heroItems} onInfoClick={handleInfoClick} />
      <div className="pb-16 -mt-24 relative z-10">
        <ContentRow title="Popular Movies" items={popular?.results?.map((m) => ({ ...m, media_type: "movie" }))} onInfoClick={handleInfoClick} />
        <ContentRow title="Now Playing" items={nowPlaying?.results?.map((m) => ({ ...m, media_type: "movie" }))} onInfoClick={handleInfoClick} />
        <ContentRow title="Top Rated" items={topRated?.results?.map((m) => ({ ...m, media_type: "movie" }))} onInfoClick={handleInfoClick} />
        <ContentRow title="Upcoming" items={upcoming?.results?.map((m) => ({ ...m, media_type: "movie" }))} onInfoClick={handleInfoClick} />
      </div>
      {modalItem && (
        <DetailModal item={modalItem} mediaType={modalType} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
}

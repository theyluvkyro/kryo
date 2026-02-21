import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getPopularTV,
  getTopRatedTV,
  getNowPlayingMovies,
} from "@/components/tmdb/tmdbApi";
import HeroSection from "@/components/netflix/HeroSection";
import ContentRow from "@/components/netflix/ContentRow";
import DetailModal from "@/components/netflix/DetailModal";
import NetflixLoader from "@/components/netflix/NetflixLoader";

export default function Home() {
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const { data: trending, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending("all", "week"),
  });
  const { data: popularMovies } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getPopularMovies(),
  });
  const { data: topRatedMovies } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => getTopRatedMovies(),
  });
  const { data: popularTV } = useQuery({
    queryKey: ["popularTV"],
    queryFn: () => getPopularTV(),
  });
  const { data: topRatedTV } = useQuery({
    queryKey: ["topRatedTV"],
    queryFn: () => getTopRatedTV(),
  });
  const { data: nowPlaying } = useQuery({
    queryKey: ["nowPlaying"],
    queryFn: () => getNowPlayingMovies(),
  });

  const handleInfoClick = (item, type) => {
    setModalItem(item);
    setModalType(type);
  };

  if (isLoading) return <NetflixLoader />;

  return (
    <div className="bg-[#141414] min-h-screen">
      <HeroSection items={trending?.results} onInfoClick={handleInfoClick} />
      <div className="pb-16 -mt-24 relative z-10">
        <ContentRow title="Trending Now" items={trending?.results} onInfoClick={handleInfoClick} />
        <ContentRow title="Now Playing in Theatres" items={nowPlaying?.results} onInfoClick={handleInfoClick} />
        <ContentRow title="Popular Movies" items={popularMovies?.results} onInfoClick={handleInfoClick} />
        <ContentRow title="Top Rated Movies" items={topRatedMovies?.results} onInfoClick={handleInfoClick} />
        <ContentRow title="Popular TV Shows" items={popularTV?.results} onInfoClick={handleInfoClick} />
        <ContentRow title="Top Rated TV Shows" items={topRatedTV?.results} onInfoClick={handleInfoClick} />
      </div>
      {modalItem && (
        <DetailModal
          item={modalItem}
          mediaType={modalType}
          onClose={() => setModalItem(null)}
        />
      )}
    </div>
  );
}

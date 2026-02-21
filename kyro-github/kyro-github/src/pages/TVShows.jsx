import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPopularTV,
  getTopRatedTV,
  getOnTheAirTV,
} from "@/components/tmdb/tmdbApi";
import HeroSection from "@/components/netflix/HeroSection";
import ContentRow from "@/components/netflix/ContentRow";
import DetailModal from "@/components/netflix/DetailModal";
import NetflixLoader from "@/components/netflix/NetflixLoader";

export default function TVShows() {
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const { data: popular, isLoading } = useQuery({
    queryKey: ["popularTV"],
    queryFn: () => getPopularTV(),
  });
  const { data: topRated } = useQuery({
    queryKey: ["topRatedTV"],
    queryFn: () => getTopRatedTV(),
  });
  const { data: onTheAir } = useQuery({
    queryKey: ["onTheAir"],
    queryFn: () => getOnTheAirTV(),
  });

  const handleInfoClick = (item, type) => {
    setModalItem(item);
    setModalType(type);
  };

  if (isLoading) return <NetflixLoader />;

  const heroItems = popular?.results?.map((s) => ({ ...s, media_type: "tv" }));

  return (
    <div className="bg-[#141414] min-h-screen">
      <HeroSection items={heroItems} onInfoClick={handleInfoClick} />
      <div className="pb-16 -mt-24 relative z-10">
        <ContentRow title="Popular TV Shows" items={popular?.results?.map((s) => ({ ...s, media_type: "tv" }))} onInfoClick={handleInfoClick} />
        <ContentRow title="On The Air" items={onTheAir?.results?.map((s) => ({ ...s, media_type: "tv" }))} onInfoClick={handleInfoClick} />
        <ContentRow title="Top Rated" items={topRated?.results?.map((s) => ({ ...s, media_type: "tv" }))} onInfoClick={handleInfoClick} />
      </div>
      {modalItem && (
        <DetailModal item={modalItem} mediaType={modalType} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovieGenres, getTVGenres, discoverMovies, discoverTV } from "@/components/tmdb/tmdbApi";
import ContentRow from "@/components/netflix/ContentRow";
import DetailModal from "@/components/netflix/DetailModal";
import NetflixLoader from "@/components/netflix/NetflixLoader";

export default function Browse() {
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [activeTab, setActiveTab] = useState("movies");
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { data: movieGenres, isLoading: loadingMovieGenres } = useQuery({
    queryKey: ["movieGenres"],
    queryFn: getMovieGenres,
  });
  const { data: tvGenres, isLoading: loadingTVGenres } = useQuery({
    queryKey: ["tvGenres"],
    queryFn: getTVGenres,
  });

  const genres = activeTab === "movies" ? movieGenres?.genres : tvGenres?.genres;
  const currentGenre = selectedGenre ?? genres?.[0]?.id;

  const { data: results, isLoading: loadingResults } = useQuery({
    queryKey: ["browse", activeTab, currentGenre],
    queryFn: () =>
      activeTab === "movies"
        ? discoverMovies({ with_genres: currentGenre })
        : discoverTV({ with_genres: currentGenre }),
    enabled: !!currentGenre,
  });

  const handleInfoClick = (item, type) => {
    setModalItem(item);
    setModalType(type);
  };

  if (loadingMovieGenres || loadingTVGenres) return <NetflixLoader />;

  const mediaType = activeTab === "movies" ? "movie" : "tv";
  const items = results?.results?.map((i) => ({ ...i, media_type: mediaType }));

  return (
    <div className="bg-[#141414] min-h-screen pt-24 px-4 md:px-12">
      <h1 className="text-white text-3xl font-black mb-6">Browse</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["movies", "tv"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedGenre(null); }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === tab ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {tab === "movies" ? "Movies" : "TV Shows"}
          </button>
        ))}
      </div>

      {/* Genre pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {genres?.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
              currentGenre === genre.id
                ? "bg-[#E50914] border-[#E50914] text-white"
                : "border-gray-600 text-gray-300 hover:border-white hover:text-white"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {loadingResults ? (
        <NetflixLoader />
      ) : (
        <ContentRow
          title={genres?.find((g) => g.id === currentGenre)?.name ?? ""}
          items={items}
          onInfoClick={handleInfoClick}
        />
      )}

      {modalItem && (
        <DetailModal item={modalItem} mediaType={modalType} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
}

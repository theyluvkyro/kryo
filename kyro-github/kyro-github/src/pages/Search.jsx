import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMulti } from "@/components/tmdb/tmdbApi";
import ContentCard from "@/components/netflix/ContentCard";
import DetailModal from "@/components/netflix/DetailModal";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const handleInfoClick = (item, type) => {
    setModalItem(item);
    setModalType(type);
  };

  const results = data?.results?.filter((r) =>
    (r.media_type === "movie" || r.media_type === "tv") && r.poster_path
  );

  return (
    <div className="bg-[#141414] min-h-screen pt-24 px-4 md:px-12">
      {/* Search input */}
      <div className="relative max-w-2xl mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows..."
          autoFocus
          className="w-full bg-[#1f1f1f] border border-gray-700 text-white placeholder-gray-500 rounded-md pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition"
        />
      </div>

      {debouncedQuery.length > 1 && (
        <>
          {isLoading ? (
            <p className="text-gray-400">Searching...</p>
          ) : results?.length === 0 ? (
            <p className="text-gray-400">No results found for "{debouncedQuery}"</p>
          ) : (
            <>
              <h2 className="text-white text-xl font-bold mb-4">
                Results for "{debouncedQuery}"
              </h2>
              <div className="flex flex-wrap gap-3">
                {results?.map((item) => (
                  <ContentCard key={item.id} item={item} onInfoClick={handleInfoClick} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {!debouncedQuery && (
        <div className="text-center mt-24">
          <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Search for movies and TV shows</p>
        </div>
      )}

      {modalItem && (
        <DetailModal item={modalItem} mediaType={modalType} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
}

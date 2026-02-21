import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";

export default function ContentRow({ title, items, onInfoClick }) {
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction) => {
    const el = rowRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.9;
    const newScrollLeft = direction === "left" 
      ? el.scrollLeft - scrollAmount 
      : el.scrollLeft + scrollAmount;
    el.scrollTo({ left: newScrollLeft, behavior: "smooth" });

    setTimeout(() => {
      setShowLeft(el.scrollLeft > 20);
      setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    }, 100);
  };

  const handleScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 20);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  };

  React.useEffect(() => {
    const el = rowRef.current;
    if (!el || !items?.length) return;
    const checkButtons = () => {
      setShowLeft(el.scrollLeft > 20);
      setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    };
    checkButtons();
    const resizeObserver = new ResizeObserver(checkButtons);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/row mb-8 md:mb-10">
      <h2 className="text-white text-lg md:text-xl font-bold mb-2 md:mb-3 px-4 md:px-12">
        {title}
      </h2>
      <div className="relative">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 md:w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Content */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <ContentCard key={item.id} item={item} onInfoClick={onInfoClick} />
          ))}
        </div>

        {/* Right arrow */}
        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 md:w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
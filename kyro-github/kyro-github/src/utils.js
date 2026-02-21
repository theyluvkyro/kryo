/**
 * Maps page names to their URL paths.
 */
export function createPageUrl(pageName) {
  const routes = {
    Home: "/",
    TVShows: "/tv-shows",
    Movies: "/movies",
    Browse: "/browse",
    Search: "/search",
    Watch: "/watch",
  };
  return routes[pageName] ?? `/${pageName.toLowerCase().replace(/\s+/g, "-")}`;
}

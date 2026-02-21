const API_KEY = "07c618640e945e3b4204b13827ffecf1";
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwN2M2MTg2NDBlOTQ1ZTNiNDIwNGIxMzgyN2ZmZWNmMSIsIm5iZiI6MTc3MTU3MzgzNC41MDU5OTk4LCJzdWIiOiI2OTk4MTI0YTMwYThhZjIwYWRhYjkwMzMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-u-Iyr8pb8JUEdzjaoP4dLDEhEVWvcwshR0qEhm3qGw";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export const IMG_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path, size = "w500") => {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path, size = "original") => {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
};

async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
  return res.json();
}

export async function getTrending(mediaType = "all", timeWindow = "week") {
  return fetchTMDB(`/trending/${mediaType}/${timeWindow}`);
}

export async function getPopularMovies(page = 1) {
  return fetchTMDB("/movie/popular", { page });
}

export async function getTopRatedMovies(page = 1) {
  return fetchTMDB("/movie/top_rated", { page });
}

export async function getNowPlayingMovies(page = 1) {
  return fetchTMDB("/movie/now_playing", { page });
}

export async function getUpcomingMovies(page = 1) {
  return fetchTMDB("/movie/upcoming", { page });
}

export async function getPopularTV(page = 1) {
  return fetchTMDB("/tv/popular", { page });
}

export async function getTopRatedTV(page = 1) {
  return fetchTMDB("/tv/top_rated", { page });
}

export async function getOnTheAirTV(page = 1) {
  return fetchTMDB("/tv/on_the_air", { page });
}

export async function getMovieDetails(id) {
  return fetchTMDB(`/movie/${id}`, { append_to_response: "credits,similar,videos" });
}

export async function getTVDetails(id) {
  return fetchTMDB(`/tv/${id}`, { append_to_response: "credits,similar,videos" });
}

export async function getTVSeasonDetails(tvId, seasonNumber) {
  return fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function searchMulti(query, page = 1) {
  return fetchTMDB("/search/multi", { query, page });
}

export async function getMovieGenres() {
  return fetchTMDB("/genre/movie/list");
}

export async function getTVGenres() {
  return fetchTMDB("/genre/tv/list");
}

export async function discoverMovies(params = {}) {
  return fetchTMDB("/discover/movie", { sort_by: "popularity.desc", ...params });
}

export async function discoverTV(params = {}) {
  return fetchTMDB("/discover/tv", { sort_by: "popularity.desc", ...params });
}

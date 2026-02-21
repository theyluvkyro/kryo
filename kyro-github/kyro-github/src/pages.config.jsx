import Layout from "./Layout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Watch from "./pages/Watch";

export const pagesConfig = {
  Layout,
  mainPage: "Home",
  Pages: {
    Home,
    Movies,
    TVShows,
    Browse,
    Search,
    Watch,
  },
};

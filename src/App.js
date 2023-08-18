import 'bootstrap/dist/css/bootstrap.min.css';
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import React from "react";
import UserRecommendations from './components/UserRecommendations.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogCallback from "./components/LogCallback.js";
import SeasonalAnime from "./components/SeasonalAnime.js";
import TrailerModal from "./modals/TrailerModal.js";
import { useStateContext } from "./contexts/StateContexts.js";
import SearchResults from "./components/SearchResults.js";
import TopAiringAnime from './components/TopAiringAnime.js';
import TopUpcomingAnime from './components/TopUpcomingAnime.js';
import Login from './Accounts/login.js';
import Signup from './Accounts/signup.js';
import { useAuth } from './contexts/AuthContext.js';
import UserSavedList from './components/UserSavedList.js';
import MalAnimeList from './components/MALAnimeList.js';
import ForgotPassword from './Accounts/ForgotPassword.js';

function App() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const { show, setShow, setCategoryList, lastAddedCategory } = useStateContext();
  const handleClose = () => setShow(false);
  const { currentUser } = useAuth();

  React.useEffect(() => {
    async function getCategories() {
      if (currentUser) {
        const fetchCategories = await fetch(`${ serverUrl }/get-categories`, {
          credentials: "include",
        });
  
        const response = await fetchCategories.json(); // response is array of strings that are the category names
        setCategoryList(response)
      }
    };
    getCategories();
  }, [currentUser, lastAddedCategory]); // usememo

  return (
    <>
    <div className="App">
    {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={ <TopAiringAnime /> } />
        <Route path="/user-recommendations" element={ <UserRecommendations /> } />
        <Route path="/logcallback" element={ <LogCallback /> } />
        <Route path="/user-MAL" element={ <MalAnimeList /> } />
        <Route path="/user-anime-list" element={ <UserSavedList /> } />
        <Route path="/seasonal-anime" element={ <SeasonalAnime /> } />
        <Route path="/top-upcoming-anime" element={ <TopUpcomingAnime /> } />
        <Route path="/search-results" element={ <SearchResults /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/sign-up" element={ <Signup /> } />
        <Route path="/forgot-password" element={ <ForgotPassword /> } />

      </Routes>
    <TrailerModal show={ show } onHide={ () => handleClose() } />
    </div>

    </>
  );
}

export default App;

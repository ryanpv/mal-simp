import React, { useContext, useState, } from 'react'


const StateContext = React.createContext();

export function useStateContext() {
  return useContext(StateContext)
};

export function StateProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [animeDetails, setAnimeDetails] = useState({}); // needed additional state because MAL API does not allow certain field groups
  const [currentPage, setCurrentPage] = useState(1);
  const [animeList, setAnimeList] = useState({});
  const [currentTrailer, setCurrentTrailer] = useState({})
  const [searchResults, setSearchResults] = useState({})
  const [offset, setOffset] = React.useState(0)
  const [categoryList, setCategoryList] = React.useState({}) // state for list of users' categories
  const [categoryContents, setCategoryContents] = React.useState([]) // state for saved anime in categories
  const [lastAddedCategory, setLastAddedCategory] = React.useState("");
  const [additionalContent, setAdditionalContent] = React.useState([]);





  const value = {
    show,
    setShow,
    offset,
    loading,
    setLoading,
    setOffset,
    animeDetails,
    setAnimeDetails,
    currentPage,
    setCurrentPage,
    animeList,
    setAnimeList,
    currentTrailer,
    setCurrentTrailer,
    searchResults,
    setSearchResults,
    categoryList,
    setCategoryList,
    categoryContents,
    setCategoryContents, // possibly delete
    lastAddedCategory,
    setLastAddedCategory,
    additionalContent,
    setAdditionalContent

  }

  return (
    <StateContext.Provider value={value}>
      { !loading && children }
    </StateContext.Provider>
  )
}

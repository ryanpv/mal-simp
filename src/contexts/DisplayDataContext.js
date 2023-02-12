import React, { useContext } from 'react'
import { useStateContext } from './StateContexts';

const DisplayContext = React.createContext();

export function useDisplayContext() {
  return useContext(DisplayContext)
};

export function DisplayDataProvider({ children }) {
  const baseUrl = process.env.NODE_ENV === 'development' && process.env.REACT_APP_SERVER_BASEURL
  const { setShow, setAnimeDetails, setCurrentPage } = useStateContext();

    const handleShow = async (value) => {
      setShow(true)
      setCurrentPage(1)
      const getAnimeContent = await fetch(`${ baseUrl }/anime/${value.id}/videos,synopsis,mean,num_episodes`)
      const contentResults = await getAnimeContent.json();
      setAnimeDetails(contentResults)
      // console.log(contentResults.videos.length > 0 ? contentResults.videos[0].url : 'n/a');
      // console.log(contentResults);
    }


  const value = {
    handleShow
  }


  return (
    <DisplayContext.Provider value={ value }>
      { children }
    </DisplayContext.Provider>
  )
}

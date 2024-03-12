import React, { useContext } from 'react'
import { useStateContext } from './StateContexts';

const DisplayContext = React.createContext();

export function useDisplayContext() {
  return useContext(DisplayContext)
};

export function DisplayDataProvider({ children }) {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const { setShow, setAnimeDetails, setCurrentPage } = useStateContext();
  const [loading, setLoading] = React.useState(false)

    const handleShow = async (value) => {
      setLoading(true)
      setShow(true)
      setCurrentPage(1)
      const getAnimeContent = await fetch(`${ serverUrl }/anime/${value.id}/videos,synopsis,mean,num_episodes`)
      const contentResults = await getAnimeContent.json();
      setAnimeDetails(contentResults)
      setLoading(false)
    }


  const value = {
    handleShow,
    loading
  }


  return (
    <DisplayContext.Provider value={ value }>
      { children }
    </DisplayContext.Provider>
  )
}

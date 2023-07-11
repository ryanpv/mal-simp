import React from 'react'
import { useStateContext } from '../contexts/StateContexts'
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import ClipLoader from 'react-spinners/ClipLoader';

export default function SearchResults() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const { searchResults, setSearchResults } = useStateContext();
  const { handleShow } = useDisplayContext()
  const { search } = useLocation();
  const url = new URLSearchParams(search)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    async function updateSearchResults() {
      try {
        setLoading(true)
        const animeSearch = await fetch(`${ serverUrl }/animesearch/${ offset }/anime?q=${ url.get('anime') }`)
        const animeSearchResults = await animeSearch.json()
        setSearchResults(animeSearchResults)
        setLoading(false)

      } catch (err) {
        console.log(err);
      }
    }
    updateSearchResults();
  },[offset])


  const AnimeResultList = (props) => {
    return (
      <tr>
        <td>
          <Button onClick={ () => handleShow({ id:props.anime.node.id }) } variant='link'><img alt={ `${props.anime.node.title} thumbnail` } 
          src={ props.anime.node.main_picture.medium } width={75} height={100} /></Button>
        </td>
        <td>{props.anime.node.mean}</td>
        <td><Button onClick={ () => handleShow({ id:props.anime.node.id }) } variant='link'>{props.anime.node.title}</Button></td>
      </tr>
    )
  }

  const displaySearchedAnime = () => {
    if (searchResults.data) {
      return searchResults.data.map(anime => {
        return (
          <AnimeResultList anime={ anime } key={ anime.node.id } />
        )
      })
    }
  }

  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 15);
  }

  function decrementOffset(e) {
    setOffset(prevOffset => prevOffset - 15);
  }


  return (
    <>
    <h2 className='text-center mb-2'>Search Results for</h2>

    <table className='table table-striped' style={ { marginTop: 20 } }>
      <thead>
        <tr>
          <th style={{ margin: 20, border: "1px solid black", padding: "10px 10px" }}>Image</th>
          <th style={{ margin: 20, border: "1px solid black", padding: "10px 10px" }}>Score</th>
          <th style={{ border: "1px solid black", padding: "10px 10px" }}>Anime Title</th>
        </tr>
      </thead>
      <tbody>{ loading ? <ClipLoader color='blue' size={30} loading={loading} /> : displaySearchedAnime() }</tbody>
    </table>

    { searchResults.paging ?
        <div className='w-100 text-center mt-2 mb-2'>
          {/* <Button size='sm' onClick={(e) => decrementOffset(e)}>Previous</Button> */}
          { searchResults.paging.previous ? <Button size='sm' onClick={(e) => decrementOffset(e)}>Previous</Button> : null }
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          { searchResults.paging.next ? <Button size='sm' onClick={(e) => incrementOffset(e)}>Next</Button> : null }
        </div> 
        : null
      }

{/* use ternary to switch videos to cards vs table  */}
      {/* <ContentCards animeList={searchResults} handleShow={handleShow}/> */}
    </>
  )
}

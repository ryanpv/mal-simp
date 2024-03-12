import React from 'react'
import { useStateContext } from '../contexts/StateContexts'
import { Button, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import SyncLoader from 'react-spinners/SyncLoader';

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
        setLoading(false)
      }
    }
    updateSearchResults();
  },[offset])


  const AnimeResultList = (props) => {
    return (
      <tr  style={{ backgroundColor: props.idx % 2 === 0 ? 'white' : '#B4C6EF' }}>
        <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      return searchResults.data.map((anime, idx) => {
        return (
          <AnimeResultList anime={ anime } key={ anime.node.id } idx={ idx } />
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
      <div className='w-100'>
        <Container className='mt-4 pt-2'>
          <h3 className='text-left mb-3' style={{ color: '#B4C6EF', fontWeight: 'bold' }}>Search Results: <i>{ url.get("anime") }</i></h3>
          <hr style={{ color: "#B4C6EF", border: '3px solid #B4C6EF' }}></hr>
        </Container>
      </div>

      { loading ?
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='m-auto'>
          <SyncLoader color='#B4C6EF' size={10} loading={loading} /> 
        </div>
        : null
      }

      <table className='table table-striped' style={ { marginTop: 20, overflow: 'auto' } }>
        <thead>
          <tr style={{ color: 'white', backgroundColor: '#B4C6EF'}}>
            <th style={{ margin: 20, border: "1px solid white", padding: "10px 10px" }}>Image</th>
            <th style={{ margin: 20, border: "1px solid white", padding: "10px 10px" }}>Score</th>
            <th style={{ border: "1px solid white", padding: "10px 10px" }}>Anime Title</th>
          </tr>
        </thead>
        <tbody>{ !loading && displaySearchedAnime() }
        </tbody>
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

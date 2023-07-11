import React from 'react'
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { Container, Button } from 'react-bootstrap';

function TopUpcomingAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const { animeList, setAnimeList } = useStateContext();

  React.useEffect(() => {
    async function getTopUpcoming() {
      try {
        setLoading(true)
        const getTopUpcomingList = await fetch(`${ serverUrl }/anime-ranked/upcoming/${ offset }`)
        const topUpcomingResults = await getTopUpcomingList.json();
        
        setLoading(false)
        setAnimeList(topUpcomingResults)
      } catch (err) {
        console.log(err);
      }
    }
    getTopUpcoming();
  }, [offset])


  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 8);
  }

  function decrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset - 8);
  }


  return (
    <>
      <Container className="mt-4 pt-2 pb-4" style={{ backgroundColor: 'white'}}>
        <h2 className='text-left mb-3 mt-4'>Top Upcoming Anime</h2>
        <hr></hr>
        
        <ContentCards loading={loading}/>
      </Container>

    { animeList.paging ?
        <div className='w-100 text-center mt-2 mb-2'>
          { animeList.paging.previous ? <Button size='sm' onClick={(e) => decrementOffset(e)}>Previous</Button> : null }
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          { animeList.paging.next ? <Button size='sm' onClick={(e) => incrementOffset(e)}>Next</Button> : null }
        </div> 
        : null
      }

    </>
  )
}

export default TopUpcomingAnime
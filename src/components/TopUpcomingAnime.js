import React from 'react'
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { Container, Button } from 'react-bootstrap';

function TopUpcomingAnime() {
  const baseUrl = process.env.NODE_ENV === 'development' && process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const { animeList, setAnimeList } = useStateContext();

  React.useEffect(() => {
    async function getTopUpcoming() {
      try {
        const getTopUpcomingList = await fetch(`${ baseUrl }/anime-ranked/upcoming/${ offset }`)
        const topUpcomingResults = await getTopUpcomingList.json();

        setAnimeList(topUpcomingResults)

        console.log(topUpcomingResults);
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
    <h2 className='text-center mb-3'>Top Upcoming Anime</h2>

    <Container>
      <ContentCards />
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
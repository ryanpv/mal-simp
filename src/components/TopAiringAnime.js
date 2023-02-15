import React from 'react'
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { Container, Button } from 'react-bootstrap';

function TopAiringAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const { animeList, setAnimeList } = useStateContext();


  React.useEffect(() => {
    async function getTopAiring() {
      try {
        const getTopAiringList = await fetch(`https://us-central1-mal-simplified.cloudfunctions.net/api/anime-ranked/airing/${ offset }`)
        const topAiringResults = await getTopAiringList.json();

        setAnimeList(topAiringResults)

        console.log(topAiringResults);
      } catch (err) {
        console.log(err);
      }
    }
    getTopAiring();
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
    <h2 className='text-center mb-3'>Top Airing Anime</h2>

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

export default TopAiringAnime
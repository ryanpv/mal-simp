import React from 'react'
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { Container, Button } from 'react-bootstrap';

function TopUpcomingAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const { setAnimeList } = useStateContext();

  React.useEffect(() => {
    getTopUpcoming();
  }, [offset]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  async function getTopUpcoming() {
    setLoading(true)
    try {
      const getTopUpcomingList = await fetch(`${ serverUrl }/anime-ranked/upcoming/${ offset }`)
      const topUpcomingResults = await getTopUpcomingList.json();
      
      setAnimeList(prev => prev.concat(topUpcomingResults.data))
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop < (document.documentElement.offsetHeight - 100) || loading) {
      return;
    }

    setOffset(prev => prev + 10)
  };

  return (
    <>
      <Container className="mt-4 pt-2 pb-4" style={{ backgroundColor: 'white'}}>
        <h2 className='text-left mb-3 mt-4'>Top Upcoming Anime</h2>
        <hr></hr>
        
        <ContentCards loading={loading}/>
      </Container>
    </>
  )
}

export default TopUpcomingAnime
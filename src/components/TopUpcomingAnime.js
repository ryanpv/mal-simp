import React from 'react'
import ContentCards from '../templates/ContentCards';
import { Container } from 'react-bootstrap';
import SyncLoader from "react-spinners/SyncLoader"

function TopUpcomingAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [animeList, setAnimeList] = React.useState([])
  const containerRef = React.useRef();

  React.useEffect(() => {
    if (!loading) {
      getTopUpcoming();
    }
  }, [offset]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loading]);

  async function getTopUpcoming() {
    setLoading(true)
    try {
      const getTopUpcomingList = await fetch(`${ serverUrl }/anime-ranked/upcoming/${ offset }`)
      const topUpcomingResults = await getTopUpcomingList.json();

      setAnimeList(prev => prev.concat(topUpcomingResults.data))

      if (containerRef.current.clientHeight < window.innerHeight) {
        setOffset(prev => prev + 15)
      }
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
    setOffset(prev => prev + 15)
  };

  const handleResize = () => {
    if (window.innerHeight + 100 < document.documentElement.offsetHeight) {
      return;
    }
    setOffset(prev => prev + 15)
  };

  return (
    <>
      <Container ref={containerRef} className="mt-4 pt-2 pb-4">
        <h3 className='text-left mb-3' style={{ color: '#B4C6EF', fontWeight: 'bold' }}>Top Upcoming Anime</h3>
        <hr style={{ color: "#B4C6EF", border: '3px solid #B4C6EF' }}></hr>

        <ContentCards loading={loading} animeList={animeList}/>

        { loading ? 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='m-auto pt-5'>
          <SyncLoader color='#B4C6EF' size={10} loading={loading} /> 
        </div>
        : null }
      </Container>
    </>
  )
}

export default TopUpcomingAnime
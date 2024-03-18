import React from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import SyncLoader from "react-spinners/SyncLoader";


export default function HomePage() {
  const clientId = process.env.REACT_APP_MAL_CLIENT_ID
  const [loading, setLoading] = React.useState(false)
  const { setMalLoginMessage, malUserDetails, setMalUserDetails } = useStateContext();
  const [animeList, setAnimeList] = React.useState([]);
  const [offset, setOffset] = React.useState(0)
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : process.env.REACT_APP_CLIENT_BASEURL
  const containerRef = React.useRef();

  console.log('in development?:', process.env.NODE_ENV === 'development');

  React.useEffect(() => {
    if (malUserDetails.id && !loading) {
      fetchRecommendedAnime();
    }
    return ;
  }, [offset, malUserDetails.id]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loading]);

  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop < (document.documentElement.offsetHeight - 100) || loading) {
      return;
    }
    setOffset(prev => prev + 10)
  };

  const handleResize = () => {
    if (window.innerHeight + 100 < document.documentElement.offsetHeight) {
      return;
    }
      setOffset(prev => prev + 15)
  };

  
  async function fetchRecommendedAnime() {
    setLoading(true)
    try {
      if (!malUserDetails.id) {
        throw Error('Log in to MAL to see recommendations.')
      }
      const fetchRecommended = await fetch(`${ serverUrl }/user-recommendations/${ offset }`, { credentials: 'include' })
      const recommendationResults = await fetchRecommended.json();

      setAnimeList(prev => prev.concat(recommendationResults.data));

      if (containerRef.current.clientHeight < window.innerHeight) {
        setOffset(prev => prev + 15)
      }
    } catch (err) {
      if (err) {
        setMalLoginMessage('Log in to MAL to see recommendations.')
      }
      console.log(err);
    } finally {
      setLoading(false)
    }
  };

/////////// MYANIMELIST LOGIN/LOGOUT /////////////
  async function malLogin() {
    setLoading(true);
    try {
      const getCode = await fetch(`${ serverUrl }/create-challenge`, { headers: { 'Content-Type': 'application/json' }, credentials:"include" })
      const getChallenge = await getCode.json();      
      // await window.open(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`, "_self")
      window.location.href = (`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`)

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  async function malLogout() {
    try {
      await fetch(`${ serverUrl }/clear-mal-cookie`, { credentials: 'include'})
      setMalUserDetails({})
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      { !malUserDetails.id ? 
        <Container>
          <div className='w-100 text-center mt-4 pt-4'>
            <h3 style={{ color: '#B4C6EF' }}>To see your MyAnimeList recommended titles click the log in button below</h3>
          </div>

          <div className='w-100 text-center pt-5 mt-2 mb-4 pb-4'>
            <Button onClick={ () => malLogin() }>Log In to MyAnimeList.net</Button> 
          </div>
        </Container>
        : null
      }
      
      { malUserDetails.id ? 
        <Container ref={containerRef} className="mt-4 pt-2 pb-4" >
          { malUserDetails.name ? 
            <div xs={1} className='text-left'>
              <Row xs={1} sm={2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <h3 className='text-left mb-3' style={{ color: '#B4C6EF', fontWeight: 'bold' }}>
                  MAL Anime Recommendations
                </h3>
                <Button className='mx-2' style={{ color: '#B4C6EF', maxWidth: '100px' }} variant='secondary' size='sm' onClick={ () => malLogout() }>MAL Logout</Button> 
              </Row>
              <i style={{ color: '#B4C6EF' }}>Recommendations for </i><strong style={{ fontWeight: 'bold', color: '#F472B6', fontSize: '20px' }}>{ malUserDetails.name }</strong>


              {/* <h2>Anime recommendations for MAL user: <strong><i>{ malUserDetails.name }</i></strong></h2> */}
            </div>
          : <h2 style={{ color: '#B4C6EF' }}>Log into MAL to see your recommendations.</h2>
          }
          
          <hr style={{ color: "#F472B6", border: '3px solid #F472B6' }}></hr>

          <ContentCards loading={loading} animeList={animeList}/>

        </Container>
        : null 
      }

      { loading ? 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='m-auto pt-5'>
          <SyncLoader color='#B4C6EF' size={10} loading={loading} /> 
        </div>
      : null }
    </>
  )
}

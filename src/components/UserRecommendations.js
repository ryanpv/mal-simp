import React from 'react'
import { Button, Container } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import { useAuth } from '../contexts/AuthContext';
import ContentCards from '../templates/ContentCards';

export default function HomePage() {
  const clientId = process.env.REACT_APP_MAL_CLIENT_ID
  const { animeList, setAnimeList, malLoginMessage, setMalLoginMessage, malUserDetails, setMalUserDetails } = useStateContext();
  const { handleShow } = useDisplayContext();
  const [offset, setOffset] = React.useState(0)
  const { currentUser, setLoading } = useAuth();
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : process.env.REACT_APP_CLIENT_BASEURL


  async function malLogin() {
    // const code_challenge = await getCode();
    try {
      const getCode = await fetch(`${ serverUrl }/create-challenge`, { headers: { 'Content-Type': 'application/json' }, credentials:"include" })
      const getChallenge = await getCode.json();

      // await window.open(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`, "_self")
      window.location.href = (`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`)
      // *** GET USERNAME ON LOGIN ***
    } catch (error) {
      console.log(error);
    }
  }

  console.log('in development?:', process.env.NODE_ENV === 'development');

  React.useEffect(() => {
    // console.log('homepage serverurl: ', serverUrl);
    async function fetchRecommendedAnime() {
      try {
        if (!malUserDetails.id) {
          const fetchMalUser = await fetch(`${ serverUrl }/get-mal-username`, { credentials: 'include' });
          const malUserName = await fetchMalUser.json();
          console.log('fetched for mal username');
          setMalUserDetails(malUserName)
        }
          const fetchRecommended = await fetch(`${ serverUrl }/user-recommendations/${ offset }`, { credentials: 'include' })
          const recommendationResults = await fetchRecommended.json();
          // console.log(recommendationResults);
          setAnimeList(recommendationResults);
          
      } catch (err) {
        if (err) {
          setMalLoginMessage('Log in to MAL to see recommendations.')
        }
        console.log(err);
      }
    }
    fetchRecommendedAnime();

  }, [offset, malUserDetails.id])


  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 8);
  }

  function decrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset - 8);
  }

  async function malLogout() {
    try {
      await fetch(`${ serverUrl }/clear-mal-cookie`, { credentials: 'include'})
      setMalUserDetails({})
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <>
    <div className='w-100 text-center mt-2 mb-4'>
      { malUserDetails.id ? 
        <Button onClick={ () => malLogout() }>Log out of MAL</Button> 
        : <Button onClick={ () => malLogin() }>Log In to MyAnimeList.net</Button> 
      }
    </div>

    
    { malUserDetails.id ? 
    <Container className='fluid'>
      { malUserDetails.name ? 
        <div className='text-left'>
          <h2>Anime recommendations for MAL user: <strong><i>{ malUserDetails.name }</i></strong></h2>
        </div>
      : <h2>Log into MAL to see your recommendations.</h2>
      }
      <hr></hr>
      <ContentCards />
      { animeList.paging ?
        <div className='w-100 text-center mt-2 mb-2'>
          { animeList.paging.previous ? <Button size='sm' onClick={(e) => decrementOffset(e)}>Previous</Button> : null }
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          { animeList.paging.next ? <Button size='sm' onClick={(e) => incrementOffset(e)}>Next</Button> : null }
        </div> 
        : null
      }
    </Container>
    : null }

    </>
  )
}

// create button that sends this code_challenge to server. server endpoint should fetch the API URL with code challenge as a parameter (step 2).
// make sure redirect URI goes back to server endpoint because client secret is required for token retrieval 
import React from 'react'
import { Container, Button } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { useAuth } from '../contexts/AuthContext';
///////////////////////////////////////////////////////

function MalAnimeList() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : process.env.REACT_APP_CLIENT_BASEURL
  const [offset, setOffset] = React.useState(0)
  const { malUserDetails, malLoginMessage } = useStateContext();
  const [animeList, setAnimeList] = React.useState([]);
  const { currentUser } = useAuth();
  const firebaseToken = currentUser && currentUser.accessToken;
  const clientId = process.env.REACT_APP_MAL_CLIENT_ID
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getUserList()
  }, [offset, malUserDetails.id]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);
  
  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop < (document.documentElement.offsetHeight - 100) || loading) {
      return;
    }

    setOffset(prev => prev + 10)
  };
  
  async function getUserList() {
    setLoading(true);
    try {
      const getAnimeList = await fetch(`${ serverUrl }/user-list/${ offset }`, { credentials: 'include', headers: { Authorization: `Bearer ${ firebaseToken }`} })
      const userListResult = await getAnimeList.json();

      setAnimeList(prev => prev.concat(userListResult.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  async function getMalToken() {
    try {
      const getCode = await fetch(`${ serverUrl }/create-challenge`, { headers: { 'Content-Type': 'application/json' }, credentials:"include" })
      const getChallenge = await getCode.json();

      window.location.href = (`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`)
      // await window.open(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`, "_self")
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
    { malUserDetails.id ? 
    <Container>
      <div className='text-left mb-3 mt-4'>
        <h2 >User Anime List</h2>
        { animeList ? <i>Your anime list from MyAnimeList.</i> 
        : <><Button size='sm' variant='primary' onClick={ () => getMalToken() }>Log in</Button> to MAL to see your saved anime list</> } 
      </div>
        <hr></hr>
      <ContentCards loading={loading} animeList={animeList} />
    </Container>
    : <h2>{ malLoginMessage }</h2> 
    }
    </>
  )
}

export default MalAnimeList

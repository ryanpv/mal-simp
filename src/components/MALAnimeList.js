import React from 'react'
import { Container, Button } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { useAuth } from '../contexts/AuthContext';
import SyncLoader from "react-spinners/SyncLoader";
///////////////////////////////////////////////////////

function MalAnimeList() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : process.env.REACT_APP_CLIENT_BASEURL
  const [offset, setOffset] = React.useState(0)
  const { malUserDetails, setMalUserDetails } = useStateContext();
  const [animeList, setAnimeList] = React.useState([]);
  const { currentUser } = useAuth();
  const firebaseToken = currentUser && currentUser.accessToken;
  const clientId = process.env.REACT_APP_MAL_CLIENT_ID
  const [loading, setLoading] = React.useState(false);
  const containerRef = React.useRef();

  React.useEffect(() => {
    console.log('offset', offset);
    getUserList()
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
    setOffset(prev => prev + 15)
  };

  const handleResize = () => {
    if (window.innerHeight + 100 < document.documentElement.offsetHeight) {
      return;
    }
    setOffset(prev => prev + 15)
  };
  
  async function getUserList() {
    setLoading(true);
    try {
      const getAnimeList = await fetch(`${ serverUrl }/user-list/${ offset }`, { credentials: 'include', headers: { Authorization: `Bearer ${ firebaseToken }`} })
      const userListResult = await getAnimeList.json();

      setAnimeList(prev => prev.concat(userListResult.data));

      if (containerRef.current.clientHeight < window.innerHeight) {
        setOffset(prev => prev + 15)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  async function getMalToken() {
    setLoading(true);
    try {
      const getCode = await fetch(`${ serverUrl }/create-challenge`, { headers: { 'Content-Type': 'application/json' }, credentials:"include" })
      const getChallenge = await getCode.json();

      window.location.href = (`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`)
      // await window.open(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`, "_self")
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
    <Container style={ { backgroundColor: 'white' } }>

      <div className='w-100 text-center mt-4 pt-4'>
        <h3>If you would like to see your saved titles from MyAnimeList click the log in button below</h3>
      </div>
      <div className='w-100 text-center pt-5 mt-2 mb-4 pb-4'>
        { malUserDetails.id ? 
          <Button onClick={ () => malLogout() }>Log out of MAL</Button> 
          : <Button onClick={ () => getMalToken() }>Log In to MyAnimeList.net</Button> 
        }
      </div>
    </Container>

      { malUserDetails.id ? 
      <>
        <Container ref={containerRef} className="mt-4 pt-5 pb-4" style={{ backgroundColor: 'white'}}>
          <div className='text-left mb-3 mt-4'>
            <h2 >User Anime List</h2>
            { animeList ? <i>Your saved anime titles from MyAnimeList.</i> 
            : <><Button size='sm' variant='primary' onClick={ () => getMalToken() }>Log in</Button> to MAL to see your saved anime list</> } 
          </div>
            <hr></hr>
          <ContentCards loading={loading} animeList={animeList} />
        </Container>
      </>
      :
        null
      } 

      { !malUserDetails.id && loading ? <SyncLoader color='#0d6efd' size={10} loading={loading} /> : null }
    </>
  )
}

export default MalAnimeList

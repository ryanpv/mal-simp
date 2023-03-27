import React from 'react'
import { Row, Col, Card, Container, Button } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
///////////////////////////////////////////////////////

function MalAnimeList() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : process.env.REACT_APP_CLIENT_BASEURL
  const [offset, setOffset] = React.useState(0)
  const { animeList, setAnimeList, loading, setLoading, malUserDetails, setMalUserDetails, malLoginMessage } = useStateContext();
  const { currentUser } = useAuth();
  const firebaseToken = currentUser && currentUser.accessToken;
  const clientId = process.env.REACT_APP_MAL_CLIENT_ID


  React.useEffect(() => {
    async function getUserList() {
      try {
        const getAnimeList = await fetch(`${ serverUrl }/user-list/${ offset }`, { credentials: 'include', headers: { Authorization: `Bearer ${ firebaseToken }`} })
        const userListResult = await getAnimeList.json();
        // console.log(userListResult);
        setAnimeList(userListResult)
  
      } catch (err) {
        console.log(err);
      };
    };

    getUserList()
  }, [offset, firebaseToken, malUserDetails])

  


// offsets to be sent as params to server. 
  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 8);
  };

  function decrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset - 8);
  };

  async function getMalToken() {
    try {
      const getCode = await fetch(`${ serverUrl }/create-challenge`, { headers: { 'Content-Type': 'application/json' }, credentials:"include" })
      const getChallenge = await getCode.json();
      console.log(window.location.href);

      window.location.href = (`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`)
      // await window.open(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=${ clientUrl }/logcallback`, "_self")
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
    <div className='text-center mb-3'>
      <h2 >User Anime List</h2>
      { animeList.data ? <i>Your anime list from MyAnimeList.</i> 
      : <><Button size='sm' variant='primary' onClick={ () => getMalToken() }>Log in</Button> to MAL to see your saved anime list</> } 
      {/* { animeList.data ? <i>Your anime list from MyAnimeList</i> : <i><Link to='/'>Log in</Link> to MAL to see your saved anime list</i> }  */}
    </div>

    { malUserDetails.id ? 
    <Container>
      { loading ? <>Loading...</> : <ContentCards animeList={animeList} /> }
      </Container>
    : <h2>{ malLoginMessage }</h2> 
    }
      
      { malUserDetails.id && animeList.paging ?
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

export default MalAnimeList

// CLICKING ON CARD CAN OPEN MODAL FOR MORE DETAILS AND VIDEO PLAYER?
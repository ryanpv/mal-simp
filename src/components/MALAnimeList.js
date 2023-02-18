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
  // const [animeList, setUserList] = React.useState({})
  const [offset, setOffset] = React.useState(0)
  const { animeList, setAnimeList, loading, setLoading, malUserDetails, setMalUserDetails } = useStateContext();
  const { currentUser } = useAuth();
  const firebaseToken = currentUser && currentUser.accessToken
  // const { handleShow } = useDisplayContext();


  React.useEffect(() => {
    // setLoading(true);
    if(malUserDetails.id) {
      console.log("MAL page if statement");
      getUserList()
    } else {
      console.log("MAL page else statement");
      getUserList()
      getMalUser()
    }; 
    // setLoading(false)

  }, [offset, firebaseToken, malUserDetails])

  async function getMalUser() {
    try {
      const fetchMalUser = await fetch(`${ serverUrl }/get-mal-username`, { credentials: 'include' });
      const malUserName = await fetchMalUser.json();
      console.log('MAL username: ', malUserName);
      setMalUserDetails(malUserName)

    } catch (err) {
      console.log(err);
    };
  };
  
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

// offsets to be sent as params to server. 
  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 8);
  };

  function decrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset - 8);
  };


  return (
    <>
    <div className='text-center mb-3'>
      <h2 >User Anime List</h2>
      { animeList.data ? <i>Your anime list from MyAnimeList</i> : <i><Link to='/'>Log in</Link> to MAL to see your saved anime list</i> } 
    </div>

    <Container>
      { loading ? <>Loading...</> : <ContentCards animeList={animeList} /> }
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

export default MalAnimeList

// CLICKING ON CARD CAN OPEN MODAL FOR MORE DETAILS AND VIDEO PLAYER?
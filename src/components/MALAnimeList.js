import React from 'react'
import { Row, Col, Card, Container, Button } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
///////////////////////////////////////////////////////

function MalAnimeList() {
  const baseUrl = process.env.NODE_ENV === 'development' && process.env.REACT_APP_SERVER_BASEURL
  // const [animeList, setUserList] = React.useState({})
  const [offset, setOffset] = React.useState(0)
  const { animeList, setAnimeList, loading, setLoading } = useStateContext();
  const { currentUser } = useAuth();
  const firebaseToken = currentUser && currentUser.accessToken
  // const { handleShow } = useDisplayContext();


  React.useEffect(() => {
    // if (currentUser) {
    setLoading(true);
    getUserList()
    setLoading(false)
    // } else { 
    //   setAnimeList({}) 
    // }

  }, [offset, firebaseToken])
  
  async function getUserList() {
    try {

      const getAnimeList = await fetch(`${ baseUrl }/user-list/${ offset }`, { credentials: 'include', headers: { Authorization: `Bearer ${ firebaseToken }`} })
      const userListResult = await getAnimeList.json();
      console.log(userListResult);
      setAnimeList(userListResult)

    } catch (err) {
      console.log(err);
    }
  }

// offsets to be sent as params to server. 
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
    <div className='text-center mb-3'>
      <h2 >User Anime List</h2>
      { currentUser ? <i>Your anime list from MyAnimeList</i> : <i><Link to='/'>Log in</Link> to MAL to see your saved anime list</i>} 
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
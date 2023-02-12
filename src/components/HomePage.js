import React from 'react'
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import { useAuth } from '../contexts/AuthContext';
import { async } from '@firebase/util';

export default function HomePage() {
  const clientId = process.env.REACT_APP_MAL_CLIENT_ID
  const { animeList, setAnimeList, errorMessage, setErrorMessage, malUserDetails } = useStateContext();
  const { handleShow } = useDisplayContext();
  const [offset, setOffset] = React.useState(0)
  const { currentUser, setLoading } = useAuth();
  const baseUrl = process.env.NODE_ENV === 'development' && process.env.REACT_APP_SERVER_BASEURL



  async function fetchServer() {
    // const code_challenge = await getCode();
    try {
      const getCode = await fetch(`${ baseUrl }/create-challenge`, { headers: { 'Content-Type': 'application/json' }, credentials:"include" })
      const getChallenge = await getCode.json();

      await window.open(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ clientId }&code_challenge=${ getChallenge }&redirect_uri=http://localhost:3000/logcallback`, "_self")
      
    } catch (error) {
      console.log(error);
    }
  }

  console.log(process.env.NODE_ENV === 'development');

  React.useEffect(() => {
    async function fetchRecommendedAnime() {
      try {
        if (malUserDetails.id) {

          const fetchRecommended = await fetch(`${ baseUrl }/user-recommendations/${ offset }`, { credentials: 'include' })
          const recommendationResults = await fetchRecommended.json();
          setAnimeList(recommendationResults);
          
          
          console.log('recommendations fetched', recommendationResults);
        }
         return ; 
      } catch (err) {
        if (err) {
          setErrorMessage('Log in to MAL to see recommendations')
        }
        // console.log(err);
      }
    }
    fetchRecommendedAnime();

  }, [offset, malUserDetails])


  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 5);
  }

  function decrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset - 5);
  }

  async function malLogout() {
    try {
      await fetch(`${ baseUrl }/clear-mal-cookie`, { credentials: 'include'})
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <>
    <div className='w-100 text-center mt-1 mb-4'>
      <h2>Welcome to MAL-Simp. A web-app that simplifies MyAnimeList</h2>
      </div>

    <div className='w-100 text-center'>
      { malUserDetails.name ? 
        <Button onClick={ () => malLogout() }>Log out of MAL</Button> 
        : <Button onClick={ () => fetchServer() }>Log In to MyAnimeList.net</Button> 
        }
    </div>

    { malUserDetails.name ? 
      <div className='text-center'>
        <h2>Anime recommendations for <strong><i>{ malUserDetails.name }</i></strong> :</h2>
      </div>
    : <h2>{ errorMessage }</h2>
    }
    
    <Container className='fluid'>
      <Row xs={1} md={5} className="g-4">
        { animeList.data ? animeList.data.map(recs => { return (
          <Col key={ recs.node.id } >
            <Card onClick={() => handleShow({ id: recs.node.id }) } bg="light" style={ { height: '100%', cursor: "pointer" } }>
              <Card.Img variant='top' src={ recs.node.main_picture.medium } />
              <Card.Body>
                <strong as="h6">{ recs.node.title }</strong>
              </Card.Body>
              <Card.Footer>Score: { recs.node.mean }</Card.Footer>
            </Card>
          </Col>
          );
        })
        : null
        }
      </Row>
      { animeList.paging ?
        <div className='w-100 text-center mt-2 mb-2'>
          { animeList.paging.previous ? <Button size='sm' onClick={(e) => decrementOffset(e)}>Previous</Button> : null }
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          { animeList.paging.next ? <Button size='sm' onClick={(e) => incrementOffset(e)}>Next</Button> : null }
        </div> 
        : null
      }
      </Container>

    </>
  )
}

// create button that sends this code_challenge to server. server endpoint should fetch the API URL with code challenge as a parameter (step 2).
// make sure redirect URI goes back to server endpoint because client secret is required for token retrieval 
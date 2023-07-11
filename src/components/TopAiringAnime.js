import React from 'react'
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import SyncLoader from "react-spinners/SyncLoader"

function TopAiringAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const { animeList, setAnimeList } = useStateContext();
  const { handleShow } = useDisplayContext();

  React.useEffect(() => {
    async function getTopAiring() {
      try {
        setLoading(true)
        const getTopAiringList = await fetch(`${ serverUrl }/anime-ranked/airing/${ offset }`)
        const topAiringResults = await getTopAiringList.json();
        setLoading(false)
        setAnimeList(topAiringResults)
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    getTopAiring();
  }, [offset])


  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 5);
  }

  function decrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset - 5);
  }

  return (
    <>
    <div className='w-100 text-center mt-4 mb-4'>
      <h2>Welcome to WorldAnime</h2>
    </div>

    <Container className="pt-4 pb-4" style={{ backgroundColor: 'white'}}>
      <h3 className='text-left mb-3'>Top Airing Anime</h3>
      <hr></hr>

      { loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> :
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
      }
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

export default TopAiringAnime
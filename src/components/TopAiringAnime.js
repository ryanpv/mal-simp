import React from 'react'
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
import { useDisplayContext } from '../contexts/DisplayDataContext';

function TopAiringAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const { animeList, setAnimeList } = useStateContext();
  const { handleShow } = useDisplayContext();


  // console.log('serverurl: ', serverUrl);
  React.useEffect(() => {
    async function getTopAiring() {
      try {
        const getTopAiringList = await fetch(`${ serverUrl }/anime-ranked/airing/${ offset }`)
        const topAiringResults = await getTopAiringList.json();

        setAnimeList(topAiringResults)

        // console.log(topAiringResults);
      } catch (err) {
        console.log(err);
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
    <div className='w-100 text-center mt-1 mb-4'>
      <h2>MAL-Simp. Simplified web-app for MyAnimeList</h2>
    </div>

    <h2 className='text-center mb-3'>Top Airing Anime</h2>

    <Container>
      {/* <ContentCards /> */}
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
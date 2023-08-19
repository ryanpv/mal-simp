import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { useDisplayContext } from '../contexts/DisplayDataContext'
import { useStateContext } from '../contexts/StateContexts';
import SyncLoader from "react-spinners/SyncLoader"

export default function ContentCards({ loading, animeList }) {
  const { handleShow } = useDisplayContext();
  // const { animeList } = useStateContext();

  return (
    <>
      {/* { loading ? <ClipLoader color='blue' size={30} loading={loading} /> : */}
      <Row xs={1} md={5} className="g-4">
        { animeList && animeList.map(el => { return (
            <Col key={ el.node.id }>
              <Card onClick={ () => handleShow({ id:el.node.id, title:el.node.title }) } bg='light' style={ { height:'100%', cursor: "pointer" } }>
                <Card.Title className="text-center">{ el.node.title }</Card.Title>
                <Card.Subtitle className="text-center">Score: { el.node.mean  }</Card.Subtitle>
                <Card.Img src={el.node.main_picture.medium} />                  
                <Card.Body>
                  <Card.Subtitle className="text-muted mb-2" as="h6"><strong>Episodes:</strong> { el.node.num_episodes }</Card.Subtitle>
                  <Card.Subtitle className='text-muted mb-2'><strong>Status:</strong> 
                    { el.node.status === 'currently_airing' ? ' Currently Airing' 
                    : el.node.status === 'finished_airing' ? ' Finished Airing' 
                    : ' Not Yet Aired' }
                  </Card.Subtitle>
                  {/* <br></br> */}
                  <Card.Text>
                    <strong as="h6">Synopsis: </strong>
                    { el.node.synopsis && el.node.synopsis.length > 300 ? 
                    <>
                    { el.node.synopsis.substring(0,250) }...
                    </>
                    : el.node.synopsis }
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col> 
          )}
          )
        }
      </Row>

      { loading ? <SyncLoader color='#0d6efd' size={10} loading={loading} /> : null }
{/* } */}
    </>
  )
}

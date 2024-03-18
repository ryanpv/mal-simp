import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { useDisplayContext } from '../contexts/DisplayDataContext'
import SyncLoader from "react-spinners/SyncLoader"

export default function ContentCards({ loading, animeList }) {
  const { handleShow } = useDisplayContext();

  return (
    <>
      <Row xs={1} sm={2} md={3} xl={4} className="g-2">
        { animeList && animeList.map(el => { return (      
            <Col className='mb-2' style={{ borderBottom: '1px solid #B4C6EF'}} key={ el.node.id } >
              <Card className='' onClick={() => handleShow({ id: el.node.id, title:el.node.title }) } style={ { border: '0', height: '100%', cursor: "pointer" } }>
                <Card.Img style={{ height: '100%' }} variant='top' src={ el.node.main_picture.medium } />
                <Card.ImgOverlay 
                    style={{ 
                      display: 'flex',
                      borderRadius: '0', 
                      height: '10%', 
                      color: 'lightgoldenrodyellow', 
                      fontWeight: 'bolder', 
                      fontSize: '20px', 
                      boxShadow: 'inset 0 30px 50px -10px rgba(0,0,0,2.5)' 
                    }}
                  >
                    <span style={{ margin: 'auto' }}>Score: { el.node.mean }</span>
                  </Card.ImgOverlay>
                {/* <Card.Body> */}
                <Card.Body style={{ backgroundColor: '#0F172A', padding:'5px 10px', color: '#F472B6', height: '100px', overflow: 'auto' }}>
                  <Card.Title style={{ fontWeight: 'bold'}}>{ el.node.title }</Card.Title>
{/* #B4C6EF */}
                  <Card.Subtitle className="text-muted mb-2" as="h6"><strong style={{ color: '#B4C6EF' }}>Episodes:</strong> { el.node.num_episodes }</Card.Subtitle>
                  <Card.Subtitle className='text-muted mb-2'><strong style={{ color: '#B4C6EF' }}>Status:</strong> 
                    { el.node.status === 'currently_airing' ? ' Currently Airing' 
                    : el.node.status === 'finished_airing' ? ' Finished Airing' 
                    : ' Not Yet Aired' }
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col> 
          )}
          )
        }
      </Row>
    </>
  )
}

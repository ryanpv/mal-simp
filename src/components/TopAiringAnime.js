import React from 'react'
import { Row, Col, Card, Container } from 'react-bootstrap';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import SyncLoader from "react-spinners/SyncLoader"

function TopAiringAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  // const { animeList, setAnimeList, malUserDetails } = useStateContext();
  const [animeList, setAnimeList]  = React.useState([])
  const { handleShow } = useDisplayContext();
  const [error, setError] = React.useState("")
  const topAiringRef = React.useRef();

  React.useEffect(() => {
    if (!loading) {
      getTopAiring();
    }
  }, [offset]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loading]);

  async function getTopAiring() {
    setLoading(true)
    try {
      const getTopAiringList = await fetch(`${ serverUrl }/anime-ranked/airing/${ offset }`)
      const topAiringResults = await getTopAiringList.json();
      setAnimeList(prev => prev.concat(topAiringResults.data))

// if container height < window innerheight, fetch more data since scroller would not be available to cause the useEffect's fetch call
      if (topAiringRef.current.clientHeight < window.innerHeight) {
        setOffset(prev => prev + 15)
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  };

  const handleScroll = () => {
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

  return (
    <>
      <div className='w-100 text-center text-white mt-4 mb-4'>
        <h2 className='underline' style={ { color: 'white', fontWeight: 'bold' } }>Welcome to WorldAnime</h2>
      </div>
      
      <Container ref={topAiringRef} className="pt-2 pb-4">

        <h3 className='text-left mb-3' style={{ color: '#B4C6EF', fontWeight: 'bold' }}>Top Airing Anime</h3>
        <hr style={{ color: "#F472B6", border: '3px solid #F472B6' }}></hr>

          <Row xs={1} sm={2} md={3} xl={4} className="g-2">
            { animeList ? animeList.map(recs => { return (
              <Col className='mb-2' style={{ borderBottom: '1px solid #B4C6EF'}} key={ recs.node.id } >
                <Card className='' onClick={() => handleShow({ id: recs.node.id }) } style={ { border: '0', height: '100%', cursor: "pointer" } }>
                  <Card.Img style={{ height: '100%' }} variant='top' src={ recs.node.main_picture.medium } />
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
                    <span style={{ margin: 'auto' }}>Score: { recs.node.mean }</span>
                  </Card.ImgOverlay>
                  <Card.Body style={{ backgroundColor: '#0F172A', padding:'5px 10px', color: '#F472B6', height: '70px', overflow: 'auto' }}>
                    <Card.Title style={{ color: '#F472B6' }}>{ recs.node.title }</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              );
            })
            : null
          }
          </Row>
          
        { loading ? 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='m-auto pt-5'>
          <SyncLoader color='#B4C6EF' size={10} loading={loading} /> 
        </div>
        : null }
      </Container>
    </>
  )
}

export default TopAiringAnime
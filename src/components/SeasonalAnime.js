import React from 'react'
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import ContentCards from '../templates/ContentCards';
////////////////////////////////////



function SeasonalAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const date = new Date();
  const [currentYear, setCurrentYear] = React.useState(date.getFullYear())
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [season, setSeason] = React.useState("winter");
  const [formErrors, setFormErrors] = React.useState('');
  const { animeList, setAnimeList } = useStateContext();
  const animeSeason = document.getElementById('anime-season')
  const animeYear = React.useRef();

  React.useEffect(() => {
    getSeasonalAnime();
  }, [offset, season, currentYear, setAnimeList]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop < (document.documentElement.offsetHeight - 100) || loading) {
      return;
    }

    setOffset(prev => prev + 10)
  };

  async function getSeasonalAnime() {
    try {
      setLoading(true);
      const getSeasonalList = await fetch(`${ serverUrl }/seasonal-anime/${ currentYear }/${ season }/${ offset }`, { credentials: 'include' })
      const seasonalListResults = await getSeasonalList.json();
      
      setAnimeList(prev => prev.concat(seasonalListResults.data));
      setLoading(false)
    } catch (err) {
      console.log(err);
      setFormErrors("Invalid season/year input")
      animeYear.current.value = null
      setLoading(false)
    }
  };

  const seasonalQuery = (e) => {
    e.preventDefault();
    setCurrentYear(animeYear.current.value)
    setSeason(animeSeason.value)
    setFormErrors('')
    animeYear.current.value = null
  };


  return (
    <>
      <Container className="mt-4 pt-2 pb-4" style={{ backgroundColor: 'white'}}>
        <h2 className='text-left mt-4'>Seasonal Anime</h2>
        <hr></hr>
        <h6 className='text-center'>
          <strong>{ animeList.season ? `${animeList.season.season.toUpperCase()} ${animeList.season.year}` : null }</strong>
            </h6>
        {/* <br></br> */}
        <Form className='centered' onSubmit={(e) => seasonalQuery(e)}>
          <Row className="w-25 mb-3">
            <Form.Group as={Col}>
              <Form.Label>Season</Form.Label>
              <Form.Select id='anime-season'>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
            </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Year</Form.Label>
              <Form.Control ref={animeYear} placeholder='Specify Year' id="anime-year" isInvalid={ !!formErrors } />
              <Form.Control.Feedback type='invalid'>
                { formErrors }
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
        
          <ContentCards animeList={animeList} loading={loading}/>
      </Container>
    </>
  )
}

export default SeasonalAnime
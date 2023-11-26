import React from 'react'
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import ContentCards from '../templates/ContentCards';
////////////////////////////////////

function SeasonalAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const date = new Date();
  const [currentYear, setCurrentYear] = React.useState(date.getFullYear());
  const [offset, setOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [season, setSeason] = React.useState("winter");
  const [formErrors, setFormErrors] = React.useState('');
  const [animeList, setAnimeList] = React.useState({ anime: [], season: { season: season, year: currentYear } });
  const animeSeason = document.getElementById('anime-season');
  const animeYearInput = React.useRef();
  const containerRef = React.useRef();

  React.useEffect(() => {
    getSeasonalAnime(); 
  }, [offset, season, currentYear, setAnimeList]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loading]);

  const handleScroll = async () => {
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

  async function getSeasonalAnime() {
    setLoading(true);
    try {
      const getSeasonalList = await fetch(`${ serverUrl }/seasonal-anime/${ currentYear }/${ season }/${ offset }`, { credentials: 'include' })
      const seasonalListResults = await getSeasonalList.json();

      setAnimeList(prev => ({ 
        anime: prev.anime.concat(seasonalListResults.data), 
        season: seasonalListResults.season
        })
      );

      if (containerRef.current.clientHeight < window.innerHeight) {
        setOffset(prev => prev + 15)
      }
    } catch (err) {
      console.log(err);
      setFormErrors("Invalid season/year input")
      animeYearInput.current.value = null
    } finally {
      setLoading(false)
    }
  };

  const seasonalQuery = (e) => {
    e.preventDefault();

    if (
      (animeYearInput.current.value === 
      animeList.season.year.toString() && 
      animeList.season.season.toLowerCase === 
      animeSeason.value) || 
      isNaN(animeYearInput.current.value)
      ) {
      setFormErrors("Query results already present / invalid year input.")
    } else {
      setAnimeList({ anime: [], season: { season: season, year: currentYear } })
      setOffset(0)
      setCurrentYear(animeYearInput.current.value)
      setSeason(animeSeason.value)
      setFormErrors('')
      animeYearInput.current.value = null
    }
  };


  return (
    <>
      <Container ref={containerRef} className="mt-4 pt-2 pb-4" style={{ backgroundColor: 'white'}}>
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
              <Form.Control ref={animeYearInput} placeholder='Specify Year' id="anime-year" isInvalid={ !!formErrors } />
              <Form.Control.Feedback type='invalid'>
                { formErrors }
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
        
          <ContentCards animeList={animeList.anime} loading={loading}/>
      </Container>
    </>
  )
}

export default SeasonalAnime
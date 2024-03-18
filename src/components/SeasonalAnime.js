import React from 'react'
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import ContentCards from '../templates/ContentCards';
import SyncLoader from "react-spinners/SyncLoader"

////////////////////////////////////

function SeasonalAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const date = new Date();
  const [currentYear, setCurrentYear] = React.useState(date.getFullYear()); // state for seasonal query's year value
  const [offset, setOffset] = React.useState(0); // state for offset value to be sent to server for api query
  const [loading, setLoading] = React.useState(false);
  const [season, setSeason] = React.useState("winter"); // state for seasonal query's season value
  const [formErrors, setFormErrors] = React.useState('');
  const [animeList, setAnimeList] = React.useState({ anime: [], season: { season: season, year: currentYear } }); // state for anime list query results
  const animeSeason = document.getElementById('anime-season'); // reference to form for current season value
  const animeYearInput = React.useRef(); // ref for form's Year value
  const containerRef = React.useRef(); // ref for the page's container. Used for infinite scrolling

  React.useEffect(() => {
    if (!loading) {
      getSeasonalAnime(); 
    }
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
      <Container 
        ref={containerRef} 
        className="mt-4 mb-4 pt-2 pb-3" 
        style={{ backgroundColor: 'transparent' }}
      >
        <h3 className='text-left mb-3' style={{ color: '#B4C6EF', fontWeight: 'bold' }}>Seasonal Anime</h3>
        <hr style={{ color: "#F472B6", border: '3px solid #F472B6' }}></hr>

        <Form style={{ color: '#B4C6EF', fontWeight: 'bold' }} className='centered' onSubmit={(e) => seasonalQuery(e)}>
          <Row className="w-25 mb-3">
            <Form.Group as={Col}>
              <Form.Label>Season</Form.Label>
              <Form.Select style={{ color: '#B4C6EF', fontWeight: 'bold' }} id='anime-season'>
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
        
      </Container>
      
      <h4 style={{ color: '#B4C6EF', fontWeight: 'bold' }} className='text-center mt-2'>
        <strong>{ animeList.season ? `${animeList.season.season.toUpperCase()} ${animeList.season.year}` : null }</strong>
      </h4>

      <Container ref={ containerRef } className="pt-2 pb-4">
        <ContentCards animeList={animeList.anime} loading={loading}/>
        
        { loading ? 
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='m-auto pt-5'>
            <SyncLoader color='#B4C6EF' size={10} loading={loading} /> 
          </div>
        : null }
      </Container>
    </>
  )
}

export default SeasonalAnime
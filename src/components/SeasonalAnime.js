import React from 'react'
import { Row, Col, Card, Container, Button, Form } from 'react-bootstrap';
import { useStateContext } from '../contexts/StateContexts';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import ContentCards from '../templates/ContentCards';
////////////////////////////////////



function SeasonalAnime() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  // const [animeList, setAnimeList] = React.useState({});
  const date = new Date();
  const [currentYear, setCurrentYear] = React.useState(date.getFullYear())
  const [offset, setOffset] = React.useState(0)
  const [season, setSeason] = React.useState("winter");
  const { animeList, setAnimeList } = useStateContext();
  // const { handleShow } = useDisplayContext();
  const animeSeason = document.getElementById('anime-season')
  // const animeYear = document.getElementById('anime-year') 
  const animeYear = React.useRef();


  React.useEffect(() => {
    async function getSeasonalAnime() {
      try {
        const getSeasonalList = await fetch(`${ serverUrl }/seasonal-anime/${ currentYear }/${ season }/${ offset }`, { credentials: 'include' })
        const seasonalListResults = await getSeasonalList.json();
        // console.log('season results', seasonalListResults);

        setAnimeList(seasonalListResults);
      } catch (err) {
        console.log(err);
        alert("Invalid season/year input")
        animeYear.current.value = null
      }

    }

    getSeasonalAnime();
  }, [offset, season, currentYear, setAnimeList])



  async function incrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + 8);
  }

  function decrementOffset(e) {
    e.preventDefault();
    setOffset(prevOffset => prevOffset - 8);
  }

  const seasonalQuery = (e) => {
    e.preventDefault();
    setCurrentYear(animeYear.current.value)
    setSeason(animeSeason.value)

  }


  return (
    <>
      <h2 className='text-center'>Seasonal Anime</h2>
      <h6 className='text-center'>{ animeList.season ? `${animeList.season.season.toUpperCase()} ${animeList.season.year}` : null }</h6>
      <br></br>

    <Container>
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
            <Form.Control ref={animeYear} placeholder='Specify Year' id="anime-year"/>
          </Form.Group>
        </Row>
      </Form>

      <ContentCards animeList={animeList} />
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

export default SeasonalAnime
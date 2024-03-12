import React from 'react'
import { Container, Nav, Navbar, Form, NavDropdown, Button, Row, Col } from 'react-bootstrap'
import { useNavigate, NavLink } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContexts';
import { useAuth } from '../contexts/AuthContext'

function NavBar() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const navigate = useNavigate();
  const animeRef = React.useRef();
  const { setSearchResults, offset, setOffset } = useStateContext();
  const { currentUser, logout } = useAuth();
  const [formErrors, setFormErrors] = React.useState('');
  const [hoverColor, setHoverColor] = React.useState('white')
  
  async function submitSearch(e) {
    e.preventDefault();
    // console.log(animeRef.current.value);

    try {
      if (animeRef.current.value === "" || !/\S/.test(animeRef.current.value) || animeRef.current.value.includes('  ')) {
        setFormErrors("Invalid search input. Ensure no double spacing")
      } else {
        const animeSearch = await fetch(`${ serverUrl }/animesearch/${ offset }/anime?q=${ new URLSearchParams(animeRef.current.value) }`)
        const animeSearchResults = await animeSearch.json()
        setSearchResults(animeSearchResults)
        setOffset(0)
        setFormErrors('')
        
      }
      navigate(`/search-results?anime=${animeRef.current.value}`)

    } catch (err) {
      console.log(err);
    }
    
    animeRef.current.value = null
  };

  return (
    <>
      <Navbar style={{ backgroundColor: 'white', fontWeight: 'bold' }} className='py-3' expand="xl" sticky='top' >
        <Container className='justify-content-between'>
          <Navbar.Brand href="/home"><img className="" style={{ height: 50 }} src={require("../logo192.png")} alt='WorldAnime Logo'/></Navbar.Brand>
          <Navbar.Brand style={{ fontWeight: '', fontSize: '30px', color: '#B4C6EF' }} href="/home">WorldAnime</Navbar.Brand>
          <Navbar.Toggle aria-controls='NavbarScroll' style={{ backgroundColor: '#B4C6EF' }} />
          <Navbar.Collapse className='justify-content-between' id="navbarScroll">
            <Nav navbarScroll className='justify-content-between' style={{ whiteSpace: 'nowrap'}}>
              <NavLink className='nav-link' style={{ margin: '0 10px', color: '#B4C6EF' }} to="/home">Home</NavLink>

              <NavDropdown 
                style={{ margin: '0 10px' }} 
                title={<span style={{ color: '#B4C6EF' }}>Anime</span>} 
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item 
                  as={NavLink} 
                  to='/top-upcoming-anime' 
                  style={{ margin: '0 0px', color: '#B4C6EF', fontWeight: 'bold', backgroundColor: 'white' }}
                >
                  Top Upcoming Anime
                </NavDropdown.Item>
              <NavDropdown.Divider />
                <NavDropdown.Item 
                  as={NavLink} 
                  to='/seasonal-anime' 
                  style={{ margin: '0 0px', color: '#B4C6EF', fontWeight: 'bold', backgroundColor: 'white' }}
                >
                  Seasonal Anime
                </NavDropdown.Item>
              </NavDropdown>

              { currentUser ? 
                <NavDropdown
                  style={{ margin: '0 10px' }} 
                  title={ <span style={{ color: '#B4C6EF' }}>MAL</span> } id="navbarScrollingDropdown">
                  <NavDropdown.Item 
                    as={NavLink} 
                    to='/user-MAL' 
                    style={{ margin: '0 0px', color: '#B4C6EF', fontWeight: 'bold', backgroundColor: 'white' }}
                  >
                    MyAnimeList
                  </NavDropdown.Item>
                <NavDropdown.Divider />
                  <NavDropdown.Item 
                    as={NavLink} 
                    to='/user-recommendations' 
                    style={{ margin: '0 0px', color: '#B4C6EF', fontWeight: 'bold', backgroundColor: 'white' }}
                  >
                    Your Recommendations
                  </NavDropdown.Item>
                </NavDropdown>
                :
                null
              }

              <NavLink xs='auto' className='nav-link' style={{ margin: '0 10px', color: '#B4C6EF' }} to="/user-anime-list">Watch Lists</NavLink>
            </Nav>

            <Row>
              <Col xs='auto'>
                <Form inline className='' style={{ minWidth: '250px' }} onSubmit={(e) => submitSearch(e)}>
                  <Form.Control className='' type='text' ref={animeRef} placeholder='Search Anime' isInvalid={ !!formErrors } />
                  <Form.Control.Feedback type='invalid'>
                    { formErrors }
                  </Form.Control.Feedback>
                </Form>
              </Col>
            </Row>
            {/* </div> */}

            <Nav className='' >
              { currentUser ? 
              <>
                <NavDropdown title={ <span style={{ margin: '0 10px', color: '#B4C6EF' }}>{ currentUser.split("@")[0] }</span> } id="navbarScrollingDropdown">
                  <NavDropdown.Item onClick={ () => logout() } style={{ margin: '0 0px', color: '#B4C6EF', fontWeight: 'bold' }}>Log Out</NavDropdown.Item>
                </NavDropdown>
              </>
              :
              <>
                <Nav.Link style={{ margin: '0 10px', color: '#B4C6EF', flexShrink: 0 }} href="/sign-up">Signup</Nav.Link>
                <Nav.Link style={{ margin: '0 10px', color: '#B4C6EF', flexShrink: 0 }} href="/login">Login</Nav.Link>
              </>
              }
              {/* if logged in, then a 'Profile' link should replace these two  */}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar> 
    </>
  );
}

export default NavBar;
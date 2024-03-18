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
      <Navbar style={{ backgroundColor: '#0F172A', fontWeight: 'bold', borderBottom: '1px solid #B4C6EF' }} className='py-1 border-solid' expand="xl" sticky='top' >
        <Container className='justify-content-between'>
          <Navbar.Brand href="/home"><img className="" style={{ height: 40 }} src={require("../logo192.png")} alt='WorldAnime Logo'/></Navbar.Brand>
          <Navbar.Brand style={{ fontWeight: '', fontSize: '30px', color: 'white' }} href="/home">WorldAnime</Navbar.Brand>
          <Navbar.Toggle aria-controls='NavbarScroll' style={{ backgroundColor: '#4C4C70' }} />
          <Navbar.Collapse className='justify-content-between' id="navbarScroll">
            <Nav navbarScroll className='justify-content-between' style={{ whiteSpace: 'nowrap'}}>
              <NavLink className='nav-link' style={{ margin: '0 10px', color: 'white' }} to="/home">Home</NavLink>

              <NavDropdown 
                style={{ margin: '0 10px' }} 
                title={<span style={{ color: 'white' }}>Anime</span>} 
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
                  title={ <span style={{ color: 'white' }}>MAL</span> } id="navbarScrollingDropdown">
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

              <NavLink xs='auto' className='nav-link' style={{ margin: '0 10px', color: 'white' }} to="/user-anime-list">Watch Lists</NavLink>
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
                <NavDropdown title={ <span style={{ margin: '0 10px', color: 'white' }}>{ currentUser.split("@")[0] }</span> } id="navbarScrollingDropdown">
                  <NavDropdown.Item onClick={ () => logout() } style={{ margin: '0 0px', color: '#F472B6', fontWeight: 'bold' }}>Log Out</NavDropdown.Item>
                </NavDropdown>
              </>
              :
              <>
                <Nav.Link style={{ margin: '0 10px', color: 'white', flexShrink: 0 }} href="/sign-up">Signup</Nav.Link>
                <Nav.Link style={{ margin: '0 10px', color: 'white', flexShrink: 0 }} href="/login">Login</Nav.Link>
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
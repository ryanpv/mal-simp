import React from 'react'
import { Container, Nav, Navbar, Form, NavDropdown, Button } from 'react-bootstrap'
import { useNavigate, NavLink } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContexts';
import { useAuth } from '../contexts/AuthContext'

function NavBar() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const navigate = useNavigate();
  const animeRef = React.useRef();
  const { setSearchResults, offset, setOffset } = useStateContext();
  const { currentUser, logout, setLoading } = useAuth();



  
  async function submitSearch(e) {
    e.preventDefault();
    // console.log(animeRef.current.value);

    try {
      if (animeRef.current.value === "" || !/\S/.test(animeRef.current.value) || animeRef.current.value.includes('  ')) {
        alert("Invalid search input. Ensure no double spacing")
      }

      const animeSearch = await fetch(`animeRef.current.value}/animesearch/${ offset }/anime?q=${ new URLSearchParams(animeRef.current.value) }`)
      const animeSearchResults = await animeSearch.json()
      setSearchResults(animeSearchResults)
      setOffset(0)
      
      navigate(`/search-results?anime=${animeRef.current.value}`)
    } catch (err) {
      console.log(err);
    }
    
    animeRef.current.value = null

  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">MAL-Simp</Navbar.Brand>
          <Navbar.Toggle aria-controls='NavbarScroll' />
          <Navbar.Collapse id="navbarScroll">

          {/* <Nav className="me-auto" bg="light" variant="tabs"> */}
          <Nav className='me-auto my-2 my-lg-0' style={ { maxHeight: '100px' } } navbarScroll>
            <NavLink className='nav-link' to="/">Home</NavLink>
            <NavDropdown menuVariant='dark' title="Anime" id="navbarScrollingDropdown">
              <NavLink className='nav-link' to='/top-upcoming-anime'>Top Upcoming Anime</NavLink>
              <NavLink className='nav-link' to='/seasonal-anime'>Seasonal Anime</NavLink>
              <NavLink className='nav-link' to="/user-recommendations">Your Recommendations</NavLink>
            </NavDropdown>
            {/* <Nav.Link href="/seasonal-anime" eventKey="1" to="/seasonal-anime">Seasonal Anime</Nav.Link> */}
            <NavLink className='nav-link' to="/user-MAL">MAL</NavLink>
            <NavLink className='nav-link' to="/user-anime-list">MySimpList</NavLink>
          </Nav>

          <Form className='me-auto' onSubmit={(e) => submitSearch(e)}>
            <Form.Control className="" type='text' ref={animeRef} placeholder='Search Anime'></Form.Control>
          </Form>

          <Nav>
            { currentUser ? 
            <>
            <Nav.Link bg='light'>{currentUser.email} currently logged in</Nav.Link> 
            <Button variant='outline-light' onClick={() => logout()}>Log Out</Button>
            </>
            :
            <>
            <Nav.Link href="/login">Log In</Nav.Link>
            <Nav.Link href="sign-up">Sign Up</Nav.Link> 
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
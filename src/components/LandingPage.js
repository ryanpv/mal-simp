import React from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { BsArrowRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
    <div className='mt-3 mb-3 text-center'>
      <h1 >WorldAnime</h1>
      <h3>Look up anime titles and save them to your watch list!</h3>
    </div>

    <Container className="pt-5" style={ { backgroundColor: "white" } }>
      <div className='pb-5 ps-5 pe-5'>
        <p className='text-center'>***This site is undergoing some changes. Please excuse the appearance!***</p>

        <div className='text-center mb-5'>
          <Row>
            <Col></Col>
            <Col xs={6}>
          <Card>
            <Card.Img variant='top' src={ require("../mal-simp-gif.gif") } bg="light" />
          </Card>
            
            </Col>
            <Col></Col>
          </Row>

          {/* <img src={ require("../mal-simp-gif.gif") } style={ { height: 350 } } alt='site gif' /> */}
        </div>

        <div className="text-center">
          <Button className='mb-5' onClick={ () => navigate('/home') } style={ { backgroundColor: "#1976D2" } }>Go To Homepage</Button>
        </div>

        <p>
          As an anime fan, I developed this web app as a personal project so that anime fans, like myself, could quickly look up 
          information/trailers on anime titles and organize them in different categories. This web app is inspired by MyAnimeList and built using their API.
          MyAnimeList is a fantastic site, but I wanted to build a more "lite" version of it to focus primarily on anime titles. As time goes on, I will
          include more features, but for now I will avoid the "scope creep" and continue to focus on the site's current functionalities/performance.
        </p>

        <h3>How to use:</h3>
        <p>
          Simply use the navigation bar to see different anime rankings, such as "Top-upcoming" and "Seasonal" animes. For "Seasonal" animes, you will be 
          able to query for different years as well. The homepage will show the current "Top Airing Anime". I have implemented infinite scroll 
          on these pages so you can simply keep scrolling to see more titles. You can also use the search bar to look up any anime available in the 
          MyAnimeList database.
          <br></br>
          <br></br>
          To see the trailers and the full synopsis (if available) click on the poster/card. There should be a modal pop-up. If you would like to save the 
          anime title to watch it later, you can click on the "Add to list" button on the top left of the modal pop-up. All of your saved titles will be
          available in the "Watch Lists" tab on the navigation bar. You can remove any titles from there also. However, be warned, this list will disappear
          if you clear your browsers cache.
          <br></br>
          <br></br>
          If you'd like a more personal experience, you can sign-up using the "Sign Up" button on the right side of the navigation bar. This will allow you
          to organize the anime titles you want to save into categories created by you. To do so, simply login/signup and go to the "Watch Lists" tab and
          the feature will be available as long as you're logged in. You can also delete any category, but this will also remove all saved titles associated
          with it. We store this information in a database so you won't have to worry about losing it when clearing your browsers cache.
          <br></br>
          <br></br>
          When you log into your account for this site, there will be an option for you to log into your MyAnimeList account and see the list of titles that you have 
          saved on their site. There is also an option to see which anime titles MyAnimeList has recommended to you from that list. You must have an account with 
          WorldAnime to use this feature on this site.
        </p>
      </div>
    </Container>

    <footer className='mt-5 text-center'>
      <p>
        Thanks for stopping by! To check out my other projects or connect with me, you can visit one of my links: 
        <ul style={ { listStyleType: "none" } }>
          <li>
            <BsArrowRight/>
            <a href='https://github.com/ryanpv'> My Github</a>
          </li>
          <li>
            <BsArrowRight/>
            <a href='https://ryanvoong.dev/'> Portfolio Site</a>
          </li>
          <li>
            <BsArrowRight/>
            <a href='https://www.linkedin.com/in/ryandvoong/'> LinkedIn</a>
          </li>
        </ul>
      </p>
    </footer>
    </>
  )
}

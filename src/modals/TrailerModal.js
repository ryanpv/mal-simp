import React from 'react'
import { Button, ButtonGroup, DropdownButton, Dropdown, Modal } from 'react-bootstrap'
import { useStateContext } from '../contexts/StateContexts'
import TrailerPagination from '../trailerPagination';
import { useAuth } from '../contexts/AuthContext';

function TrailerModal(props) {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const { animeDetails, currentPage, setCurrentPage, categoryList, setCategoryContents, categoryContents, additionalContent, setAdditionalContent } = useStateContext();
  const indexOfTrailerDisplayed = currentPage - 1 // only displaying 1 video each tab so - 1 to get the video index
  const currentTrailer = animeDetails.videos && animeDetails.videos.slice(indexOfTrailerDisplayed, currentPage)
  const [categorySelect, setCategorySelect] = React.useState('')
  const { currentUser } = useAuth();
  const firebaseToken  = currentUser && currentUser.accessToken


  async function saveToCategory(value) {
    try { 
      const body = {
        animeId: animeDetails.id,
        animeTitle: animeDetails.title,
        main_picture: animeDetails.main_picture,
        num_episodes: animeDetails.num_episodes,
        mean: animeDetails.mean !== undefined ? animeDetails.mean : 'Currently unavailable.',      
        categoryName: value
      }
      const postAnime = await fetch(`${ serverUrl }/add-anime`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ firebaseToken }`
        },
        body: JSON.stringify(body)
      });

      alert(`Added to ${ value.toUpperCase() }`)
    } catch (err) {
      console.log(err);
    };
  };

  function categoryDropdown() {
    if (categoryList.length > 0) {
      return categoryList.map(category => {
        return (
          <Dropdown.Item key={ categoryList.indexOf(category) } eventKey={ category }>{ category }</Dropdown.Item>
        );
      });
    };
  };

  
  return (
    <>
    <Modal
      { ...props }
      show={ props.show }
      onHide={ props.onHide }
      // backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={ false }
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            { firebaseToken ? 
            <>
            <DropdownButton
            as={ ButtonGroup }
            title="Add to list "
            id="bg-vertical-dropdown"
            onSelect={ (e) => saveToCategory(e) }>
              <Dropdown.Item eventKey="Watch Later">Watch Later</Dropdown.Item>
              { categoryDropdown() }
              {/* { categoryList ? categoryDropdown() : null } */}
            </DropdownButton>{'   '}
              </>
            : null }
            {animeDetails.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body >
          {/* <h4>Centered Modal</h4> */}

          { animeDetails.videos &&
           animeDetails.videos.length > 0 ? 
           <>
          {/* <p>{ animeDetails.videos.length } videos available ***REMOVE THIS***</p>    */}
           
          <p><strong>Score: </strong> { animeDetails.mean }</p>
          
          { animeDetails.videos ? <TrailerPagination animeDetails={animeDetails} /> : null }

          { currentTrailer.map(trailer => (
            <div key={trailer.id}>

            <iframe
              title={ `${ trailer.title} Trailer` }
              width="100%"
              height="435"
              src={ trailer.url.includes('youtube') ? trailer.url.replace("watch?v=", "embed/") 
              : trailer.url.replace("youtu.be/","www.youtube.com/embed/") }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              />
              </div>
          )) }
      
          </>
          : <p>No trailers available</p> }
          <br></br>
          <p>
            <strong>Synopsis: </strong>
            <br></br>
            { animeDetails.synopsis }
          </p>



        </Modal.Body>
        {/* <Modal.Footer>footer</Modal.Footer> */}

    </Modal>
    </>
  )
}

export default TrailerModal
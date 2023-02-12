import React from 'react'
import { useStateContext } from './contexts/StateContexts'
import { Button, ButtonGroup, Nav, ToggleButton } from 'react-bootstrap';

function TrailerPagination({animeDetails}) {
  const { currentPage, setCurrentPage, setCurrentTrailer } = useStateContext();
  const pageNumbers = [];
  const paginate = (pageNumber) => {
    // const indexOfLastVideo = pageNumber // usually method to find index of last item in array slice
    // const indexOfTrailerDisplayed = indexOfLastVideo - 1 // page number start with 1, which we minus to get actual index
    setCurrentPage(pageNumber) // when we click on 
  }

  for (let i = 1; i <= animeDetails.videos.length; i++) {
    pageNumbers.push(i)
    // console.log(currentPage);
  }


  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <div className='ml-2' key={number}>
            <li key={number} className='trailer-item'>
              <div className="ml">
                <Button size='sm' variant='outline-primary' onClick={() => paginate(number)}>{`Trailer #${number}`}</Button>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </nav>
  )
}

export default TrailerPagination  
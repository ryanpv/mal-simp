import React from 'react'
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContexts'
import { Container, Button, Form, Row, Col, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import { useAuth } from '../contexts/AuthContext';
import DeleteModal from '../modals/DeleteModal';
import SyncLoader from 'react-spinners/SyncLoader';

export default function UserSavedList() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const { categoryList, setCategoryList, setLastAddedCategory, errorMessage } = useStateContext();
  const { handleShow } = useDisplayContext();
  const { currentUser } = useAuth();
  // const firebaseToken = currentUser && currentUser.accessToken;
  const categoryRef = React.useRef();
  const selectRef = React.useRef();
  // const [lastAddedCategory, setLastAddedCategory] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [categoryContents, setCategoryContents] = React.useState([])
  const [show, setShow] = React.useState(false);
  const [paginationTitles, setPaginationTitles] = React.useState({ firstTitle: '', lastTitle: '' });
  const [fetchCount, setFetchCount] = React.useState(10);
  const [formErrors, setFormErrors] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('')

  const getLocalStorageAnime = JSON.parse(localStorage.getItem("tempUser"))

  const RemoveAnimeBtn = (props) => {
    return (
      <>
        <Dropdown>
          <DropdownButton variant="light" size="sm" title="" onSelect={ (e) => removeAnime({ categoryName: props.anime.categoryName, animeId: parseInt(e) }) }>
            <Dropdown.Item eventKey={props.anime.animeId}>Delete</Dropdown.Item>
          </DropdownButton>
        </Dropdown>
      </>
    )
  }

  async function removeAnime(animeInfo) {
    try {
      if (!currentUser && getLocalStorageAnime.length > 0) {
        const filterAnime = getLocalStorageAnime.filter((anime) => animeInfo.animeId !== anime.animeId);
        localStorage.setItem("tempUser", JSON.stringify(filterAnime));

        if (filterAnime.length === 0) {
          setCategoryContents([])
        } else {
          setCategoryContents(filterAnime);
        }
      } else if (currentUser) {
        await fetch(`${ serverUrl }/remove-anime`, {
          method: 'DELETE',
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(animeInfo)
        });
      }

    } catch (err) {
      setError(err)
    }
  };

  const AnimeResultList = (props) => {
    return (
      <tr>
        <td>
          <Button onClick={ () => handleShow({ id:props.anime.animeId }) } variant='link'><img alt={ `${props.anime.animeTitle} thumbnail` } 
          src={ props.anime.main_picture.medium } width={75} height={100} /></Button>
        </td>
        <td>{props.anime.mean}</td>
        <td>
          <ButtonGroup>
            <RemoveAnimeBtn anime={props.anime} />
            <Button onClick={ () => handleShow({ id:props.anime.animeId }) } variant='link'>{props.anime.animeTitle}</Button>
          </ButtonGroup>
        </td>
        <td>{ props.anime.num_episodes }</td>
      </tr>
    )
  };

  const displaySearchedAnime = () => {
    if (currentUser && categoryContents && categoryContents.length > 0) {
      return categoryContents.map(anime => {
        return (
          <AnimeResultList anime={ anime } key={ anime.animeId } />
        )
      });
    } else if (!currentUser && getLocalStorageAnime.length > 0) {
      return getLocalStorageAnime.map(anime => {
        return (
          <AnimeResultList anime={ anime } key={ anime.animeId } />
        );
      });
    } else {
      return null;
    }
  };


async function fetchCategoryContent(e, value) { // called on category select
  e.preventDefault();
  setSelectedCategory(value)
  try {
    if (!currentUser) {
      setLoading(true)

      if (getLocalStorageAnime.length > 0) {
        setCategoryContents(getLocalStorageAnime)
      } else {
        console.log("no content saved")
        setCategoryContents([])
      }

      setLoading(false)
    } else if (currentUser) {
      setLoading(true)
      const fetchContent = await fetch(`${ serverUrl }/get-content/${ value }`,{
        credentials:'include',
      });
      const fetchResult = await fetchContent.json();
      setCategoryContents(fetchResult);
      setLoading(false)
      if (fetchResult.length > 0) {
        setPaginationTitles({ 
          firstTitle: fetchResult[0].animeTitle,
          lastTitle: fetchResult[fetchResult.length - 1].animeTitle 
        });
      } else {
        setCategoryContents([])
      }
  
      setFetchCount(fetchResult.length)
    }
  } catch (err) {
    setLoading(false) // Loading must be reset since fetchResult.length === 0 throws err
    setCategoryContents([])
    setError(err)
  }
  // onSelect should update state which will cause the table to render
};

async function fetchNextPage(e) {
  e.preventDefault();
  try {
    const fetchContent = await fetch(`${ serverUrl }/content-paginate-forward/${ selectedCategory }/${ paginationTitles.lastTitle }`,{
      credentials:'include'
    });

    const nextPage = await fetchContent.json()
    setCategoryContents((prev) => prev.concat(nextPage) );
    setFetchCount(nextPage.length)
    if (nextPage.length === 10) {
      setPaginationTitles({ 
            firstTitle: nextPage[0].animeTitle,
            lastTitle: nextPage[nextPage.length - 1].animeTitle
          });
      }
  } catch (err) {
    console.log(err);
  };
};

async function addNewCategory(e) {
  e.preventDefault();
  const categoryInput = categoryRef.current.value
  const checkCategoryDuplicate = categoryList.filter(category => category.toLowerCase() === categoryInput.toLowerCase())
  try {
    if (!currentUser) {
      throw Error('Forbidden action, no user logged in') 
    } else if (currentUser) {
      if (categoryInput === "" || !/\S/.test(categoryInput) || categoryInput.includes('  ')) {
        setFormErrors("Please enter proper category name. Ensure no double spacing.")
      } else if (checkCategoryDuplicate.length > 0) {
        setFormErrors('Category already exists.')
      } else if(categoryList.length >= 25) { 
        setFormErrors('Maximum amount of categories reached.') // limit users' categories amount
      } else {
          await fetch(`${ serverUrl }/create-category`, {
            method: 'POST',
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ categoryName: categoryInput })
          }); 
          setLastAddedCategory(categoryInput)
          setFormErrors('')
          alert(`'${ categoryInput }' added as a category`)
        }
    }
  } catch (err) {
    console.log(err);
  }
  categoryRef.current.value = ""
};

function deleteBtn() {
  setShow(prev => !prev)
};


  return (
  <>
    <Container>
      { currentUser ? 
        <Form onSubmit={ (e) => addNewCategory(e) }>
          <Row className="w-50 mb-3 mt-3">
            <Form.Group as={ Col }>
              <Form.Label>Select Category</Form.Label>
              <Form.Select ref={selectRef} onChange={ (e) => fetchCategoryContent(e, e.target.value) }>
                <option defaultValue='select category...'>Select category...</option>
                <option value='Watch Later'>Watch Later</option>
                { categoryList.length > 0 ? categoryList.map(title => <option key={ categoryList.indexOf(title) } value={ title} >{ title }</option>) : null }
              </Form.Select>
              </Form.Group>
            <Form.Group as={ Col }>
              <Form.Label>Add new category</Form.Label>
              <Form.Control type='text' ref={categoryRef} placeholder='New Category' isInvalid={ !!formErrors }/>
              <Form.Control.Feedback type='invalid'>
                { formErrors }
              </Form.Control.Feedback>
            </Form.Group> 
          </Row>
        </Form>
      :
      <div className='text-center'>
      < h3>Forgot to <Link to='/login'>Log in</Link>? or <Link to='/sign-up'>Sign up</Link> to create your own categories</h3>
      </div>
      }
    </Container>

  { 
  // currentUser ? 
      loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> :
        <table className='table table-striped' style={ { marginTop: 20 } }>
        <thead>
          <tr>
            <th style={ { border: "1px solid black", width: 150 } }>
              { selectedCategory !== "" ? selectedCategory : "" }{'   '}

              { selectedCategory === "" ? null
              : selectedCategory === "Select category..." ? null // default selection value
              : selectedCategory === "Watch Later" ? null // default category
              : <Button size="sm" onClick={ deleteBtn } variant='danger' value='del'>-</Button> }
            </th>

            <th style={ { margin: 20, border: "1px solid black", padding: "10px 10px", width: 200 } }>Score</th>
            <th style={ { border: "1px solid black", padding: "10px 10px" } }>Anime Title</th>
            <th style={ { border: "1px solid black", padding: "10px 10px" } }>No. Episodes</th>
          </tr>
        </thead>
        <tbody>{ loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> : displaySearchedAnime() }</tbody>
      </table>
    // :
    // <>
    // <div className='text-center'>
    //     <h1>401 UNAUTHORIZED - { errorMessage !== '' ? errorMessage : null }</h1>
    //     <h3><Link to='/login'>Log in</Link> or <Link to='/sign-up'>Sign up</Link> to save anime titles</h3>
    //   </div> 
    //   <Navigate replace to='/login' />
    // </> 
  }

  { categoryContents.length > 9 && fetchCount === 10 ?
      <div className='text-center mb-2'>
        <Button onClick={ (e) => fetchNextPage(e) }>Load More</Button> 
      </div>
    : null 
  }

    <DeleteModal selectedCategory={ selectedCategory } show={ show } setShow={ setShow } categoryList={ categoryList } 
    setCategoryList={ setCategoryList } setSelectedCategory={ setSelectedCategory } setCategoryContents={ setCategoryContents } />
  </>

  )
};

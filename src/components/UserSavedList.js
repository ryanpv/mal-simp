import React from 'react'
import { useParams, useNavigate, Link, redirect, Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/StateContexts'
import { Container, Button, Form, Row, Col, Dropdown, DropdownButton, ButtonGroup, InputGroup } from 'react-bootstrap';
import { useDisplayContext } from '../contexts/DisplayDataContext';
import { useAuth } from '../contexts/AuthContext';
import DeleteModal from '../modals/DeleteModal';

export default function UserSavedList() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const { categoryList, setCategoryList, categoryContents, setCategoryContents, setLastAddedCategory, errorMessage } = useStateContext();
  const { handleShow } = useDisplayContext();
  const { currentUser } = useAuth();
  const firebaseToken = currentUser && currentUser.accessToken;
  const categoryRef = React.useRef();
  const selectRef = React.useRef();
  // const [lastAddedCategory, setLastAddedCategory] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [paginationTitles, setPaginationTitles] = React.useState({ firstTitle: '', lastTitle: '' });
  const [fetchCount, setFetchCount] = React.useState(10);
  const [formErrors, setFormErrors] = React.useState('');

  const params = useParams();
  const navigate = useNavigate();


  // React.useEffect(() => {
  //   async function getCategories() {
  //     if (firebaseToken) {
  //       const fetchCategories = await fetch('http://localhost:6969/get-categories', {
  //         credentials: "include",
  //         headers: {
  //           Authorization: `Bearer ${ firebaseToken }`
  //         }
  //       });
  
  //       const response = await fetchCategories.json();
  //       const responseArr = await response.map(title => {return {categoryName: title}})
  //       setCategoryList(response)
  //       console.log(responseArr);
  //     } else {
  //       console.log('fetch category error');
  //     }
  //   };
  //   getCategories();
  // }, [lastAddedCategory, currentUser]);



  const RemoveAnimeBtn = (props) => {
    return (
      <>
        <Dropdown>
          <DropdownButton variant="light" size="sm" title="" onSelect={ (e) => removeAnime({ categoryName: props.anime.categoryName, animeId: e }) }>
            <Dropdown.Item eventKey={props.anime.animeId}>Delete</Dropdown.Item>
          </DropdownButton>
        </Dropdown>
      </>
    )
  }

  async function removeAnime(animeInfo) {
    await fetch(`${ serverUrl }/remove-anime`, {
      method: 'DELETE',
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${ firebaseToken }`
      },
      body: JSON.stringify(animeInfo)
    });
    // const updateContentList = categoryContents.filter(anime => anime.animeId.toString() !== animeInfo.animeId.toString())
    // setCategoryContents(updateContentList)
    // console.log(updateContentList);
  }

  const AnimeResultList = (props) => {
    return (
      <tr>
        {/* <td></td> */}
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
  }

  const displaySearchedAnime = () => {
    if (categoryContents.length > 0) {
      return categoryContents.map(anime => {
        return (
          <AnimeResultList anime={ anime } key={ anime.animeId } />
        )
      });
    };
    return ;
  };


async function fetchCategoryContent(e, value) { // called on category select
  e.preventDefault();
  setSelectedCategory(value)
  try {
    const fetchContent = await fetch(`${ serverUrl }/get-content/${ value }`,{
      credentials:'include',
      headers: {
        Authorization: `Bearer ${ firebaseToken }`
      },
    });
    const fetchResult = await fetchContent.json();

    setCategoryContents(fetchResult);
    if (fetchResult.length > 0) {
      setPaginationTitles({ 
        firstTitle: fetchResult[0].animeTitle,
        lastTitle: fetchResult[fetchResult.length - 1].animeTitle 
      });
    };

    setFetchCount(fetchResult.length)
  
    // console.log('category: ', value)
    // console.log('test', fetchResult)
  } catch (err) {
    console.log(err);
  }

  // onSelect should update state which will cause the table to render
};

async function fetchNextPage(e) {
  e.preventDefault();
  try {
    const fetchContent = await fetch(`${ serverUrl }/content-paginate-forward/${ selectedCategory }/${ paginationTitles.lastTitle }`,{
      credentials:'include',
      headers: {
        Authorization: `Bearer ${ firebaseToken }`
      },
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
      // console.log('length', nextPage.length);
  } catch (err) {
    console.log(err);
  };
};


async function addNewCategory(e) {
  e.preventDefault();
  const categoryInput = categoryRef.current.value
  const checkCategoryDuplicate = categoryList.filter(category => category.toLowerCase() === categoryInput.toLowerCase())
  try {

    if (categoryInput === "" || !/\S/.test(categoryInput) || categoryInput.includes('  ')) {
      setFormErrors("Please enter proper category name. Ensure no double spacing.")
    } else if (checkCategoryDuplicate.length > 0) {
      setFormErrors('Category already exists.')
    } else if(categoryList.length >= 25) { 
      setFormErrors('Maximum amount of categories reached.') // limit users' categories amount
    } else {
        const postCategory = await fetch(`${ serverUrl }/create-category`, {
          method: 'POST',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ firebaseToken }`
          },
          body: JSON.stringify({ categoryName: categoryInput })
        });
        // console.log(categoryRef.current.value)   
        setLastAddedCategory(categoryInput)
        setFormErrors('')
        alert(`'${ categoryInput }' added as a category`)

      }

    } catch (err) {
      console.log(err);
    }
    categoryRef.current.value = ""
}

function deleteBtn() {
  setShow(prev => !prev)
}


  return (
  <>
    { firebaseToken ? 
      <Container>
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
      </Container>
    : null }


  { firebaseToken ?
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
      <tbody>{ displaySearchedAnime() }</tbody>
    </table>

    :
    <>
    <div className='text-center'>
        <h1>401 UNAUTHORIZED - { errorMessage !== '' ? errorMessage : null }</h1>
        <h3><Link to='/login'>Log in</Link> or <Link to='/sign-up'>Sign up</Link> to save anime titles</h3>
      </div> 
      <Navigate replace to='/login' />
    </> 
  }

  { categoryContents.length > 0 && fetchCount === 10 ?
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

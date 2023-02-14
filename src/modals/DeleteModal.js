import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function DeleteModal(props) {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const handleClose = () => props.setShow(false);
  const categoryDeleteRef = React.useRef('');
  const [deleteInput, setDeleteInput] = React.useState({ category: ""});
  const { currentUser } = useAuth();
  const firebaseToken = currentUser && currentUser.accessToken;

  function handleDelete(value) {
    return setDeleteInput((prev) => {
      return { ...prev, ...value };
    });
  };

  // (function() {(deleteInput.category === props.selectedCategory ? console.log('true') : console.log(false))})()

  async function deleteCategory(e) {
    e.preventDefault();
    try {
      if (deleteInput.category === props.selectedCategory) {
        await fetch(`${ serverUrl }/delete-category/${ props.selectedCategory }`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${ firebaseToken }`,
          },
        });
        props.setCategoryList(props.categoryList.filter((category) => category !== props.selectedCategory ));
        props.setSelectedCategory("");
        props.setCategoryContents([]);
        props.setShow(false);
        console.log('deleted ', props.selectedCategory);
      }
      return ;

    } catch (err) {
      console.log(err);
    };
  };


  return (
    <>
      <Modal show={ props.show } onHide={ handleClose }>
        <Modal.Header closeButton>
          <Modal.Title>DELETE "{ props.selectedCategory }" Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Type in category name to confirm delete. (<i>Case sensitive</i>)
          <form 
          onSubmit={ (e) => deleteCategory(e) }
          >
            <label>Category</label>
            &nbsp;
            <input id="category_name" ref={ categoryDeleteRef } 
            onChange={ (e) => handleDelete({ category: e.target.value }) }
            >
            </input>
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={ handleClose }>
            Close
          </Button>

          { deleteInput.category === props.selectedCategory ? // current.value should === 
          <Button onClick={ (e) => deleteCategory(e) } variant="danger" >
            Confirm Delete
          </Button>
          : 
          <Button variant="danger" disabled>
          Confirm Delete
        </Button> }

        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteModal
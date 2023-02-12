import React, { useRef } from 'react'
import { Button, Card, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(emailRef.current.value, passwordRef.current.value)
      console.log(`logged in as ${ emailRef.current.value }`);
      navigate('/user-anime-list')

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Log In</h2>
          {/* {error && <Alert variant='danger'>{error}</Alert>} */}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Button variant="outline-primary" className='w-100 mt-2' type='submit'>Log In.</Button>
          </Form>

            <Button onClick={ loginWithGoogle } variant="outline-primary" className='w-100 mt-2' type='submit'>Google Sign in</Button>
            <Button variant='link' size='sm' onClick={ loginWithGoogle }>
              <img src={require('./google-signin-logo.png')} alt='google sign-in logo' width={150} />
            </Button>

          {/* <div className='w-100 text-center mt-3'>
            <Link to="/admin/forgot-password">Forgot Password?</Link> 
          </div> */}

        </Card.Body>
      </Card>
    </>
  )
}

import React, { useRef } from 'react'
import { Button, Card, Container, Form, Alert } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, loginWithGoogle, error, setError, currentUser, setUserEmailStore } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(emailRef.current.value, passwordRef.current.value)
    } catch (err) {
      console.log('login error: ', err);
      return setError(err)
    }
  }

  function userEmailRef (value) {
    return setUserEmailStore((prev) => {
      return { ...prev, ...value }
    })
  }

  return (
    <>
    { currentUser !== 'undefined' ? 
    <>
      <Container className="mt-4" style={{ maxWidth: '325px' }}>
        <Card>
          <Card.Body>
            <h2 className='text-center mb-4'>Log In</h2>
            { error && <Alert variant='danger'>{error}</Alert> }

            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" onChange={ (e) => userEmailRef({ setUserEmailStore: e.target.value }) } ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>

              <Button variant="outline-primary" className='w-100 mt-4' type='submit'>Log In.</Button>
            </Form>
          <hr></hr>
          </Card.Body>
            <div className='mb-2 text-center'>
              <Button variant='link' size='sm' onClick={ loginWithGoogle }>
                <img src={require('./google-signin-logo.png')} alt='google sign-in logo' width={150} />
              </Button>
            </div>
        </Card>

            <div className='w-100 text-center mt-4'>
              <Link to='/forgot-password'>Forgot Password?</Link>
            </div>
      </Container>

      <div className='text-center mt-3' style={{ color: 'white' }}>
          <p>Don't have an account? Go to the <Link to='/sign-up'>Sign Up</Link> page</p>
      </div>
    </>
   : <Navigate replace to='/' /> }
</>
  )
}

import React, { useRef } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
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

      navigate('/user-anime-list')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
    <Container className="mt-4" style={{ maxWidth: '325px' }}>
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

            <Button variant="outline-primary" className='w-100 mt-4' type='submit'>Log In.</Button>
          </Form>
        </Card.Body>
          <div className='mt-2 mb-2 text-center'>
            <Button variant='link' size='sm' onClick={ loginWithGoogle }>
              <img src={require('./google-signin-logo.png')} alt='google sign-in logo' width={150} />
            </Button>
          </div>
      </Card>

          <div className='w-100 text-center mt-4'>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
    </Container>

    <div className='text-center mt-3'>
        <p>Don't have an account? Go to the <Link to='/sign-up'>Sign Up</Link> page</p>
      </div>
    </>
  )
}

import React, { useRef } from 'react'
import { Button, Card, Form, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export default function ForgotPassword() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await resetPassword(emailRef.current.value)
      // console.log(`password reset for ${ emailRef.current.value }`);
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
          <h2 className='text-center mb-4'>Password Reset</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button variant="outline-primary" className='w-100 mt-2' type='submit'>Reset Password</Button>
          </Form>
          <hr></hr>

          <div className='mt-3 text-center'>
            <Button variant='link' size='sm' onClick={ loginWithGoogle }>
              <img src={require('./google-signin-logo.png')} alt='google sign-in logo' width={150} />
            </Button>
          </div>
          <div className='w-100 text-center'>
            <p>Back to <Link to='/login'>Login</Link></p>
          </div>
          
        </Card.Body>
      </Card>
    </Container>

    <div className='w-100 text-center'>
      Don't have an account? <Link to='/sign-up'>Sign Up</Link>
    </div>
    </>
  )
}

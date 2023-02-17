import React, { useRef } from 'react'
import { Button, Card, Form, Alert } from 'react-bootstrap'
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

          <Button onClick={ loginWithGoogle } variant="outline-primary" className='w-100 mt-2' type='submit'>Google Sign in</Button>
        
          <div className='mt-3 text-center'>
            <Button variant='link' size='sm' onClick={ loginWithGoogle }>
              <img src={require('./google-signin-logo.png')} alt='google sign-in logo' width={150} />
            </Button>
          </div>
          <div className='w-100 text-center'>
            <Link to='/forgot-password'>Login</Link>
          </div>
          
                  </Card.Body>
                </Card>


          <div className='w-100 text-center'>
            Don't have an account? <Link to='/sign-up'>Sign Up</Link>
          </div>



          {/* <div className='w-100 text-center mt-3'>
            <Link to="/admin/forgot-password">Forgot Password?</Link> 
          </div> */}
    </>
  )
}

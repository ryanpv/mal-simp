import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { redirect } from 'react-router-dom';

function LogCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const baseUrl = process.env.NODE_ENV === 'development' && process.env.REACT_APP_SERVER_BASEURL
    const code = `${location.search.split('=')[1]}`;
    // console.log(code);

    async function retrieveMalToken() {
      const malToken = await fetch(`${ baseUrl }/mal-auth?code=${ code }`, { credentials: 'include' })

    };

    retrieveMalToken();
    navigate('/')

  })
  
  
  return (
    <>
    <div>LogCallback</div>


    </>
  )
}

export default LogCallback
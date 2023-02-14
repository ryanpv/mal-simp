import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { redirect } from 'react-router-dom';

function LogCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
    const code = `${location.search.split('=')[1]}`;
    // console.log(code);

    async function retrieveMalToken() {
      const malToken = await fetch(`${ serverUrl }/mal-auth?code=${ code }`, { credentials: 'include' })

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
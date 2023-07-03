import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function LogCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
    const code = `${location.search.split('=')[1]}`;

    async function retrieveMalToken() {
      await fetch(`${ serverUrl }/mal-auth?code=${ code }`, { method: 'POST', credentials: 'include' })
      console.log('log callback execution');

    };

    retrieveMalToken();
    navigate('/')

  },[])
  
  
  return (
    <>
    <div>LogCallback</div>


    </>
  )
}

export default LogCallback
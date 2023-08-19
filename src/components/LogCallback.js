import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/StateContexts';

function LogCallback() {
  const { setMalUserDetails } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
    const code = `${location.search.split('=')[1]}`;

    async function retrieveMalToken() {
      const malTokenRequest = await fetch(`${ serverUrl }/mal-auth?code=${ code }`, { method: 'POST', credentials: 'include' })
      const malUsernameRequest = await malTokenRequest.json();

      setMalUserDetails(malUsernameRequest);
    };

    retrieveMalToken();
    navigate('/user-MAL')

  },[])
  
  
  return (
    <>
    <div>LogCallback</div>


    </>
  )
}

export default LogCallback
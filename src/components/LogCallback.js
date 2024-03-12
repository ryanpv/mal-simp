import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/StateContexts';

function LogCallback() {
  const { setMalUserDetails } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const code = `${location.search.split('=')[1]}`;
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {    
  if (!loading) {
    retrieveMalToken();

    navigate('/user-recommendations')
  }
  },[])
  
  async function retrieveMalToken() {
    setLoading(true);
    try {
      const malTokenRequest = await fetch(`${ serverUrl }/mal-auth?code=${ code }`, { method: 'POST', credentials: 'include' })
      const malUsernameRequest = await malTokenRequest.json();
  
      setMalUserDetails(malUsernameRequest);
    } catch (error) {
      console.log("Error retrieving MAL token: ", setMalUserDetails)
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
    <div>LogCallback</div>


    </>
  )
}

export default LogCallback
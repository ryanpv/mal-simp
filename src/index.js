import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StateProvider } from './contexts/StateContexts';
import { BrowserRouter } from 'react-router-dom';
import {DisplayDataProvider} from './contexts/DisplayDataContext';
import NavBar from './components/NavBar';
import { AuthProvider } from './contexts/AuthContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <StateProvider>
      <AuthProvider>
        <DisplayDataProvider>
          <NavBar />
          <App />
        </DisplayDataProvider>
      </AuthProvider>
    </StateProvider>
  </BrowserRouter>


  // {/* </React.StrictMode> */}
);

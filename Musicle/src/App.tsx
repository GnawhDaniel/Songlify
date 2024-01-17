import { useState, useEffect } from 'react';
import WebPlayback from './components/WebPlayback.tsx'
import Login from './components/Login'
import './App.css';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {

    async function getToken() {
      const response = await fetch('http://localhost:5000/auth/token');
      const json = await response.json();
      console.log(json);
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
        {/* { (token === '') ? <Login/> : <h1>Token</h1> } */}
    </>
  );
}


export default App;